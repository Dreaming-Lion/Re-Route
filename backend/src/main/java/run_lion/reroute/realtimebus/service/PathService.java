/**
 * File: PathService.java
 * Description:
 *  - 실시간 버스 경로 계산 서비스
 *  - 특정 정류소(from → to) 기준으로 경유 가능 노선 필터링 및 남은 도착 시간 계산
 *  - ArrivalClient(도착정보) + RouteService(노선 정류장 순서) 조합하여 PathResult 생성
 */

package run_lion.reroute.realtimebus.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import run_lion.reroute.realtimebus.client.ArrivalClient;
import run_lion.reroute.realtimebus.dto.ArrivalResponse;
import run_lion.reroute.realtimebus.dto.PathResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PathService {

    /** 도착 정보 조회 클라이언트 */
    private final ArrivalClient arrivalClient;

    /** 노선별 정류장 순서 조회 서비스 */
    private final RouteService routeService;

    /**
     * 출발 → 도착 정류소 기준 이용 가능한 실시간 버스 경로 조회
     * @param from 출발 정류소 ID
     * @param to   도착 정류소 ID
     * @return PathResult 리스트
     */
    public List<PathResult> findPath(String from, String to) {

        // 출발 정류소 기준 실시간 도착 정보 조회
        ArrivalResponse arrival = arrivalClient.getArrivalList(from);

        List<PathResult> results = new ArrayList<>();

        // NULL 방어
        if (arrival.getResponse() == null ||
                arrival.getResponse().getBody() == null ||
                arrival.getResponse().getBody().getItems() == null ||
                arrival.getResponse().getBody().getItems().getItem() == null) {
            return results;
        }

        // 도착 정보 item 반복 처리
        for (ArrivalResponse.Item item : arrival.getResponse().getBody().getItems().getItem()) {

            String routeId = item.getRouteid();   // 노선 ID
            String routeNo = item.getRouteno();   // 노선 번호(String 형태)
            if (routeId == null || routeNo == null) continue;

            // 노선 전체 경유 정류장 순서 맵
            Map<String, Integer> seqMap = routeService.getStationSeqMap(routeId);
            if (seqMap == null || seqMap.isEmpty()) continue;

            // from 과 to 가 해당 노선에 포함되는지 확인
            if (!seqMap.containsKey(from) || !seqMap.containsKey(to)) continue;

            Integer nowSeq = seqMap.get(from);  // 현재 정류장 도착 기준
            Integer fromSeq = seqMap.get(from);
            Integer toSeq = seqMap.get(to);

            // BUS가 from 이후 → to 이전 방향에 있어야 경로로 인정
            if (fromSeq <= nowSeq && nowSeq < toSeq) {

                // 남은 시간(초 → 분)
                int arrTimeMin = (item.getArrtime() + 59) / 60;

                // 남은 정류장 수
                int prevStationCount = item.getArrprevstationcnt();

                // PathResult DTO 생성
                results.add(PathResult.builder()
                        .busId(routeId)
                        .busNo(routeNo)
                        .arrTimeMin(arrTimeMin)
                        .prevStationCount(prevStationCount)
                        .build()
                );
            }
        }

        return results;
    }
}