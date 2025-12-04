package run_lion.reroute.realtimebus.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import run_lion.reroute.realtimebus.cache.RouteCache;
import run_lion.reroute.realtimebus.client.RouteClient;
import run_lion.reroute.realtimebus.dto.RouteStationResponse;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final RouteClient routeClient;
    private final RouteCache routeCache;

    public Map<String, Integer> getStationSeqMap(String routeId) {

        if (routeCache.exists(routeId)) {
            return routeCache.get(routeId);
        }

        RouteStationResponse response = routeClient.getRouteStations(routeId);

        Map<String, Integer> seqMap = new HashMap<>();

        if (response.getResponse().getBody().getItems() != null) {
            for (RouteStationResponse.Item item : response.getResponse().getBody().getItems().getItem()) {
                seqMap.put(item.getNodeid(), item.getNodeord());
            }
        }

        routeCache.save(routeId, seqMap);

        return seqMap;
    }
}