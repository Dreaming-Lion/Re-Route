package run_lion.reroute.routing.dto;

import java.util.List;

/**
 * 경로 탐색 응답 DTO
 *
 * 출발 정류장 → 버스 노선 → 도착 정류장 경로 정보를 담음
 */
public class RoutingResponse {

    private StopCandidate departureStop;    // 출발 정류장 (도보로 이동)
    private StopCandidate arrivalStop;      // 도착 정류장 (도보로 이동)
    private List<RouteCandidate> routes;    // 이용 가능한 버스 노선 목록
    private int totalWalkTime;              // 총 도보 시간 (분)
    private String message;                 // 추가 안내 메시지

    // 기본 생성자
    public RoutingResponse() {
    }

    // Getters & Setters
    public StopCandidate getDepartureStop() {
        return departureStop;
    }

    public void setDepartureStop(StopCandidate departureStop) {
        this.departureStop = departureStop;
    }

    public StopCandidate getArrivalStop() {
        return arrivalStop;
    }

    public void setArrivalStop(StopCandidate arrivalStop) {
        this.arrivalStop = arrivalStop;
    }

    public List<RouteCandidate> getRoutes() {
        return routes;
    }

    public void setRoutes(List<RouteCandidate> routes) {
        this.routes = routes;
    }

    public int getTotalWalkTime() {
        return totalWalkTime;
    }

    public void setTotalWalkTime(int totalWalkTime) {
        this.totalWalkTime = totalWalkTime;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}