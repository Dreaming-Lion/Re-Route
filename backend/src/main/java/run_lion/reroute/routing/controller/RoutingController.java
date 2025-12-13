package run_lion.reroute.routing.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import run_lion.reroute.routing.dto.RouteCandidate;
import run_lion.reroute.routing.dto.RouteResponse;
import run_lion.reroute.routing.dto.RouteSearchRequest;
import run_lion.reroute.routing.dto.RoutingRequest;
import run_lion.reroute.routing.dto.RoutingResponse;
import run_lion.reroute.routing.dto.StopCandidate;
import run_lion.reroute.routing.service.RoutingAlgorithm;
import run_lion.reroute.routing.service.RoutingService;

import java.util.List;

/**
 * 경로 탐색 REST API 컨트롤러
 *
 * 제공 API:
 * - POST /api/routing/route : 좌표 기반 경로 탐색 (A 파트 후보)
 * - GET  /api/routing/route : 정류장 ID 기반 경로 탐색 (A 파트 후보)
 * - GET  /api/routing/stations/nearby : 근처 정류장 조회
 * - POST /api/routing/search : 최적 경로 계산 (B 파트 최종)
 */
@RestController
@RequestMapping("/api/routing")
public class RoutingController {

    private final RoutingService routingService;
    private final RoutingAlgorithm routingAlgorithm;

    // 생성자 주입
    public RoutingController(RoutingService routingService, RoutingAlgorithm routingAlgorithm) {
        this.routingService = routingService;
        this.routingAlgorithm = routingAlgorithm;
    }

    /**
     * 좌표 기반 경로 탐색 (A 파트 후보)
     *
     * POST /api/routing/route
     * Body: { departureLat, departureLon, arrivalLat, arrivalLon }
     */
    @PostMapping("/route")
    public ResponseEntity<RoutingResponse> findRouteByCoordinates(@RequestBody RoutingRequest request) {
        RoutingResponse response = routingService.findRoute(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 정류장 ID 기반 경로 탐색 (A 파트 후보)
     *
     * GET /api/routing/route?from={출발정류장ID}&to={도착정류장ID}
     */
    @GetMapping("/route")
    public ResponseEntity<List<RouteCandidate>> findRouteByStationIds(
            @RequestParam String from,
            @RequestParam String to) {
        List<RouteCandidate> routes = routingService.findRouteByStationIds(from, to);
        return ResponseEntity.ok(routes);
    }

    /**
     * 근처 정류장 조회
     *
     * GET /api/routing/stations/nearby?lat={위도}&lon={경도}&radius={반경(m)}
     */
    @GetMapping("/stations/nearby")
    public ResponseEntity<List<StopCandidate>> findNearbyStations(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(required = false, defaultValue = "500") int radius) {
        List<StopCandidate> stations = routingService.findNearbyStations(lat, lon, radius);
        return ResponseEntity.ok(stations);
    }

    /**
     * 최적 경로 계산 (B 파트 최종)
     *
     * POST /api/routing/search
     * Body: { originLat, originLng, destLat, destLng }
     */
    @PostMapping("/search")
    public ResponseEntity<RouteResponse> search(@RequestBody RouteSearchRequest request) {
        return ResponseEntity.ok(routingAlgorithm.computeBestRoute(request));
    }
}
