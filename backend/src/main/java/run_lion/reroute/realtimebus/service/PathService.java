package run_lion.reroute.realtimebus.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import run_lion.reroute.realtimebus.client.ArrivalClient;
import run_lion.reroute.realtimebus.dto.ArrivalResponse;
import run_lion.reroute.realtimebus.dto.PathResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PathService {

    private final ArrivalClient arrivalClient;
    private final RouteService routeService;

    public List<PathResult> findPath(String from, String to) {

        ArrivalResponse arrival = arrivalClient.getArrivalList(from);

        List<PathResult> results = new ArrayList<>();

        if (arrival.getResponse().getBody().getItems() == null) {
            return results;
        }

        for (ArrivalResponse.Item item : arrival.getResponse().getBody().getItems().getItem()) {

            String routeId = item.getRouteId();

            Map<String, Integer> seqMap = routeService.getStationSeqMap(routeId);

            if (!seqMap.containsKey(from) || !seqMap.containsKey(to)) {
                continue;
            }

            int fromSeq = seqMap.get(from);
            int toSeq = seqMap.get(to);
            int nowSeq = item.getNodeOrd();

            if (fromSeq <= nowSeq && nowSeq < toSeq) {
                results.add(PathResult.builder()
                        .routeId(routeId)
                        .routeName(item.getRouteNm())
                        .remainMinutes(item.getPredictTime1())
                        .build()
                );
            }
        }

        return results;
    }
}