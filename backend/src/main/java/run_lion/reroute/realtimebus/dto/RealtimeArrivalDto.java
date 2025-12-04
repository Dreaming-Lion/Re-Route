package run_lion.reroute.realtimebus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RealtimeArrivalDto {
    private String routeId;
    private String routeNo;
    private int arrTimeMin;       // 분 단위
    private int prevStationCount;
}