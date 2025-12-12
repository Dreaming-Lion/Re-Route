package run_lion.reroute.routing.dto;

/**
 * 버스 도착 예정 정보 DTO
 *
 * 특정 정류장에 도착 예정인 버스 정보를 담음
 */
public class ArrivalInfo {

    private String routeId;          // 노선 ID
    private String routeName;        // 노선 이름 (예: "140")
    private int arrivalMinutes;      // 도착 예정 시간 (분)
    private int remainingStops;      // 남은 정류장 수

    // 기본 생성자
    public ArrivalInfo() {
    }

    public ArrivalInfo(String routeId, String routeName, int arrivalMinutes, int remainingStops) {
        this.routeId = routeId;
        this.routeName = routeName;
        this.arrivalMinutes = arrivalMinutes;
        this.remainingStops = remainingStops;
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

    public int getArrivalMinutes() {
        return arrivalMinutes;
    }

    public void setArrivalMinutes(int arrivalMinutes) {
        this.arrivalMinutes = arrivalMinutes;
    }

    public int getRemainingStops() {
        return remainingStops;
    }

    public void setRemainingStops(int remainingStops) {
        this.remainingStops = remainingStops;
    }
}