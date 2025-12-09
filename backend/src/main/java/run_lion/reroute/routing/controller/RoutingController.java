package run_lion.reroute.routing.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import run_lion.reroute.routing.dto.RouteResponse;
import run_lion.reroute.routing.dto.RouteSearchRequest;
import run_lion.reroute.routing.service.RoutingService;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RoutingController {

    private final RoutingService routingService;

    @PostMapping("/search")
    public ResponseEntity<RouteResponse> searchRoute(
            @RequestBody RouteSearchRequest request
    ){
        RouteResponse bestRoute = routingService.searchBestRoute(request);
        return ResponseEntity.ok(bestRoute);
    }
}
