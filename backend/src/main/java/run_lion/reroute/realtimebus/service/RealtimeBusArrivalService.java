package run_lion.reroute.realtimebus.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import run_lion.reroute.realtimebus.client.TagoArrivalClient;
import run_lion.reroute.realtimebus.dto.TagoArrivalResponse;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RealtimeBusArrivalService {

    private final TagoArrivalClient tagoArrivalClient;

    public List<Map<String, Object>> getArrivalList(String stationId) {
        return tagoArrivalClient.getArrivalsByStation(stationId);
    }
}