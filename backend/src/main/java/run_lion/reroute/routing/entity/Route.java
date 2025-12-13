package run_lion.reroute.routing.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * 버스 노선 엔티티
 *
 * 예시: 140번 버스, 400번 버스 등
 */
@Entity
@Table(name = "route")
public class Route {

    @Id
    @Column(name = "route_id")
    private String routeId;  // 노선 고유 ID

    @Column(name = "route_name")
    private String routeName;  // 노선 이름 (예: "140", "400")

    @Column(name = "route_type")
    private String routeType;  // 노선 유형 (일반, 급행 등)

    // 기본 생성자
    protected Route() {
    }

    public Route(String routeId, String routeName, String routeType) {
        this.routeId = routeId;
        this.routeName = routeName;
        this.routeType = routeType;
    }

    // Getters
    public String getRouteId() {
        return routeId;
    }

    public String getRouteName() {
        return routeName;
    }

    public String getRouteType() {
        return routeType;
    }
}