package run_lion.reroute.realtimebus.dto;

public class LocalArrivalDto {
    private String route_id;   // routeId가 없으면 null 가능
    private String route_no;
    private int arr_time;      // seconds
    private int prev_station_count; // 시간표면 -1

    public LocalArrivalDto() {}

    public LocalArrivalDto(String route_id, String route_no, int arr_time, int prev_station_count) {
        this.route_id = route_id;
        this.route_no = route_no;
        this.arr_time = arr_time;
        this.prev_station_count = prev_station_count;
    }

    public String getRoute_id() { return route_id; }
    public void setRoute_id(String route_id) { this.route_id = route_id; }

    public String getRoute_no() { return route_no; }
    public void setRoute_no(String route_no) { this.route_no = route_no; }

    public int getArr_time() { return arr_time; }
    public void setArr_time(int arr_time) { this.arr_time = arr_time; }

    public int getPrev_station_count() { return prev_station_count; }
    public void setPrev_station_count(int prev_station_count) { this.prev_station_count = prev_station_count; }
}
