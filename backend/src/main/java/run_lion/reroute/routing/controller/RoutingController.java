package run_lion.reroute.routing.controller;

import lombok.extern.slf4j.Slf4j;
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

@Slf4j
@RestController
@RequestMapping("/api/routing")
public class RoutingController {

    private final RoutingService routingService;
    private final RoutingAlgorithm routingAlgorithm;

    public RoutingController(RoutingService routingService, RoutingAlgorithm routingAlgorithm) {
        this.routingService = routingService;
        this.routingAlgorithm = routingAlgorithm;
    }

    @PostMapping("/route")
    public ResponseEntity<RoutingResponse> findRouteByCoordinates(@RequestBody RoutingRequest request) {
        return ResponseEntity.ok(routingService.findRoute(request));
    }

    @GetMapping("/route")
    public ResponseEntity<List<RouteCandidate>> findRouteByStationIds(
            @RequestParam String from,
            @RequestParam String to) {
        return ResponseEntity.ok(routingService.findRouteByStationIds(from, to));
    }

    @GetMapping("/stations/nearby")
    public ResponseEntity<List<StopCandidate>> findNearbyStations(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(required = false, defaultValue = "500") int radius) {
        return ResponseEntity.ok(routingService.findNearbyStations(lat, lon, radius));
    }

    @PostMapping("/search")
    public ResponseEntity<RouteResponse> search(@RequestBody RouteSearchRequest request) {
        log.info("[ROUTING] request origin=({},{}), dest=({},{})",
                request.getOriginLat(), request.getOriginLng(),
                request.getDestLat(), request.getDestLng());

        return ResponseEntity.ok(routingAlgorithm.computeBestRoute(request));
    }
}
