/**
 * File: RouteService.java
 * Description:
 *  - 노선(routeId)별 정류장 순서 조회 서비스
 *  - RouteClient로 TAGO 노선 경유정류소 목록 조회 후 nodeId → 순번 매핑 생성
 *  - RouteCache로 노선별 정류장 순번 정보를 캐싱하여 API 호출 최소화
 */

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

    /** TAGO 노선 경유정류소 조회 클라이언트 */
    private final RouteClient routeClient;

    /** 노선 정류장 순번 캐시 */
    private final RouteCache routeCache;

    /**
     * 노선별 정류소 순서 조회 (캐싱 적용)
     * @param routeId 노선 ID
     * @return nodeId → 순번 매핑(Map)
     */
    public Map<String, Integer> getStationSeqMap(String routeId) {

        // 캐시 존재 시 즉시 반환
        if (routeCache.exists(routeId)) {
            return routeCache.get(routeId);
        }

        // TAGO API 조회
        RouteStationResponse response = routeClient.getRouteStations(routeId);

        Map<String, Integer> seqMap = new HashMap<>();

        // 응답에서 정류소 목록 파싱
        if (response.getResponse().getBody().getItems() != null) {
            for (RouteStationResponse.Item item : response
                    .getResponse()
                    .getBody()
                    .getItems()
                    .getItem()) {

                seqMap.put(item.getNodeid(), item.getNodeord());
            }
        }

        // 캐시 저장
        routeCache.save(routeId, seqMap);

        return seqMap;
    }
}