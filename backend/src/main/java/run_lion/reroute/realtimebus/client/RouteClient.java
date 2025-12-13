/**
 * File: RouteClient.java
 * Description:
 *  - TAGO 버스노선정보조회 API 중 '노선별 경유정류소 목록 조회' 호출 클라이언트
 *  - routeId 기준으로 해당 노선의 전체 정류장 목록을 조회
 *  - serviceKey, cityCode 등 환경변수를 기반으로 요청 URL 생성
 */

package run_lion.reroute.realtimebus.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import run_lion.reroute.realtimebus.dto.RouteStationResponse;

@Component
@RequiredArgsConstructor
public class RouteClient {

    /** TAGO 인증키 */
    @Value("${api.tago.key}")
    private String serviceKey;

    /** 도시코드 */
    @Value("${api.tago.cityCode}")
    private String cityCode;

    /** REST API 호출용 템플릿 */
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 노선 ID 기준 경유 정류소 목록 조회
     * @param routeId 노선ID(routeId)
     * @return RouteStationResponse TAGO 노선별 정류소 목록 응답
     */
    public RouteStationResponse getRouteStations(String routeId) {

        // 요청 URL 생성
        String url = UriComponentsBuilder
                .fromHttpUrl("https://apis.data.go.kr/1613000/BusRouteInfoInqireService/getRouteAcctoThrghSttnList")
                .queryParam("serviceKey", serviceKey)   // API 키
                .queryParam("cityCode", cityCode)       // 도시 코드
                .queryParam("routeId", routeId)         // 노선ID
                .queryParam("numOfRows", 300)           // 충분한 개수 확보
                .queryParam("pageNo", 1)                // 페이지 번호
                .queryParam("_type", "json")            // JSON 응답
                .toUriString();

        // TAGO API 호출 및 응답 매핑
        return restTemplate.getForObject(url, RouteStationResponse.class);
    }
}