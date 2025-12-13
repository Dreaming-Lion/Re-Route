/**
 * File: TagoArrivalResponse.java
 * Description:
 *  - TAGO 도착정보조회 API(JSON) 응답 구조 DTO
 *  - response → header/body → items/item 구조를 그대로 매핑
 *  - 단일/복수 item 대응을 위해 ACCEPT_SINGLE_VALUE_AS_ARRAY 적용
 */

package run_lion.reroute.realtimebus.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class TagoArrivalResponse {

    /** 최상위 response 필드 */
    private Response response;

    @Data
    public static class Response {
        /** API 응답 헤더 */
        private Header header;

        /** API 응답 본문 */
        private Body body;
    }

    @Data
    public static class Header {
        /** 결과 코드 */
        private String resultCode;

        /** 결과 메시지 */
        private String resultMsg;
    }

    @Data
    public static class Body {
        /** 도착 정보 배열 */
        private Items items;

        /** 페이징: 페이지당 데이터 수 */
        private int numOfRows;

        /** 페이징: 현재 페이지 번호 */
        private int pageNo;

        /** 페이징: 전체 데이터 수 */
        private int totalCount;
    }

    @Data
    public static class Items {
        /** item이 하나인 경우에도 배열로 매핑 */
        @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
        private Item[] item;
    }

    @Data
    public static class Item {

        /** 남은 정류장 수 */
        private int arrprevstationcnt;

        /** 도착 예정 시간(초 단위) */
        private int arrtime;

        /** 정류소 ID */
        private String nodeid;

        /** 정류소명 */
        private String nodenm;

        /** 노선 ID */
        private String routeid;

        /** 노선 번호 (숫자만 제공되는 구조) */
        private int routeno;

        /** 노선 유형 */
        private String routetp;

        /** 버스 차량 유형 */
        private String vehicletp;
    }
}