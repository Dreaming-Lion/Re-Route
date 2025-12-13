/**
 * File: PathController.java
 * Description:
 *  - 실시간 버스 경로 조회 API 컨트롤러
 *  - 정류소(from → to) 기준으로 도착 정보와 노선 경유 정보를 조합하여 경로 결과 반환
 *  - /api/bus/realtime/path 엔드포인트 제공
 */

package run_lion.reroute.realtimebus.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import run_lion.reroute.realtimebus.dto.PathResult;
import run_lion.reroute.realtimebus.service.PathService;

import java.util.List;

@RestController
@RequestMapping("/api/bus/realtime")
@RequiredArgsConstructor
public class PathController {

    /** 실시간 경로 계산 서비스 */
    private final PathService pathService;

    /**
     * 정류소 기준 경로 조회
     * @param from 출발 정류소 ID
     * @param to   도착 정류소 ID
     * @return PathResult 리스트
     */
    @GetMapping("/path")
    public List<PathResult> findPath(
            @RequestParam String from,
            @RequestParam String to
    ) {
        return pathService.findPath(from, to);
    }
}