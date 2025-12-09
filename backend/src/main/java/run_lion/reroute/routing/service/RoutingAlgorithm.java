package run_lion.reroute.routing;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import run_lion.reroute.routing.dto.RouteResponse;
import run_lion.reroute.routing.dto.RouteSearchRequest;
import run_lion.reroute.routing.dto.StepResponse;
import run_lion.reroute.routing.dto.StopCandidate;
import run_lion.reroute.routing.service.RoutingStationResolver;
import run_lion.reroute.routing.util.DistanceCalculator;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class RoutingAlgorithm {

    private final RoutingStationResolver stationResolver;

    public RouteResponse computeBestRoute(RouteSearchRequest request) {
        // 출발지·도착지에서 가장 가까운 정류장 찾기
        Optional<StopCandidate> originOpt = stationResolver.findNearestStation(
                request.getOriginLat(), request.getOriginLng());
        Optional<StopCandidate> destOpt = stationResolver.findNearestStation(
                request.getDestLat(), request.getDestLng());

        // 주변 정류장이 없는 경우: 빈 응답
        if (originOpt.isEmpty() || destOpt.isEmpty()) {
            List<StepResponse> dummySteps = List.of(
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
                    .steps(dummySteps)
                    .eta(LocalDateTime.now()
                            .format(DateTimeFormatter.ofPattern("HH:mm")) + " 도착 예정")
                    .originMarker(originMarker)
                    .build();
        }

        StopCandidate originStop = originOpt.get();
        StopCandidate destStop = destOpt.get();

        // 버스 구간: 아직 실시간 연동이 없으므로 임시값
        int busTravelTime = 10;  // 버스 이동 10분으로 가정
        int waitTime = 0;        // 버스 대기시간 0분
        String busLine = "UNKNOWN"; // 노선 정보 미상

        // 도보 시간: A파트의 StopCandidate와 DistanceCalculator 활용
        int walkToBus = originStop.getWalkTimeFromOrigin();
        double destDistance = DistanceCalculator.calculateDistance(
                destStop.getLat(), destStop.getLon(),
                request.getDestLat(), request.getDestLng()
        );
        int walkFromBus = DistanceCalculator.calculateWalkTime(destDistance);

        // 총 소요시간 계산
        int totalTime = walkToBus + waitTime + busTravelTime + walkFromBus;
        LocalDateTime eta = LocalDateTime.now().plusMinutes(totalTime);
        String etaText = eta.format(DateTimeFormatter.ofPattern("HH:mm")) + " 도착 예정";

        // 각 단계 구성
        List<StepResponse> steps = new ArrayList<>();
        steps.add(StepResponse.builder()
                .type("walk")
                .duration(walkToBus)
                .from("출발지")
                .to(originStop.getStationName())
                .build());
        steps.add(StepResponse.builder()
                .type("bus")
                .line(busLine)
                .duration(busTravelTime)
                .waitTime(waitTime)
                .from(originStop.getStationName())
                .to(destStop.getStationName())
                .build());
        steps.add(StepResponse.builder()
                .type("walk")
                .duration(walkFromBus)
                .from(destStop.getStationName())
                .to("목적지")
                .build());

        // Origin 마커
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
}
