/**
 * File: BusGpsDto.java
 * Description:
 *  - 특정 정류소 접근 버스 GPS 정보 프론트 전달용 DTO
 */

package run_lion.reroute.realtimebus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BusGpsDto {
    private String routeNo;
    private double latitude;
    private double longitude;
    private String stationName;
    private String routeType;
}