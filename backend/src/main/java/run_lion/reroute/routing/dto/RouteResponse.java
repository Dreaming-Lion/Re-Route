package run_lion.reroute.routing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

//최종 경로 응답 DTO
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteResponse {

    // 전체 소요 시간
    private int totalTime;

    // 단계별 정보
    private List<StepResponse> steps;

    // 도착 예정 시간
    private String eta;

    // 출발 마커 정보
    private OriginMarkerResponse originMarker;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OriginMarkerResponse {
        private double lat;
        private double lng;
        private String label;
    }
}
