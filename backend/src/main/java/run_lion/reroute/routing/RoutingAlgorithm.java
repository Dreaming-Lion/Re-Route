package run_lion.reroute.routing;

import org.springframework.stereotype.Component;
import run_lion.reroute.routing.dto.RouteResponse;
import run_lion.reroute.routing.dto.RouteSearchRequest;
import run_lion.reroute.routing.dto.StepResponse;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class RoutingAlgorithm {

    /**
     * A파트가 아직 없으므로,
     * 일단은 하드코딩된 더미 경로를 반환해서 전체 플로우를 테스트한다.
     */
    public RouteResponse computeBestRoute(RouteSearchRequest request) {

        // 1) 더미 step 리스트 구성
        List<StepResponse> steps = List.of(
                StepResponse.builder()
                        .type("walk")
                        .duration(3)
                        .from("사용자 위치")
                        .to("정류장 A")
                        .build(),
                StepResponse.builder()
                        .type("bus")
                        .line("140")
                        .duration(15)
                        .waitTime(2)
                        .from("정류장 A")
                        .to("정류장 B")
                        .build(),
                StepResponse.builder()
                        .type("walk")
                        .duration(5)
                        .from("정류장 B")
                        .to("목적지")
                        .build()
        );

        int totalTime = 3 + 15 + 5 + 2; // 대충 25분이라고 가정

        // 2) ETA (예시로 현재 시각 + totalTime)
        LocalDateTime arrival = LocalDateTime.now().plusMinutes(totalTime);
        String etaText = arrival.format(DateTimeFormatter.ofPattern("HH:mm")) + " 도착 예정";

        // 3) originMarker 는 요청 좌표 그대로 사용
        RouteResponse.OriginMarkerResponse originMarker =
                RouteResponse.OriginMarkerResponse.builder()
                        .lat(request.getOriginLat())
                        .lng(request.getOriginLng())
                        .label("출발지")
                        .build();

        // 4) 최종 RouteResponse 조립
        return RouteResponse.builder()
                .totalTime(totalTime)
                .steps(steps)
                .eta(etaText)
                .originMarker(originMarker)
                .build();
    }
}
