package run_lion.reroute.routing.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

/**
 * 노선-정류장 관계 엔티티
 *
 * 어떤 노선이 어떤 정류장을 몇 번째로 경유하는지 정보
 * 예: 140번 버스가 "한국교통대" 정류장을 5번째로 경유
 *
 * @IdClass: 복합키(여러 컬럼이 PK)를 사용할 때 필요
 */
@Entity
@Table(name = "route_station")
@IdClass(RouteStationId.class)
public class RouteStation {

    @Id
    @Column(name = "route_id")
    private String routeId;  // 노선 ID

    @Id
    @Column(name = "station_id")
    private String stationId;  // 정류장 ID

    @Column(name = "station_order")
    private Integer stationOrder;  // 정류장 순서 (1, 2, 3...)

    // 기본 생성자
    protected RouteStation() {
    }

    public RouteStation(String routeId, String stationId, Integer stationOrder) {
        this.routeId = routeId;
        this.stationId = stationId;
        this.stationOrder = stationOrder;
    }

    // Getters
    public String getRouteId() {
        return routeId;
    }

    public String getStationId() {
        return stationId;
    }

    public Integer getStationOrder() {
        return stationOrder;
    }
}