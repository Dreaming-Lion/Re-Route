/**
 * File: TagoArrivalClient.java
 * Description:
 *  - TAGO 도착정보조회 API 호출 클라이언트
 *  - 정류소(nodeId) 기준 실시간 도착 예정 버스 목록 조회
 *  - 응답(JSON) 파싱 후 RealtimeArrivalDto 리스트로 변환하여 서비스 계층에 제공
 */

package run_lion.reroute.realtimebus.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import run_lion.reroute.realtimebus.dto.RealtimeArrivalDto;
import run_lion.reroute.realtimebus.dto.TagoArrivalResponse;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class TagoArrivalClient {

    /** RestTemplate (빈 주입) */
    private final RestTemplate restTemplate;

    /** TAGO 인증키 */
    @Value("${api.tago.key}")
    private String serviceKey;

    /** 도시코드 */
    @Value("${api.tago.cityCode}")
    private String cityCode;

    /**
     * 정류소 기준 도착 예정 버스 조회
     * @param nodeId 정류소 ID(nodeId)
     * @return RealtimeArrivalDto 리스트
     */
    public List<RealtimeArrivalDto> getArrivals(String nodeId) {

        // 요청 URL 수동 구성
        String url =
                "http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList?" +
                        "serviceKey=" + serviceKey +
                        "&cityCode=" + cityCode +
                        "&nodeId=" + nodeId +
                        "&numOfRows=50&pageNo=1&_type=json";

        log.info("[TAGO Request] {}", url);

        // TAGO API 호출
        TagoArrivalResponse response =
                restTemplate.getForObject(url, TagoArrivalResponse.class);

        List<RealtimeArrivalDto> result = new ArrayList<>();

        // 응답 NULL 방어 로직
        if (response == null ||
                response.getResponse() == null ||
                response.getResponse().getBody() == null ||
                response.getResponse().getBody().getItems() == null) {
            return result;
        }

        var items = response.getResponse().getBody().getItems().getItem();
        if (items == null) return result;

        // 각 도착 정보(item)를 DTO로 변환
        for (var item : items) {

            int seconds = item.getArrtime();     // 도착 예정 초
            int minutes = (seconds + 59) / 60;   // 초 → 분 (올림 처리)

            RealtimeArrivalDto dto = new RealtimeArrivalDto(
                    item.getRouteid(),
                    String.valueOf(item.getRouteno()),
                    minutes,
                    item.getArrprevstationcnt()
            );

            result.add(dto);
        }

        return result;
    }
}