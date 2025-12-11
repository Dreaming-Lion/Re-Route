package run_lion.reroute.routing.entity;

import java.io.Serializable;
import java.util.Objects;

/**
 * RouteStation의 복합키 클래스
 *
 * 왜 필요한가요?
 * - RouteStation 테이블은 (route_id, station_id) 두 컬럼이 함께 PK
 * - JPA에서 복합키를 사용하려면 별도의 ID 클래스가 필요
 * - Serializable 구현 + equals/hashCode 필수
 */
public class RouteStationId implements Serializable {

    private String routeId;
    private String stationId;

    // 기본 생성자 필수
    public RouteStationId() {
    }

    public RouteStationId(String routeId, String stationId) {
        this.routeId = routeId;
        this.stationId = stationId;
    }

    // Getters
    public String getRouteId() {
        return routeId;
    }

    public String getStationId() {
        return stationId;
    }

    // equals & hashCode - 복합키 비교에 필수
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RouteStationId that = (RouteStationId) o;
        return Objects.equals(routeId, that.routeId)
                && Objects.equals(stationId, that.stationId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(routeId, stationId);
    }
}