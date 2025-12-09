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
