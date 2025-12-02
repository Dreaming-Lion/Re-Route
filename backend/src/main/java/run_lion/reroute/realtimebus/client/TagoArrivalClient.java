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

    private final RestTemplate restTemplate;

    @Value("${api.tago.key}")
    private String serviceKey;

    @Value("${api.tago.cityCode}")
    private String cityCode;

    public List<RealtimeArrivalDto> getArrivals(String nodeId) {

        String url =
                "http://apis.data.go.kr/1613000/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList?" +
                        "serviceKey=" + serviceKey +
                        "&cityCode=" + cityCode +
                        "&nodeId=" + nodeId +
                        "&numOfRows=50&pageNo=1&_type=json";

        log.info("[TAGO Request] {}", url);

        TagoArrivalResponse response =
                restTemplate.getForObject(url, TagoArrivalResponse.class);

        List<RealtimeArrivalDto> result = new ArrayList<>();

        if (response == null ||
                response.getResponse() == null ||
                response.getResponse().getBody() == null ||
                response.getResponse().getBody().getItems() == null) {
            return result;
        }

        var items = response.getResponse().getBody().getItems().getItem();
        if (items == null) return result;

        // 배열 for-each
        for (var item : items) {

            int seconds = item.getArrtime();
            int minutes = (seconds + 59) / 60; // 초 → 분 (올림 처리)

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