package run_lion.reroute.routing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import run_lion.reroute.routing.entity.RouteStation;
import run_lion.reroute.routing.entity.RouteStationId;

import java.util.List;

/**
 * 노선-정류장 관계 Repository
 */
public interface RouteStationRepository extends JpaRepository<RouteStation, RouteStationId> {

    /**
     * 특정 정류장을 경유하는 모든 노선 조회
     * → SELECT * FROM route_station WHERE station_id = ?
     */
    List<RouteStation> findByStationId(String stationId);

    /**
     * 특정 노선의 모든 정류장 조회 (순서대로)
     * → SELECT * FROM route_station WHERE route_id = ? ORDER BY station_order
     */
    List<RouteStation> findByRouteIdOrderByStationOrderAsc(String routeId);

    /**
     * 출발 정류장과 도착 정류장을 모두 경유하는 노선 찾기
     *
     * 조건:
     * 1. 두 정류장을 모두 지나는 노선
     * 2. 출발 정류장이 도착 정류장보다 먼저 (순서가 작음)
     */
    @Query("""
        SELECT rs1.routeId FROM RouteStation rs1, RouteStation rs2
        WHERE rs1.routeId = rs2.routeId
          AND rs1.stationId = :departureStationId
          AND rs2.stationId = :arrivalStationId
          AND rs1.stationOrder < rs2.stationOrder
        """)
    List<String> findRoutesConnecting(
            @Param("departureStationId") String departureStationId,
            @Param("arrivalStationId") String arrivalStationId
    );
}