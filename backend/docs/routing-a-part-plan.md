# Routing A 파트 개발 계획서

## 담당자 역할
**A 파트: 데이터 처리 & 매핑 담당**
- Routing의 모든 데이터 전처리 (Input 만드는 역할)
- B 파트(알고리즘/최종 경로 계산)에 데이터 제공

---

## 목표 API
```
POST /api/routes/search
```
- WALK + BUS + WALK 조합 경로 탐색
- ETA 계산, 정류장 매핑 등

---

## 생성할 파일 구조

```
src/main/java/run_lion/reroute/routing/
├── dto/
│   ├── RouteCandidate.java        # 후보 경로 데이터
│   └── StopCandidate.java         # 후보 정류장 데이터
├── util/
│   ├── DistanceCalculator.java    # Haversine 거리/시간 계산
│   └── RoutingStationResolver.java # placeId → Station 매핑
├── service/
│   ├── RouteFilter.java           # 가능한 노선 필터링
│   └── ETARawDataProvider.java    # ETA 데이터 조회
└── entity/ (필요시)
    └── Station, Route, RouteStation
```

---

## 개발 작업 목록

### Phase 1: 기반 구조
| # | 작업 | 상태 | 산출물 |
|---|------|------|--------|
| 1 | routing 패키지 구조 생성 | [ ] | 패키지 디렉토리 |
| 2 | Station 엔티티 및 Repository 확인/생성 | [ ] | Station.java, StationRepository.java |

### Phase 2: 핵심 유틸리티
| # | 작업 | 상태 | 산출물 |
|---|------|------|--------|
| 3 | DistanceCalculator 구현 | [ ] | DistanceCalculator.java |
|   | - Haversine 공식으로 두 좌표 간 거리(m) 계산 | | |
|   | - 거리 → 도보 시간(분) 변환 (평균 보행속도 4km/h 기준) | | |

### Phase 3: 정류장 매핑
| # | 작업 | 상태 | 산출물 |
|---|------|------|--------|
| 4 | RoutingStationResolver 구현 | [ ] | RoutingStationResolver.java |
|   | - placeId → stationId 변환 | | |
|   | - 사용자 좌표 기반 가까운 정류장 찾기 | | |
|   | - 출발지/도착지 정류장 매핑 | | |

### Phase 4: 노선 필터링
| # | 작업 | 상태 | 산출물 |
|---|------|------|--------|
| 5 | RouteFilter 구현 | [ ] | RouteFilter.java |
|   | - 출발 정류장에서 탈 수 있는 버스 목록 추출 | | |
|   | - 도착지까지 도달 가능한 버스만 필터링 | | |
|   | - RouteCandidate 형태로 반환 | | |

### Phase 5: ETA 데이터
| # | 작업 | 상태 | 산출물 |
|---|------|------|--------|
| 6 | ETARawDataProvider 구현 | [ ] | ETARawDataProvider.java |
|   | - 정류장별 시간표 조회 | | |
|   | - 도착 예정 시간 필터링 | | |
|   | - TAGO 실시간 데이터 연동 구조 준비 | | |

### Phase 6: DTO 정의
| # | 작업 | 상태 | 산출물 |
|---|------|------|--------|
| 7 | RouteCandidate DTO | [ ] | RouteCandidate.java |
| 7 | StopCandidate DTO | [ ] | StopCandidate.java |

### Phase 7: 통합
| # | 작업 | 상태 | 산출물 |
|---|------|------|--------|
| 8 | B 파트와 통합 테스트 | [ ] | 테스트 코드 |

---

## 세부 구현 명세

### 1. DistanceCalculator
```java
public class DistanceCalculator {
    // 두 좌표 간 거리 계산 (미터)
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2);

    // 거리 → 도보 시간 변환 (분)
    public static int calculateWalkTime(double distanceInMeters);
}
```
- Haversine 공식 사용
- 보행 속도: 4km/h (약 67m/분)

### 2. RoutingStationResolver
```java
public class RoutingStationResolver {
    // placeId → Station 변환
    public Station resolveStation(String placeId);

    // 좌표 기반 가까운 정류장 목록 (반경 내)
    public List<StopCandidate> findNearbyStations(double lat, double lon, int radiusMeters);
}
```

### 3. RouteFilter
```java
public class RouteFilter {
    // 출발-도착 정류장 기준 가능한 노선 필터링
    public List<RouteCandidate> filterRoutes(Station departure, Station arrival);
}
```

### 4. ETARawDataProvider
```java
public class ETARawDataProvider {
    // 정류장의 버스 도착 예정 정보 조회
    public List<ArrivalInfo> getArrivalInfo(String stationId);
}
```

---

## B 파트에 전달할 데이터 구조

### RouteCandidate
```java
public class RouteCandidate {
    private String routeId;           // 노선 ID
    private String routeName;         // 노선 이름 (예: "140")
    private Station departureStation; // 승차 정류장
    private Station arrivalStation;   // 하차 정류장
    private int stationCount;         // 경유 정류장 수
    private List<ArrivalInfo> arrivals; // 도착 예정 정보
}
```

### StopCandidate
```java
public class StopCandidate {
    private String stationId;      // 정류장 ID
    private String stationName;    // 정류장 이름
    private double lat;            // 위도
    private double lon;            // 경도
    private int walkTimeFromOrigin; // 출발지에서 도보 시간
    private int walkTimeToDestination; // 도착지까지 도보 시간
}
```

---

## 진행 상황 체크리스트

- [ ] placeId → stationId 변환 함수
- [ ] 가까운 정류장 찾기 함수
- [ ] 가능 노선 후보 리스트 생성
- [ ] RouteStation 기반 경로 전처리
- [ ] WALK 거리 계산 기능
- [ ] ETA 기본 데이터(시간표 or 실시간) 조회 기능
- [ ] 최종 Candidate 데이터 구조 정의

---

## 참고사항

### 기존 코드 활용
- `realtimebus/constant/StationIds.java` - 정류장 ID 상수
- `realtimebus/util/PathStationMapper.java` - 기존 매핑 로직 참고
- `realtimebus/client/TagoArrivalClient.java` - TAGO API 연동

### B 파트 연동 포인트
- A가 `RouteCandidate`, `StopCandidate` 제공
- B가 이를 받아서 최적 경로 계산 및 Response 조립

---

## 일정 (예상)

| 단계 | 작업 |
|------|------|
| Day 1 | Phase 1-2 (기반 구조, 엔티티) |
| Day 2 | Phase 3-4 (매핑, 필터링) |
| Day 3 | Phase 5-6 (ETA, DTO) |
| Day 4 | Phase 7 (통합 테스트) |

---

*마지막 업데이트: 2025-12-06*