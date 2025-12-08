package run_lion.reroute.routing.util;

/**
 * 거리 및 도보 시간 계산 유틸리티

 * 이 클래스는 순수 Java 유틸리티입니다. (스프링 의존 X)
 * 모든 메서드가 static이므로 객체 생성 없이 바로 사용 가능합니다.

 * 사용 예시:
 *   double distance = DistanceCalculator.calculateDistance(lat1, lon1, lat2, lon2);
 *   int walkTime = DistanceCalculator.calculateWalkTime(distance);
 */
public class DistanceCalculator {

    // 지구 반지름 (km)
    private static final double EARTH_RADIUS_KM = 6371.0;

    // 평균 도보 속도 (km/h) - 일반적인 성인 보행 속도
    private static final double WALK_SPEED_KMH = 4.0;

    // 생성자를 private으로 막아서 객체 생성 방지 (유틸리티 클래스 패턴)
    private DistanceCalculator() {
    }

    /**
     * 두 좌표 간 거리 계산 (Haversine 공식)

     * Haversine 공식이란?
     * - 지구가 구(sphere)라고 가정하고, 두 위경도 좌표 사이의 최단 거리를 계산
     * - GPS 좌표 기반 거리 계산에 널리 사용됨
     *
     * @param lat1 출발지 위도
     * @param lon1 출발지 경도
     * @param lat2 도착지 위도
     * @param lon2 도착지 경도
     * @return 거리 (미터)
     */
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // 1. 위도/경도를 라디안으로 변환 (삼각함수는 라디안을 사용)
        double lat1Rad = Math.toRadians(lat1);
        double lat2Rad = Math.toRadians(lat2);
        double deltaLat = Math.toRadians(lat2 - lat1);
        double deltaLon = Math.toRadians(lon2 - lon1);

        // 2. Haversine 공식 적용
        //    a = sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)
        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
                + Math.cos(lat1Rad) * Math.cos(lat2Rad)
                * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        //    c = 2 * atan2(√a, √(1−a))
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // 3. 거리 = 지구반지름 * c (km -> m 변환)
        double distanceKm = EARTH_RADIUS_KM * c;
        return distanceKm * 1000; // 미터로 반환
    }

    /**
     * 거리를 도보 시간으로 변환

     * 계산 방식:
     *   시간(분) = 거리(m) / 속도(m/분)
     *   속도 4km/h = 4000m / 60분 = 약 66.67m/분
     *
     * @param distanceInMeters 거리 (미터)
     * @return 도보 시간 (분, 올림 처리)
     */
    public static int calculateWalkTime(double distanceInMeters) {
        // m/분 단위 속도 계산
        double walkSpeedMeterPerMin = (WALK_SPEED_KMH * 1000) / 60;

        // 시간 계산 후 올림 (1.1분 → 2분)
        double timeInMinutes = distanceInMeters / walkSpeedMeterPerMin;
        return (int) Math.ceil(timeInMinutes);
    }

    /**
     * 두 좌표 간 도보 시간을 한번에 계산
     *
     * @param lat1 출발지 위도
     * @param lon1 출발지 경도
     * @param lat2 도착지 위도
     * @param lon2 도착지 경도
     * @return 도보 시간 (분)
     */
    public static int calculateWalkTimeBetween(double lat1, double lon1, double lat2, double lon2) {
        double distance = calculateDistance(lat1, lon1, lat2, lon2);
        return calculateWalkTime(distance);
    }
}