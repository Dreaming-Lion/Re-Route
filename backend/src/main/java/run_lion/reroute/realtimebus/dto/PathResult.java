package run_lion.reroute.realtimebus.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PathResult {
    private String routeId;
    private String routeName;
    private int remainMinutes;
}