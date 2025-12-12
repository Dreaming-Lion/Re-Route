package run_lion.reroute.routing.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * 후보 경로 정보를 담는 DTO
 *
 * B 파트(알고리즘)에서 최적 경로를 선택할 때 사용
 * 출발 정류장 → 버스 → 도착 정류장 정보를 담음
 */
public class RouteCandidate {

    private String routeId;              // 노선 ID
    private String routeName;            // 노선 이름 (예: "140")

    private String departureStationId;   // 승차 정류장 ID
    private String departureStationName; // 승차 정류장 이름
    private int departureStationOrder;   // 승차 정류장 순서

    private String arrivalStationId;     // 하차 정류장 ID
    private String arrivalStationName;   // 하차 정류장 이름
    private int arrivalStationOrder;     // 하차 정류장 순서

    private int stationCount;            // 경유 정류장 수 (몇 정거장?)

    private List<ArrivalInfo> arrivals = new ArrayList<>();  // 도착 예정 정보

    // 기본 생성자
    public RouteCandidate() {
    }

    // Getters & Setters
    public String getRouteId() {
        return routeId;
    }

    public void setRouteId(String routeId) {
        this.routeId = routeId;
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
    }

    public String getDepartureStationId() {
        return departureStationId;
    }

    public void setDepartureStationId(String departureStationId) {
        this.departureStationId = departureStationId;
    }

    public String getDepartureStationName() {
        return departureStationName;
    }

    public void setDepartureStationName(String departureStationName) {
        this.departureStationName = departureStationName;
    }

    public int getDepartureStationOrder() {
        return departureStationOrder;
    }

    public void setDepartureStationOrder(int departureStationOrder) {
        this.departureStationOrder = departureStationOrder;
    }

    public String getArrivalStationId() {
        return arrivalStationId;
    }

    public void setArrivalStationId(String arrivalStationId) {
        this.arrivalStationId = arrivalStationId;
    }

    public String getArrivalStationName() {
        return arrivalStationName;
    }

    public void setArrivalStationName(String arrivalStationName) {
        this.arrivalStationName = arrivalStationName;
    }

    public int getArrivalStationOrder() {
        return arrivalStationOrder;
    }

    public void setArrivalStationOrder(int arrivalStationOrder) {
        this.arrivalStationOrder = arrivalStationOrder;
    }

    public int getStationCount() {
        return stationCount;
    }

    public void setStationCount(int stationCount) {
        this.stationCount = stationCount;
    }

    public List<ArrivalInfo> getArrivals() {
        return arrivals;
    }

    public void setArrivals(List<ArrivalInfo> arrivals) {
        this.arrivals = arrivals;
    }
}