package run_lion.reroute.routing.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import run_lion.reroute.routing.dto.RouteResponse;
import run_lion.reroute.routing.dto.RouteSearchRequest;

import run_lion.reroute.routing.RoutingService;
/**
 * 경로 탐색 관련 API 컨트롤러
 *
 * POST /api/routes/search
 */
@RestController
@RequestMapping
@RequiredArgsConstructor
public class RoutingController {

    private final RoutingService routingService; // 추후 구현

    /**
     * 경로 탐색 API
     *
     * 요청: 출발지/도착지 좌표
     * 응답: 최적 경로 (totalTime, steps, eta, originMarker)
     */
    @PostMapping("/search")
    public ResponseEntity<RouteResponse> searchRoute(
            @RequestBody RouteSearchRequest request
    ){
        // 핵심 로직은 RoutingService/RoutingAlgorithm 에서 처리
        RouteResponse bestRoute = routingService.searchBestRoute(request);
        return ResponseEntity.ok(bestRoute);
    }
}
