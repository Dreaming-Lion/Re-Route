package run_lion.reroute.realtimebus.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import run_lion.reroute.realtimebus.client.TagoArrivalClient;
import run_lion.reroute.realtimebus.dto.RealtimeArrivalDto;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RealtimeBusArrivalService {

    private final TagoArrivalClient tagoArrivalClient;

    public List<RealtimeArrivalDto> getRealtimeArrival(String nodeId) {
        return tagoArrivalClient.getArrivals(nodeId);
    }
}