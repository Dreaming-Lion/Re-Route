package run_lion.reroute.routing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


// 프론트에서 보내주는 경로 탐색 요청 DTO

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteSearchRequest {

    private double originLat;
    private double originLng;

    private double destLat;
    private double destLng;

}
