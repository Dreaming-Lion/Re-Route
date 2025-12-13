/**
 * File: ArrivalResponse.java
 * Description:
 *  - TAGO 도착정보조회 API(JSON) 응답 구조 DTO
 *  - response → header/body → items/item 형태의 계층 구조를 그대로 매핑
 *  - routeno는 숫자/문자 혼합 가능성이 있어 String으로 처리
 */

package run_lion.reroute.realtimebus.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class ArrivalResponse {

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
        /** API 결과 코드 */
        private String resultCode;

        /** API 결과 메시지 */
        private String resultMsg;
    }

    @Data
    public static class Body {
        /** 응답 item들을 포함하는 items */
        private Items items;
    }

    @Data
    public static class Items {

        /** item이 1개일 때도 배열로 받기 위한 설정 */
        @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
        private Item[] item;
    }

    @Data
    public static class Item {

        /** 노선 ID */
        private String routeid;

        /** 노선 번호(문자/숫자 모두 가능하여 String) */
        private String routeno;

        /** 도착까지 남은 시간(초) */
        private int arrtime;

        /** 남은 정류장 수 */
        private int arrprevstationcnt;

        /** 정류소 ID */
        private String nodeid;

        /** 정류소명 */
        private String nodenm;

        /** 노선 유형 */
        private String routetp;

        /** 차량 유형 */
        private String vehicletp;
    }
}