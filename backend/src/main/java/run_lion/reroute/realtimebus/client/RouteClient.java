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

    @Value("${api.tago.key}")
    private String serviceKey;

    @Value("${api.tago.cityCode}")
    private String cityCode;

    private final RestTemplate restTemplate = new RestTemplate();

    public RouteStationResponse getRouteStations(String routeId) {

        String url = UriComponentsBuilder
                .fromHttpUrl("https://apis.data.go.kr/1613000/BusRouteInfoInqireService/getRouteAcctoThrghSttnList")
                .queryParam("serviceKey", serviceKey)
                .queryParam("cityCode", cityCode)
                .queryParam("routeId", routeId)
                .queryParam("numOfRows", 300)
                .queryParam("pageNo", 1)
                .queryParam("_type", "json")
                .toUriString();

        return restTemplate.getForObject(url, RouteStationResponse.class);
    }
}