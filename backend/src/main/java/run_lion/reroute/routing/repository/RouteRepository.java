package run_lion.reroute.routing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import run_lion.reroute.routing.entity.Route;

import java.util.List;

/**
 * 노선 Repository
 */
public interface RouteRepository extends JpaRepository<Route, String> {

    /**
     * 노선 이름으로 검색
     */
    List<Route> findByRouteName(String routeName);

    /**
     * 여러 노선 ID로 한번에 조회
     * → SELECT * FROM route WHERE route_id IN (?, ?, ?)
     */
    List<Route> findByRouteIdIn(List<String> routeIds);
}