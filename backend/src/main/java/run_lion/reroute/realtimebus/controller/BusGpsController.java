/**
 * File: BusGpsController.java
 * Description:
 *  - 특정 정류소 접근 버스 GPS 정보 조회 API
 */

package run_lion.reroute.realtimebus.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import run_lion.reroute.realtimebus.dto.BusGpsDto;
import run_lion.reroute.realtimebus.service.BusGpsService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/realtime/gps")
public class BusGpsController {

    private final BusGpsService gpsService;

    @GetMapping
    public List<BusGpsDto> getGpsInfo(
            @RequestParam String routeId,
            @RequestParam String stationId
    ) {
        return gpsService.getGpsByStation(routeId, stationId);
    }
}