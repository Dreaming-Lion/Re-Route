package run_lion.reroute.realtimebus.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class TagoArrivalResponse {

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
        private int numOfRows;
        private int pageNo;
        private int totalCount;
    }

    @Data
    public static class Items {
        @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
        private Item[] item;
    }

    @Data
    public static class Item {
        private int arrprevstationcnt;
        private int arrtime;
        private String nodeid;
        private String nodenm;
        private String routeid;
        private int routeno;
        private String routetp;
        private String vehicletp;
    }
}