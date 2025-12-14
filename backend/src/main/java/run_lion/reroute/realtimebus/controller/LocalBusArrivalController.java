// backend/src/main/java/run_lion/reroute/realtimebus/controller/LocalArrivalController.java
package run_lion.reroute.realtimebus.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import run_lion.reroute.realtimebus.dto.LocalArrivalDto;
import run_lion.reroute.realtimebus.service.LocalBusArrivalService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/local/arrival")
public class LocalBusArrivalController {

    private final LocalBusArrivalService localBusArrivalService;

    @GetMapping("/{stationId}")
    public List<LocalArrivalDto> getLocalArrivals(
        @PathVariable String stationId,
        @RequestParam(defaultValue = "10") int limit
    ) {
        return localBusArrivalService.getArrivals(stationId, limit);
    }
}
