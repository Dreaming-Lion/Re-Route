/**
 * File: RealtimeBusArrivalController.java
 * Description:
 *  - 실시간 버스 도착 정보 조회 API 컨트롤러
 *  - 정류소 ID(stationId) 기준으로 도착 예정 버스 목록 반환
 *  - /api/realtime/arrival/{stationId} 엔드포인트 제공
 */

package run_lion.reroute.realtimebus.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import run_lion.reroute.realtimebus.dto.RealtimeArrivalDto;
import run_lion.reroute.realtimebus.service.RealtimeBusArrivalService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/realtime/arrival")
public class RealtimeBusArrivalController {

    /** 실시간 도착 정보 서비스 */
    private final RealtimeBusArrivalService arrivalService;

    /**
     * 특정 정류소의 실시간 도착 정보 반환
     * @param stationId 정류소 ID(nodeId)
     * @return RealtimeArrivalDto 리스트
     */
    @GetMapping("/{stationId}")
    public List<RealtimeArrivalDto> getArrival(@PathVariable String stationId) {
        return arrivalService.getRealtimeArrival(stationId);
    }
}