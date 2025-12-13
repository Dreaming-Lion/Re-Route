package run_lion.reroute.routing.dto;

/**
 * 경로 탐색 요청 DTO
 *
 * 출발지/도착지 좌표를 받아서 버스 경로를 탐색
 */
public class RoutingRequest {

    private double departureLat;  // 출발지 위도
    private double departureLon;  // 출발지 경도
    private double arrivalLat;    // 도착지 위도
    private double arrivalLon;    // 도착지 경도

    // 기본 생성자
    public RoutingRequest() {
    }

    public RoutingRequest(double departureLat, double departureLon,
                          double arrivalLat, double arrivalLon) {
        this.departureLat = departureLat;
        this.departureLon = departureLon;
        this.arrivalLat = arrivalLat;
        this.arrivalLon = arrivalLon;
    }

    // Getters & Setters
    public double getDepartureLat() {
        return departureLat;
    }

    public void setDepartureLat(double departureLat) {
        this.departureLat = departureLat;
    }

    public double getDepartureLon() {
        return departureLon;
    }

    public void setDepartureLon(double departureLon) {
        this.departureLon = departureLon;
    }

    public double getArrivalLat() {
        return arrivalLat;
    }

    public void setArrivalLat(double arrivalLat) {
        this.arrivalLat = arrivalLat;
    }

    public double getArrivalLon() {
        return arrivalLon;
    }

    public void setArrivalLon(double arrivalLon) {
        this.arrivalLon = arrivalLon;
    }
}