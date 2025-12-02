package run_lion.reroute.realtimebus.cache;

import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Getter
public class RouteCache {

    private final Map<String, Map<String, Integer>> cache = new ConcurrentHashMap<>();

    public void save(String routeId, Map<String, Integer> seqMap) {
        cache.put(routeId, seqMap);
    }

    public Map<String, Integer> get(String routeId) {
        return cache.get(routeId);
    }

    public boolean exists(String routeId) {
        return cache.containsKey(routeId);
    }
}