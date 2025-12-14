/**
 * File: PathResult.java
 * Description:
 *  - 실시간 경로 조회 결과 DTO
 *  - 노선 ID, 노선명, 남은 도착 시간(분) 정보를 전달
 *  - PathService → Controller 응답용 단순 데이터 구조
 */

package run_lion.reroute.realtimebus.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PathResult {

    /** 노선 ID */
    private String busId;

    /** 노선 번호 또는 이름 */
    private String busNo;

    /** 도착 예정 시간(분 단위) */
    private int arrTimeMin;

    /** 남은 정류장 수 */
    private int prevStationCount;
}