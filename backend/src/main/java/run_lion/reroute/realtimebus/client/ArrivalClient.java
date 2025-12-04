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

    @Value("${api.tago.key}")
    private String serviceKey;

    @Value("${api.tago.cityCode}")
    private String cityCode;

    private final RestTemplate restTemplate = new RestTemplate();

    public ArrivalResponse getArrivalList(String stationId) {

        String url = UriComponentsBuilder
                .fromHttpUrl("https://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList")
                .queryParam("serviceKey", serviceKey)
                .queryParam("cityCode", cityCode)
                .queryParam("nodeId", stationId)
                .queryParam("numOfRows", 50)
                .queryParam("pageNo", 1)
                .queryParam("_type", "json")
                .toUriString();

        return restTemplate.getForObject(url, ArrivalResponse.class);
    }
}