package run_lion.reroute.realtimebus.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import run_lion.reroute.realtimebus.dto.PathResult;
import run_lion.reroute.realtimebus.service.PathService;

import java.util.List;

@RestController
@RequestMapping("/api/bus/realtime")
@RequiredArgsConstructor
public class PathController {

    private final PathService pathService;

    @GetMapping("/path")
    public List<PathResult> findPath(
            @RequestParam String from,
            @RequestParam String to
    ) {
        return pathService.findPath(from, to);
    }
}