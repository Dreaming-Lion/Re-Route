/**
 * File: BusGpsService.java
 * Description:
 *  - 특정 정류소 접근 버스 GPS 위치 반환 서비스
 *  - TAGO가 items="" 또는 null 을 반환하는 경우까지 모두 처리
 */

package run_lion.reroute.realtimebus.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import run_lion.reroute.realtimebus.client.TagoBusGpsClient;
import run_lion.reroute.realtimebus.dto.BusGpsDto;
import run_lion.reroute.realtimebus.dto.TagoBusGpsResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BusGpsService {

    private final TagoBusGpsClient gpsClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<BusGpsDto> getGpsByStation(String routeId, String nodeId) {

        TagoBusGpsResponse response = gpsClient.getGpsInfo(routeId, nodeId);
        List<BusGpsDto> result = new ArrayList<>();

        if (response == null ||
                response.getResponse() == null ||
                response.getResponse().getBody() == null) {
            return result;
        }

        Object rawItems = response.getResponse().getBody().getItems();
        if (rawItems == null) {
            return result; // items가 null or "" 인 경우
        }

        // "" 또는 비정상 응답 처리
        if (rawItems instanceof String s && s.isBlank()) {
            return result;
        }

        // 정상 JSON Map 구조일 때 Items로 변환
        TagoBusGpsResponse.Items items = objectMapper.convertValue(
                rawItems, TagoBusGpsResponse.Items.class
        );

        if (items.getItem() == null) {
            return result;
        }

        for (TagoBusGpsResponse.Item item : items.getItem()) {

            result.add(new BusGpsDto(
                    item.getRoutenm(),
                    item.getGpslati(),
                    item.getGpslong(),
                    item.getNodenm(),
                    item.getRoutetp()
            ));
        }

        return result;
    }
}