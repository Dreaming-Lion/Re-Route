package run_lion.reroute.realtimebus.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import run_lion.reroute.realtimebus.dto.RealtimeArrivalDto;
import run_lion.reroute.realtimebus.service.RealtimeBusArrivalService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/realtime/arrival")
public class RealtimeBusArrivalController {

    private final RealtimeBusArrivalService arrivalService;

    @GetMapping("/{stationId}")
    public List<RealtimeArrivalDto> getArrival(@PathVariable String stationId) {
        return arrivalService.getRealtimeArrival(stationId);
    }
}