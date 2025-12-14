package run_lion.reroute.routing.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import run_lion.reroute.routing.dto.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RoutingAlgorithm {

    private final RoutingService routingService;
    private final ETARawDataProvider etaRawDataProvider;

    /**
     * 버스 이동시간 근사치 정책(분/정거장)
     * - StopTime 등 구간별 시간 데이터가 아직 없으면 이 값으로 근사
     */
    private static final int AVG_MIN_PER_STOP = 2;

    /**
     * arrivals가 없을 때 대기시간 패널티(분)
     * - 실시간이 없으면 "불리"하게 만들어 최적 선택에서 밀리도록
     */
    private static final int NO_ETA_PENALTY_MIN = 30;

    public RouteResponse computeBestRoute(RouteSearchRequest request) {
        // 1) A 파트에 좌표 기반 후보 요청
        RoutingResponse candidateResponse = routingService.findRoute(
                new RoutingRequest(
                        request.getOriginLat(), request.getOriginLng(),
                        request.getDestLat(), request.getDestLng()
                )
        );

        StopCandidate departureStop = candidateResponse.getDepartureStop();
        StopCandidate arrivalStop = candidateResponse.getArrivalStop();
        List<RouteCandidate> routes = candidateResponse.getRoutes();

        // 2) 주변 정류장 자체가 없는 경우
        if (departureStop == null || arrivalStop == null) {
            return buildNoRouteResponse(request);
        }

        // 3) 후보 노선이 없는 경우(직행 노선 없음)
        if (routes == null || routes.isEmpty()) {
            // 도보만 표시하거나 안내 메시지용으로 steps 구성
            return buildWalkOnlyResponse(request, departureStop, arrivalStop);
        }

        // 4) 후보 평가: totalTime 최소 1개 선택
        BestCandidate best = routes.stream()
                .map(rc -> evaluate(rc, departureStop, arrivalStop))
                .min(bestComparator())
                .orElse(null);

        if (best == null) {
            return buildWalkOnlyResponse(request, departureStop, arrivalStop);
        }

        // 5) steps 조립
        int totalTime = best.totalTime;
        String etaText = LocalDateTime.now()
                .plusMinutes(totalTime)
                .format(DateTimeFormatter.ofPattern("HH:mm")) + " 도착 예정";

        List<StepResponse> steps = List.of(
                StepResponse.builder()
                        .type("walk")
                        .duration(best.walk1)
                        .from("출발지")
                        .to(departureStop.getStationName())
                        .build(),
                StepResponse.builder()
                        .type("bus")
                        .line(best.routeCandidate.getRouteName())
                        .duration(best.busTravel)
                        .waitTime(best.waitTime)
                        .from(departureStop.getStationName())
                        .to(arrivalStop.getStationName())
                        .build(),
                StepResponse.builder()
                        .type("walk")
                        .duration(best.walk2)
                        .from(arrivalStop.getStationName())
                        .to("목적지")
                        .build()
        );

        RouteResponse.OriginMarkerResponse originMarker =
                RouteResponse.OriginMarkerResponse.builder()
                        .lat(request.getOriginLat())
                        .lng(request.getOriginLng())
                        .label("출발지")
                        .build();

        return RouteResponse.builder()
                .totalTime(totalTime)
                .steps(steps)
                .eta(etaText)
                .originMarker(originMarker)
                .build();
    }

    /**
     * 후보 1개 평가: 도보/대기/버스이동/총합 계산
     */
    private BestCandidate evaluate(RouteCandidate rc, StopCandidate departureStop, StopCandidate arrivalStop) {
        int walk1 = safeNonNegative(departureStop.getWalkTimeFromOrigin());
        int walk2 = safeNonNegative(arrivalStop.getWalkTimeFromOrigin());

        // waitTime: rc.arrivals 최소 arrivalMinutes 우선 사용, 없으면 ETA Provider로 보완
        int waitTime = resolveWaitTime(rc, departureStop.getStationId());

        // busTravelTime: stationCount 기반 근사(데이터 확장 시 여기만 교체)
        int busTravel = estimateBusTravelTime(rc);

        int totalTime = walk1 + waitTime + busTravel + walk2;

        return new BestCandidate(rc, walk1, walk2, waitTime, busTravel, totalTime);
    }

    private int resolveWaitTime(RouteCandidate rc, String departureStationId) {
        try {
            var arrivals = (List<ArrivalInfo>) rc.getClass()
                    .getMethod("getArrivals")
                    .invoke(rc);

            if (arrivals != null && !arrivals.isEmpty()) {
                return arrivals.stream()
                        .map(ArrivalInfo::getArrivalMinutes)
                        .filter(v -> v >= 0)
                        .min(Integer::compareTo)
                        .orElse(NO_ETA_PENALTY_MIN);
            }
        } catch (Exception ignore) {
        }

        // 2) provider로 보완 (실시간 연동)
        ArrivalInfo info = etaRawDataProvider.getArrivalInfoForRoute(departureStationId, rc.getRouteId());
        if (info == null) return NO_ETA_PENALTY_MIN;

        return safeNonNegative(info.getArrivalMinutes());
    }

    private int estimateBusTravelTime(RouteCandidate rc) {
        int stationCount = rc.getStationCount();
        if (stationCount <= 0) stationCount = Math.max(1, rc.getArrivalStationOrder() - rc.getDepartureStationOrder());
        if (stationCount <= 0) stationCount = 1;

        return stationCount * AVG_MIN_PER_STOP;
    }

    private Comparator<BestCandidate> bestComparator() {
        // 1) totalTime 최소
        // 2) waitTime 최소
        // 3) stationCount 최소(정거장 덜 타는 쪽)
        return Comparator
                .comparingInt((BestCandidate b) -> b.totalTime)
                .thenComparingInt(b -> b.waitTime)
                .thenComparingInt(b -> safeNonNegative(b.routeCandidate.getStationCount()));
    }

    private RouteResponse buildNoRouteResponse(RouteSearchRequest request) {
        String etaText = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")) + " 도착 예정";

        List<StepResponse> steps = List.of(
                StepResponse.builder()
                        .type("walk")
                        .duration(0)
                        .from("출발지")
                        .to("목적지")
                        .build()
        );

        RouteResponse.OriginMarkerResponse originMarker =
                RouteResponse.OriginMarkerResponse.builder()
                        .lat(request.getOriginLat())
                        .lng(request.getOriginLng())
                        .label("출발지")
                        .build();

        return RouteResponse.builder()
                .totalTime(0)
                .steps(steps)
                .eta(etaText)
                .originMarker(originMarker)
                .build();
    }

    private RouteResponse buildWalkOnlyResponse(RouteSearchRequest request, StopCandidate departureStop, StopCandidate arrivalStop) {
        // 정책: 후보 노선이 없으면 도보만 보여주는 응답
        int walk1 = departureStop != null ? safeNonNegative(departureStop.getWalkTimeFromOrigin()) : 0;
        int walk2 = arrivalStop != null ? safeNonNegative(arrivalStop.getWalkTimeFromOrigin()) : 0;
        int total = walk1 + walk2;

        String etaText = LocalDateTime.now()
                .plusMinutes(total)
                .format(DateTimeFormatter.ofPattern("HH:mm")) + " 도착 예정";

        List<StepResponse> steps = List.of(
                StepResponse.builder()
                        .type("walk")
                        .duration(total)
                        .from("출발지")
                        .to("목적지")
                        .build()
        );

        RouteResponse.OriginMarkerResponse originMarker =
                RouteResponse.OriginMarkerResponse.builder()
                        .lat(request.getOriginLat())
                        .lng(request.getOriginLng())
                        .label("출발지")
                        .build();

        return RouteResponse.builder()
                .totalTime(total)
                .steps(steps)
                .eta(etaText)
                .originMarker(originMarker)
                .build();
    }

    private int safeNonNegative(int v) {
        return Math.max(0, v);
    }

    private static class BestCandidate {
        private final RouteCandidate routeCandidate;
        private final int walk1;
        private final int walk2;
        private final int waitTime;
        private final int busTravel;
        private final int totalTime;

        private BestCandidate(RouteCandidate routeCandidate, int walk1, int walk2, int waitTime, int busTravel, int totalTime) {
            this.routeCandidate = routeCandidate;
            this.walk1 = walk1;
            this.walk2 = walk2;
            this.waitTime = waitTime;
            this.busTravel = busTravel;
            this.totalTime = totalTime;
        }
    }
}
