/**
 * File: RealtimeBusArrivalService.java
 * Description:
 *  - 실시간 버스 도착 정보 조회 서비스
 *  - TagoArrivalClient를 호출하여 nodeId 기준 도착 예정 버스 목록 반환
 */

package run_lion.reroute.realtimebus.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import run_lion.reroute.realtimebus.client.TagoArrivalClient;
import run_lion.reroute.realtimebus.dto.RealtimeArrivalDto;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RealtimeBusArrivalService {

    /** TAGO 실시간 도착정보 조회 클라이언트 */
    private final TagoArrivalClient tagoArrivalClient;

    /**
     * 특정 정류소의 실시간 도착 정보 조회
     * @param nodeId 정류소 ID
     * @return RealtimeArrivalDto 리스트
     */
    public List<RealtimeArrivalDto> getRealtimeArrival(String nodeId) {
        return tagoArrivalClient.getArrivals(nodeId);
    }
}