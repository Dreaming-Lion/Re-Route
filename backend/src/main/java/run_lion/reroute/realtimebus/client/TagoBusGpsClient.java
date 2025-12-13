/**
 * File: TagoBusGpsClient.java
 * Description:
 *  - TAGO 특정정류소 접근 버스 GPS 조회 API 호출 클라이언트
 */

package run_lion.reroute.realtimebus.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import run_lion.reroute.realtimebus.dto.TagoBusGpsResponse;

@Component
@RequiredArgsConstructor
public class TagoBusGpsClient {

    private final RestTemplate restTemplate;

    @Value("${api.tago.key}")
    private String serviceKey;

    @Value("${api.tago.cityCode}")
    private String cityCode;

    public TagoBusGpsResponse getGpsInfo(String routeId, String nodeId) {

        String url =
                "http://apis.data.go.kr/1613000/BusLcInfoInqireService/getRouteAcctoSpcifySttnAccesBusLcInfo?" +
                        "serviceKey=" + serviceKey +
                        "&cityCode=" + cityCode +
                        "&routeId=" + routeId +
                        "&nodeId=" + nodeId +
                        "&numOfRows=50&pageNo=1&_type=json";

        return restTemplate.getForObject(url, TagoBusGpsResponse.class);
    }
}