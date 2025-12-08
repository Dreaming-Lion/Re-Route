package run_lion.reroute.routing.service;

import org.springframework.stereotype.Service;
import run_lion.reroute.routing.dto.StopCandidate;
import run_lion.reroute.routing.entity.Station;
import run_lion.reroute.routing.repository.StationRepository;
import run_lion.reroute.routing.util.DistanceCalculator;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

/**
 * 정류장 매핑 및 검색 서비스
 *
 * @Service란?
 * - 이 클래스가 "비즈니스 로직을 담당하는 서비스"임을 스프링에게 알림
 * - 스프링이 자동으로 객체를 생성하고 관리함 (싱글톤)
 * - 다른 클래스에서 @Autowired나 생성자 주입으로 사용 가능
 *
 * 주요 기능:
 * 1. placeId → Station 변환
 * 2. 좌표 기반 가까운 정류장 찾기
 */
@Service
public class RoutingStationResolver {

    // Repository 의존성 - DB 접근을 위해 필요
    private final StationRepository stationRepository;

    // 기본 검색 반경 (미터)
    private static final int DEFAULT_RADIUS_METERS = 500;

    /**
     * 생성자 주입 (Constructor Injection)
     *
     * 왜 이렇게 하나요?
     * - 스프링이 RoutingStationResolver 객체를 만들 때
     * - StationRepository 객체를 자동으로 찾아서 넣어줌 (의존성 주입)
     * - final로 선언해서 변경 불가능하게 만듦 (안전성)
     *
     * @param stationRepository 스프링이 자동으로 주입해주는 Repository
     */
    public RoutingStationResolver(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    /**
     * placeId로 정류장 조회
     *
     * @param placeId 정류장 ID (예: "CHB272043072")
     * @return 정류장 정보 (없으면 빈 Optional)
     */
    public Optional<Station> resolveStation(String placeId) {
        return stationRepository.findById(placeId);
    }

    /**
     * 좌표 기반 가까운 정류장 목록 조회 (기본 반경 500m)
     *
     * @param lat 사용자 위도
     * @param lon 사용자 경도
     * @return 가까운 정류장 목록 (거리순 정렬)
     */
    public List<StopCandidate> findNearbyStations(double lat, double lon) {
        return findNearbyStations(lat, lon, DEFAULT_RADIUS_METERS);
    }

    /**
     * 좌표 기반 가까운 정류장 목록 조회 (반경 지정)
     *
     * @param lat 사용자 위도
     * @param lon 사용자 경도
     * @param radiusMeters 검색 반경 (미터)
     * @return 가까운 정류장 목록 (거리순 정렬)
     */
    public List<StopCandidate> findNearbyStations(double lat, double lon, int radiusMeters) {
        // 1. DB에서 반경 내 정류장 조회 (km 단위로 변환)
        double radiusKm = radiusMeters / 1000.0;
        List<Station> stations = stationRepository.findStationsWithinRadius(lat, lon, radiusKm);

        // 2. Station → StopCandidate로 변환 (도보 시간 계산 포함)
        List<StopCandidate> candidates = new ArrayList<>();

        for (Station station : stations) {
            // 거리 계산
            double distance = DistanceCalculator.calculateDistance(
                    lat, lon,
                    station.getLat(), station.getLon()
            );

            // 도보 시간 계산
            int walkTime = DistanceCalculator.calculateWalkTime(distance);

            // StopCandidate 생성
            StopCandidate candidate = new StopCandidate(
                    station.getStationId(),
                    station.getStationName(),
                    station.getLat(),
                    station.getLon(),
                    distance,
                    walkTime
            );

            candidates.add(candidate);
        }

        // 3. 거리순 정렬 (가까운 순)
        candidates.sort(Comparator.comparingDouble(StopCandidate::getDistanceFromOrigin));

        return candidates;
    }

    /**
     * 가장 가까운 정류장 1개 조회
     *
     * @param lat 사용자 위도
     * @param lon 사용자 경도
     * @return 가장 가까운 정류장 (없으면 빈 Optional)
     */
    public Optional<StopCandidate> findNearestStation(double lat, double lon) {
        List<StopCandidate> nearby = findNearbyStations(lat, lon, 1000); // 1km 반경

        if (nearby.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(nearby.get(0)); // 가장 가까운 것
    }
}