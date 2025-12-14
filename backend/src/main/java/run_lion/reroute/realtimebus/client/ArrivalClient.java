/**
 * File: ArrivalClient.java
 * Description:
 *  - TAGO 버스 도착정보 API 호출 클라이언트
 *  - 정류소 ID 기반 도착 예정 버스 목록을 조회
 *  - serviceKey, cityCode 등 환경변수를 기반으로 요청 URL을 구성
 */

package run_lion.reroute.realtimebus.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import run_lion.reroute.realtimebus.dto.ArrivalResponse;

@Component
@RequiredArgsConstructor
public class ArrivalClient {

    /** TAGO 인증키 */
    @Value("${api.tago.key}")
    private String serviceKey;

    /** 도시코드 */
    @Value("${api.tago.cityCode}")
    private String cityCode;

    /** REST API 호출용 템플릿 */
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 정류소 ID 기준 도착 예정 버스 조회
     * @param stationId 정류소 ID(nodeId)
     * @return ArrivalResponse TAGO 도착 정보 응답
     */
    public ArrivalResponse getArrivalList(String stationId) {

        // 요청 URL 생성
        String url = UriComponentsBuilder
                .fromHttpUrl("https://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList")
                .queryParam("serviceKey", serviceKey)   // API 키
                .queryParam("cityCode", cityCode)       // 도시 코드
                .queryParam("nodeId", stationId)        // 정류소 ID
                .queryParam("numOfRows", 50)            // 조회 개수
                .queryParam("pageNo", 1)                // 페이지 번호
                .queryParam("_type", "json")            // JSON 응답
                .toUriString();

        // TAGO API 호출 및 응답 매핑
        return restTemplate.getForObject(url, ArrivalResponse.class);
    }
}