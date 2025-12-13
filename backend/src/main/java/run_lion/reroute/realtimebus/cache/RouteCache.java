/**
 * File: RouteCache.java
 * Description:
 *  - 노선(routeId)별 정류장 순번(nodeId → 순서) 캐싱 컴포넌트
 *  - TAGO 노선 조회 호출 부담을 줄이기 위해 ConcurrentHashMap 기반 메모리 캐시 제공
 *  - routeId 단위로 캐싱하여 PathService/RouteService 에서 재사용
 */

package run_lion.reroute.realtimebus.cache;

import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Getter
public class RouteCache {

    /** routeId → (nodeId → 순번) 매핑 저장 캐시 */
    private final Map<String, Map<String, Integer>> cache = new ConcurrentHashMap<>();

    /**
     * 노선별 정류장 순서 저장
     */
    public void save(String routeId, Map<String, Integer> seqMap) {
        cache.put(routeId, seqMap);
    }

    /**
     * 노선별 정류장 순서 조회
     */
    public Map<String, Integer> get(String routeId) {
        return cache.get(routeId);
    }

    /**
     * 캐시 존재 여부 확인
     */
    public boolean exists(String routeId) {
        return cache.containsKey(routeId);
    }
}