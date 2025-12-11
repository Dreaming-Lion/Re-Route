package run_lion.reroute.routing.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import run_lion.reroute.routing.dto.RouteCandidate;
import run_lion.reroute.routing.dto.RoutingRequest;
import run_lion.reroute.routing.dto.RoutingResponse;
import run_lion.reroute.routing.dto.StopCandidate;
import run_lion.reroute.routing.service.RoutingService;

import java.util.List;

/**
 * 경로 탐색 REST API 컨트롤러
 *
 * 제공 API:
 * - POST /api/routing/route : 좌표 기반 경로 탐색
 * - GET /api/routing/route : 정류장 ID 기반 경로 탐색
 * - GET /api/routing/stations/nearby : 근처 정류장 조회
 */
@RestController
@RequestMapping("/api/routing")
public class RoutingController {

    private final RoutingService routingService;

    public RoutingController(RoutingService routingService) {
        this.routingService = routingService;
    }

    /**
     * 좌표 기반 경로 탐색
     *
     * POST /api/routing/route
     * Body: { departureLat, departureLon, arrivalLat, arrivalLon }
     */
    @PostMapping("/route")
    public ResponseEntity<RoutingResponse> findRouteByCoordinates(
            @RequestBody RoutingRequest request) {
        RoutingResponse response = routingService.findRoute(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 정류장 ID 기반 경로 탐색
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
}
