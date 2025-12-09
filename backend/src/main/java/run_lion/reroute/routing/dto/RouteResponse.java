package run_lion.reroute.routing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 최종 경로 응답 DTO
 *
 * {
 *     "totalTime" : 23,
 *     "step" : [...],
 *     "eta" : "...",
 *     "originMarker" : {...}
 * }
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteResponse {

    /**
     * 전체 소요 시간(분)
     */
    private int totalTime;

    /**
     * 단계별 상세 정보
     */
    private List<StepResponse> steps;

    /**
     * 도착 예정 시간
     * ex) "14:30 도착 예정" or "2025-12-04T14:30:00"
     */
    private String eta;

    /**
     * 출발 위치 마커 정보
     * 프론트에서 지도에 찍을 수 있는 형태로
     */
    private OriginMarkerResponse originMarker;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OriginMarkerResponse {
        private double lat;
        private double lng;
        private String label; // 출발지, 현재 위치 등
    }
}
