/**
 * File: TagoBusGpsResponse.java
 * Description:
 *  - TAGO 특정 정류소 접근 버스 GPS 정보 응답 DTO
 *  - TAGO가 "items": "" 또는 null 을 내려보내는 불안정한 구조를 감안하여
 *    items를 Object로 받아 서비스에서 안전 변환 처리함
 */

package run_lion.reroute.realtimebus.dto;

import lombok.Data;

@Data
public class TagoBusGpsResponse {

    private Response response;

    @Data
    public static class Response {
        private Header header;
        private Body body;
    }

    @Data
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }

    @Data
    public static class Body {

        /** TAGO는 여기서 "" 또는 {} 또는 null 을 반환할 수 있으므로 Object로 받음 */
        private Object items;

        private int numOfRows;
        private int pageNo;
        private int totalCount;
    }

    /** items가 정상 구조일 때 매핑되는 구조 */
    @Data
    public static class Items {
        private Item[] item;
    }

    @Data
    public static class Item {
        private double gpslati;     // 위도
        private double gpslong;     // 경도
        private String nodenm;      // 정류소명
        private String routenm;     // 노선 번호
        private String routetp;     // 노선 유형
    }
}