<<<<<<< HEAD
package run_lion.reroute.routing.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import run_lion.reroute.routing.dto.RouteResponse;
import run_lion.reroute.routing.dto.RouteSearchRequest;

@Service
@RequiredArgsConstructor
public class RoutingService {

    private final RoutingAlgorithm routingAlgorithm; // 나중에 구현

    public RouteResponse searchBestRoute(RouteSearchRequest request) {

        return routingAlgorithm.computeBestRoute(request);
    }
}
=======
package run_lion.reroute.routing.service;

import org.springframework.stereotype.Service;
import run_lion.reroute.routing.dto.RouteCandidate;
import run_lion.reroute.routing.dto.RoutingRequest;
import run_lion.reroute.routing.dto.RoutingResponse;
import run_lion.reroute.routing.dto.StopCandidate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * 경로 추천 통합 서비스
 *
 * 전체 흐름:
 * 1. 출발지 좌표에서 가까운 출발 정류장 찾기 (RoutingStationResolver)
 * 2. 도착지 좌표에서 가까운 도착 정류장 찾기 (RoutingStationResolver)
 * 3. 두 정류장을 연결하는 버스 노선 찾기 (RouteFilter)
 * 4. 결과를 RoutingResponse로 조합하여 반환
 */
@Service
public class RoutingService {

    private final RoutingStationResolver stationResolver;
    private final RouteFilter routeFilter;

    public RoutingService(RoutingStationResolver stationResolver, RouteFilter routeFilter) {
        this.stationResolver = stationResolver;
        this.routeFilter = routeFilter;
    }

    /**
     * 좌표 기반 경로 탐색
     *
     * @param request 출발지/도착지 좌표
     * @return 경로 추천 결과
     */
    public RoutingResponse findRoute(RoutingRequest request) {
        RoutingResponse response = new RoutingResponse();

        // 1. 출발지 근처 정류장 찾기
        Optional<StopCandidate> departureStopOpt = stationResolver.findNearestStation(
                request.getDepartureLat(), request.getDepartureLon()
        );

        if (departureStopOpt.isEmpty()) {
            response.setMessage("출발지 근처에 정류장이 없습니다.");
            response.setRoutes(new ArrayList<>());
            return response;
        }

        // 2. 도착지 근처 정류장 찾기
        Optional<StopCandidate> arrivalStopOpt = stationResolver.findNearestStation(
                request.getArrivalLat(), request.getArrivalLon()
        );

        if (arrivalStopOpt.isEmpty()) {
            response.setMessage("도착지 근처에 정류장이 없습니다.");
            response.setRoutes(new ArrayList<>());
            return response;
        }

        StopCandidate departureStop = departureStopOpt.get();
        StopCandidate arrivalStop = arrivalStopOpt.get();

        // 3. 두 정류장을 연결하는 노선 찾기
        List<RouteCandidate> routes = routeFilter.filterRoutes(
                departureStop.getStationId(),
                arrivalStop.getStationId()
        );

        // 4. 응답 구성
        response.setDepartureStop(departureStop);
        response.setArrivalStop(arrivalStop);
        response.setRoutes(routes);
        response.setTotalWalkTime(
                departureStop.getWalkTimeFromOrigin() + arrivalStop.getWalkTimeFromOrigin()
        );

        if (routes.isEmpty()) {
            response.setMessage("해당 정류장을 연결하는 직행 노선이 없습니다.");
        } else {
            response.setMessage(routes.size() + "개의 노선을 이용할 수 있습니다.");
        }

        return response;
    }

    /**
     * 정류장 ID 기반 경로 탐색
     *
     * @param departureStationId 출발 정류장 ID
     * @param arrivalStationId 도착 정류장 ID
     * @return 이용 가능한 노선 목록
     */
    public List<RouteCandidate> findRouteByStationIds(String departureStationId, String arrivalStationId) {
        return routeFilter.filterRoutes(departureStationId, arrivalStationId);
    }

    /**
     * 특정 좌표 근처 정류장 목록 조회
     *
     * @param lat 위도
     * @param lon 경도
     * @return 근처 정류장 목록
     */
    public List<StopCandidate> findNearbyStations(double lat, double lon) {
        return stationResolver.findNearbyStations(lat, lon);
    }

    /**
     * 특정 좌표 근처 정류장 목록 조회 (반경 지정)
     *
     * @param lat 위도
     * @param lon 경도
     * @param radiusMeters 반경 (미터)
     * @return 근처 정류장 목록
     */
    public List<StopCandidate> findNearbyStations(double lat, double lon, int radiusMeters) {
        return stationResolver.findNearbyStations(lat, lon, radiusMeters);
    }
}
>>>>>>> origin/develop
