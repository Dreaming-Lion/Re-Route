package run_lion.reroute.realtimebus.dto;

import lombok.Data;
import java.util.List;

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
        private List<Item> item;
    }

    @Data
    public static class Item {
        private String nodeid;      // 정류장 ID
        private String nodenm;      // 정류장명
        private String routeid;     // 노선 ID
        private String routeno;     // 노선 번호
        private String arrprevstationcnt; // 이전 정류장 수
        private String arrtime;     // 도착까지 남은 시간(초)
        private String vehicletp;   // 차량 형태 (일반/저상)
    }
}