package run_lion.reroute.routing.dto;

/**
 * 후보 정류장 정보를 담는 DTO
 *
 * DTO(Data Transfer Object)란?
 * - 데이터를 담아서 계층 간에 전달하는 객체
 * - Entity와 달리 DB와 직접 연결되지 않음
 * - 필요한 정보만 담아서 전달 (가공된 데이터)
 *
 * 사용 예시:
 *   사용자 위치에서 가까운 정류장 목록을 반환할 때
 *   → 정류장 정보 + 도보 시간을 함께 담아서 전달
 */
public class StopCandidate {

    private String stationId;           // 정류장 ID
    private String stationName;         // 정류장 이름
    private double lat;                 // 위도
    private double lon;                 // 경도
    private double distanceFromOrigin;  // 출발지에서의 거리 (미터)
    private int walkTimeFromOrigin;     // 출발지에서 도보 시간 (분)

    // 기본 생성자
    public StopCandidate() {
    }

    // 모든 필드를 받는 생성자
    public StopCandidate(String stationId, String stationName, double lat, double lon,
                         double distanceFromOrigin, int walkTimeFromOrigin) {
        this.stationId = stationId;
        this.stationName = stationName;
        this.lat = lat;
        this.lon = lon;
        this.distanceFromOrigin = distanceFromOrigin;
        this.walkTimeFromOrigin = walkTimeFromOrigin;
    }

    // Getter & Setter
    public String getStationId() {
        return stationId;
    }

    public void setStationId(String stationId) {
        this.stationId = stationId;
    }

    public String getStationName() {
        return stationName;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLon() {
        return lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }

    public double getDistanceFromOrigin() {
        return distanceFromOrigin;
    }

    public void setDistanceFromOrigin(double distanceFromOrigin) {
        this.distanceFromOrigin = distanceFromOrigin;
    }

    public int getWalkTimeFromOrigin() {
        return walkTimeFromOrigin;
    }

    public void setWalkTimeFromOrigin(int walkTimeFromOrigin) {
        this.walkTimeFromOrigin = walkTimeFromOrigin;
    }
}
