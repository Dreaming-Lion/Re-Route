package run_lion.reroute.routing.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

/**
 * STEP 정보
 * ex)
 * {"type" : "walk", "duration" : 3, "from" : "...", "to" : "..."}
 * {"type" : "bus", "line" : "999", "duration" : 15, ...}
 */


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // null 필드는 JSON에 포함 x
public class StepResponse {
    /**
     * 단계 타입
     * -"walk"
     * -"bus"
     */
    private String type;

    /**
     * 이 단계에 걸리는 시간(분)
     * */
    private int duration;

    /**
     * 출발 지점 설명 (주소, 정류장 이름)
     * */
    private String from;

    /**
     * 도착 지점 설명 ('')
     */
    private String to;

    /**
     * if step="bus"
     * 노선 번호 (예: 999)
     */
    private String line;

    /**
     * if step="bus"
     * 대기 시간(분)
     */
    private Integer waitTime;
}
