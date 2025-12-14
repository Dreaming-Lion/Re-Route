/**
 * File: RealtimeArrivalDto.java
 * Description:
 *  - 실시간 버스 도착 정보 응답 DTO
 *  - 노선 ID, 노선번호, 도착 예정 시간(분), 남은 정류장 수 제공
 *  - Controller에서 그대로 클라이언트로 반환되는 단순 전송 객체
 */

package run_lion.reroute.realtimebus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RealtimeArrivalDto {

    /** 노선 ID */
    private String busId;

    /** 노선 번호 */
    private String busNo;

    /** 도착 예정 시간(분 단위) */
    private int arrTimeMin;

    /** 남은 정류장 수 */
    private int prevStationCount;
}