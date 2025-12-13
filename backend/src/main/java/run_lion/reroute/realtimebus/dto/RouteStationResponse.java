/**
 * File: RouteStationResponse.java
 * Description:
 *  - TAGO 노선별 경유정류소 목록조회 API(JSON) 응답 DTO
 *  - response → header/body → items/item 구조를 그대로 매핑
 *  - 노선(routeId)에 해당하는 전체 경유 정류소 목록을 표현
 */

package run_lion.reroute.realtimebus.dto;

import lombok.Data;

@Data
public class RouteStationResponse {

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
        /** 정류소 item 목록 */
        private Items items;
    }

    @Data
    public static class Items {
        /** item 배열 */
        private Item[] item;
    }

    @Data
    public static class Item {

        /** 정류소 ID */
        private String nodeid;

        /** 정류소명 */
        private String nodenm;

        /** 노선 내 정류소 순번 */
        private int nodeord;
    }
}