package run_lion.reroute.routing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import run_lion.reroute.routing.entity.Station;

import java.util.List;

/**
 * 정류장 데이터 접근을 위한 Repository
 *
 * JpaRepository를 상속하면 기본적인 CRUD 메서드가 자동으로 생성됩니다:
 * - findById(id): ID로 조회
 * - findAll(): 전체 조회
 * - save(entity): 저장/수정
 * - delete(entity): 삭제
 */
public interface StationRepository extends JpaRepository<Station, String> {

    /**
     * 정류장 이름으로 검색
     * 메서드 이름만으로 쿼리가 자동 생성됩니다!
     * → SELECT * FROM station WHERE station_name = ?
     */
    List<Station> findByStationName(String stationName);

    /**
     * 정류장 이름에 특정 키워드가 포함된 정류장 검색
     * → SELECT * FROM station WHERE station_name LIKE '%keyword%'
     */
    List<Station> findByStationNameContaining(String keyword);

    /**
     * 특정 좌표 반경 내의 정류장 조회 (커스텀 쿼리)
     * Haversine 공식을 사용하여 거리 계산
     *
     * @param lat 중심 위도
     * @param lon 중심 경도
     * @param radiusKm 반경 (km)
     * @return 반경 내 정류장 목록
     */
    @Query(value = """
        SELECT * FROM station s
        WHERE (
            6371 * acos(
                cos(radians(:lat)) * cos(radians(s.lat)) *
                cos(radians(s.lon) - radians(:lon)) +
                sin(radians(:lat)) * sin(radians(s.lat))
            )
        ) <= :radiusKm
        ORDER BY (
            6371 * acos(
                cos(radians(:lat)) * cos(radians(s.lat)) *
                cos(radians(s.lon) - radians(:lon)) +
                sin(radians(:lat)) * sin(radians(s.lat))
            )
        ) ASC
        """, nativeQuery = true)
    List<Station> findStationsWithinRadius(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radiusKm") double radiusKm
    );
}