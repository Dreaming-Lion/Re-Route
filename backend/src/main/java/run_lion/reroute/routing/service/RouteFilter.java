package run_lion.reroute.routing.service;

import org.springframework.stereotype.Service;
import run_lion.reroute.routing.dto.RouteCandidate;
import run_lion.reroute.routing.entity.Route;
import run_lion.reroute.routing.entity.RouteStation;
import run_lion.reroute.routing.entity.Station;
import run_lion.reroute.routing.repository.RouteRepository;
import run_lion.reroute.routing.repository.RouteStationRepository;
import run_lion.reroute.routing.repository.StationRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 노선 필터링 서비스
 *
 * 출발 정류장에서 도착 정류장까지 갈 수 있는 버스 노선을 찾아줌
 *
 * 동작 방식:
 * 1. 출발 정류장과 도착 정류장을 모두 경유하는 노선 찾기
 * 2. 출발 → 도착 방향이 맞는지 확인 (역방향 제외)
 * 3. RouteCandidate 형태로 반환
 */
@Service
public class RouteFilter {

    private final RouteRepository routeRepository;
    private final RouteStationRepository routeStationRepository;
    private final StationRepository stationRepository;

    public RouteFilter(RouteRepository routeRepository,
                       RouteStationRepository routeStationRepository,
                       StationRepository stationRepository) {
        this.routeRepository = routeRepository;
        this.routeStationRepository = routeStationRepository;
        this.stationRepository = stationRepository;
    }

    /**
     * 출발 정류장에서 도착 정류장까지 갈 수 있는 노선 목록 조회
     *
     * @param departureStationId 승차 정류장 ID
     * @param arrivalStationId 하차 정류장 ID
     * @return 가능한 노선 후보 목록
     */
    public List<RouteCandidate> filterRoutes(String departureStationId, String arrivalStationId) {
        // 1. 두 정류장을 연결하는 노선 ID 목록 조회
        List<String> routeIds = routeStationRepository.findRoutesConnecting(
                departureStationId, arrivalStationId
        );

        if (routeIds.isEmpty()) {
            return new ArrayList<>();
        }

        // 2. 노선 정보 조회
        List<Route> routes = routeRepository.findByRouteIdIn(routeIds);
        Map<String, Route> routeMap = routes.stream()
                .collect(Collectors.toMap(Route::getRouteId, r -> r));

        // 3. 정류장 정보 조회
        Station departureStation = stationRepository.findById(departureStationId).orElse(null);
        Station arrivalStation = stationRepository.findById(arrivalStationId).orElse(null);

        // 4. 각 노선별로 RouteCandidate 생성
        List<RouteCandidate> candidates = new ArrayList<>();

        for (String routeId : routeIds) {
            Route route = routeMap.get(routeId);
            if (route == null) continue;

            // 해당 노선의 정류장 순서 조회
            List<RouteStation> routeStations = routeStationRepository
                    .findByRouteIdOrderByStationOrderAsc(routeId);

            // 출발/도착 정류장의 순서 찾기
            int departureOrder = -1;
            int arrivalOrder = -1;

            for (RouteStation rs : routeStations) {
                if (rs.getStationId().equals(departureStationId)) {
                    departureOrder = rs.getStationOrder();
                }
                if (rs.getStationId().equals(arrivalStationId)) {
                    arrivalOrder = rs.getStationOrder();
                }
            }

            // RouteCandidate 생성
            RouteCandidate candidate = new RouteCandidate();
            candidate.setRouteId(routeId);
            candidate.setRouteName(route.getRouteName());
            candidate.setDepartureStationId(departureStationId);
            candidate.setDepartureStationName(
                    departureStation != null ? departureStation.getStationName() : ""
            );
            candidate.setDepartureStationOrder(departureOrder);
            candidate.setArrivalStationId(arrivalStationId);
            candidate.setArrivalStationName(
                    arrivalStation != null ? arrivalStation.getStationName() : ""
            );
            candidate.setArrivalStationOrder(arrivalOrder);
            candidate.setStationCount(arrivalOrder - departureOrder);

            candidates.add(candidate);
        }

        return candidates;
    }

    /**
     * 특정 정류장에서 탈 수 있는 모든 노선 조회
     *
     * @param stationId 정류장 ID
     * @return 해당 정류장을 경유하는 노선 ID 목록
     */
    public List<String> findRoutesAtStation(String stationId) {
        List<RouteStation> routeStations = routeStationRepository.findByStationId(stationId);

        return routeStations.stream()
                .map(RouteStation::getRouteId)
                .distinct()
                .collect(Collectors.toList());
    }
}