package run_lion.reroute.realtimebus.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TagoArrivalClient {

    @Value("${api.tago.key}")
    private String serviceKey;

    @Value("${tago.cityCode}")
    private String cityCode;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Map<String, Object>> getArrivalsByStation(String nodeId) {

        String url = UriComponentsBuilder
                .fromHttpUrl("http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList")
                .queryParam("serviceKey", serviceKey)
                .queryParam("cityCode", cityCode)
                .queryParam("nodeId", nodeId)
                .queryParam("_type", "json")
                .queryParam("numOfRows", 10)
                .queryParam("pageNo", 1)
                .toUriString();

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response == null) return Collections.emptyList();

        Map<String, Object> outerResponse = (Map<String, Object>) response.get("response");
        if (outerResponse == null) return Collections.emptyList();

        Map<String, Object> body = (Map<String, Object>) outerResponse.get("body");
        if (body == null) return Collections.emptyList();

        Object itemsObj = body.get("items");
        if (!(itemsObj instanceof Map)) {
            // TAGO가 items="" 로 주는 이상한 케이스
            return Collections.emptyList();
        }

        Map<String, Object> items = (Map<String, Object>) itemsObj;

        Object itemObj = items.get("item");

        if (itemObj == null)
            return Collections.emptyList();

        if (itemObj instanceof List)
            return (List<Map<String, Object>>) itemObj;

        if (itemObj instanceof Map)
            return List.of((Map<String, Object>) itemObj);

        return Collections.emptyList();
    }
}