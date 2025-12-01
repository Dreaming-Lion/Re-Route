package run_lion.reroute.realtimebus.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import run_lion.reroute.realtimebus.service.RealtimeBusArrivalService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bus/realtime")
@RequiredArgsConstructor
public class RealtimeBusArrivalController {

    private final RealtimeBusArrivalService arrivalService;

    @GetMapping("/arrival/{stationId}")
    public List<Map<String, Object>> getArrivalList(@PathVariable String stationId) {
        return arrivalService.getArrivalList(stationId);
    }
}