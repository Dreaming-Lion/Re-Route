package run_lion.reroute.routing.service;

import org.springframework.stereotype.Service;
import run_lion.reroute.realtimebus.client.TagoArrivalClient;
import run_lion.reroute.realtimebus.dto.RealtimeArrivalDto;
import run_lion.reroute.routing.dto.ArrivalInfo;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * ETA(도착예정시간) 데이터 제공 서비스
 *
 * TAGO 실시간 API를 통해 버스 도착 예정 정보를 조회
 * B 파트(알고리즘)에서 최적 경로 선택 시 활용
 */
@Service
public class ETARawDataProvider {

    private final TagoArrivalClient tagoArrivalClient;

    public ETARawDataProvider(TagoArrivalClient tagoArrivalClient) {
        this.tagoArrivalClient = tagoArrivalClient;
    }

    /**
     * 특정 정류장의 모든 버스 도착 예정 정보 조회
     *
     * @param stationId 정류장 ID
     * @return 도착 예정 버스 목록
     */
    public List<ArrivalInfo> getArrivalInfo(String stationId) {
        List<RealtimeArrivalDto> arrivals = tagoArrivalClient.getArrivals(stationId);

        return arrivals.stream()
                .map(dto -> new ArrivalInfo(
                        dto.getBusId(),
                        dto.getBusNo(),
                        dto.getArrTimeMin(),
                        dto.getPrevStationCount()
                ))
                .collect(Collectors.toList());
    }

    /**
     * 특정 정류장에서 특정 노선들의 도착 예정 정보만 필터링하여 조회
     *
     * @param stationId 정류장 ID
     * @param routeIds 조회할 노선 ID 목록
     * @return 해당 노선들의 도착 예정 정보
     */
    public List<ArrivalInfo> getArrivalInfoForRoutes(String stationId, List<String> routeIds) {
        List<ArrivalInfo> allArrivals = getArrivalInfo(stationId);
        Set<String> routeIdSet = Set.copyOf(routeIds);

        return allArrivals.stream()
                .filter(info -> routeIdSet.contains(info.getRouteId()))
                .collect(Collectors.toList());
    }

    /**
     * 특정 정류장에서 특정 노선의 도착 예정 정보 조회
     *
     * @param stationId 정류장 ID
     * @param routeId 노선 ID
     * @return 해당 노선의 도착 예정 정보 (없으면 null)
     */
    public ArrivalInfo getArrivalInfoForRoute(String stationId, String routeId) {
        List<ArrivalInfo> allArrivals = getArrivalInfo(stationId);

        return allArrivals.stream()
                .filter(info -> info.getRouteId().equals(routeId))
                .findFirst()
                .orElse(null);
    }

    /**
     * 여러 정류장의 도착 정보를 한번에 조회
     *
     * @param stationIds 정류장 ID 목록
     * @return 정류장별 도착 정보 Map (stationId → List<ArrivalInfo>)
     */
    public Map<String, List<ArrivalInfo>> getArrivalInfoBatch(List<String> stationIds) {
        return stationIds.stream()
                .collect(Collectors.toMap(
                        stationId -> stationId,
                        this::getArrivalInfo
                ));
    }

    /**
     * 가장 빨리 도착하는 버스 정보 조회
     *
     * @param stationId 정류장 ID
     * @return 가장 빨리 도착하는 버스 (없으면 null)
     */
    public ArrivalInfo getNextArrival(String stationId) {
        List<ArrivalInfo> arrivals = getArrivalInfo(stationId);

        return arrivals.stream()
                .min((a, b) -> Integer.compare(a.getArrivalMinutes(), b.getArrivalMinutes()))
                .orElse(null);
    }

    /**
     * 특정 노선들 중 가장 빨리 도착하는 버스 정보 조회
     *
     * @param stationId 정류장 ID
     * @param routeIds 조회할 노선 ID 목록
     * @return 해당 노선들 중 가장 빨리 도착하는 버스 (없으면 null)
     */
    public ArrivalInfo getNextArrivalForRoutes(String stationId, List<String> routeIds) {
        List<ArrivalInfo> arrivals = getArrivalInfoForRoutes(stationId, routeIds);

        return arrivals.stream()
                .min((a, b) -> Integer.compare(a.getArrivalMinutes(), b.getArrivalMinutes()))
                .orElse(null);
    }
}