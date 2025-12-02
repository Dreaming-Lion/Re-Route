package run_lion.reroute.realtimebus.dto;

import lombok.Data;

@Data
public class ArrivalResponse {

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
        private Items items;
    }

    @Data
    public static class Items {
        private Item[] item;
    }

    @Data
    public static class Item {
        private String routeId;
        private String routeNm;
        private int predictTime1;
        private int predictTime2;
        private int nodeOrd;
        private String vehId;
    }
}