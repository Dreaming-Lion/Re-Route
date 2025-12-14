# Routing A 파트 구현 현황

## 개요
- **담당**: A 파트 (데이터 처리 & 매핑)
- **목표**: B 파트(알고리즘)에 경로 탐색용 데이터 제공
- **최종 수정일**: 2025-12-15
- **상태**: ✅ **Routing 전체 모듈 구현 완료**

---

## 패키지 구조

```
routing/
├── controller/
│   └── RoutingController.java          # 경로 탐색 REST API (A/B 통합)
├── dto/
│   ├── StopCandidate.java              # 후보 정류장 DTO (A)
│   ├── RouteCandidate.java             # 후보 노선 DTO (A)
│   ├── ArrivalInfo.java                # 도착 예정 정보 DTO (A)
│   ├── RoutingRequest.java             # A 파트 경로 요청 DTO
│   ├── RoutingResponse.java            # A 파트 응답 DTO
│   ├── RouteSearchRequest.java         # B 파트 최종 경로 요청 DTO
│   ├── RouteResponse.java              # B 파트 최종 응답 DTO
│   └── StepResponse.java               # 경로 단계(step) DTO (B)
├── entity/
│   ├── Station.java                    # 정류장 엔티티
│   ├── Route.java                      # 노선 엔티티
│   ├── RouteStation.java               # 노선-정류장 관계 엔티티
│   └── RouteStationId.java             # 복합키 클래스
├── repository/
│   ├── StationRepository.java
│   ├── RouteRepository.java
│   └── RouteStationRepository.java
├── service/
│   ├── RoutingStationResolver.java     # 정류장 검색/매핑 (A)
│   ├── RouteFilter.java                # 노선 필터링 (A)
│   ├── ETARawDataProvider.java         # ETA 데이터 제공 (A/B 공통)
│   ├── RoutingService.java             # A 파트 통합 서비스
│   └── RoutingAlgorithm.java           # B 파트 최적 경로 알고리즘
└── util/
    └── DistanceCalculator.java          # 거리/도보 시간 계산 유틸

```

---

## 구현 완료 항목 (✅)

### Phase 1: 기반 구조
- [x] routing 패키지 구조 생성
- [x] Station 엔티티 및 Repository

### Phase 2: 핵심 유틸리티
- [x] DistanceCalculator 구현
  - Haversine 공식으로 두 좌표 간 거리(m) 계산
  - 거리 → 도보 시간(분) 변환 (보행속도 4km/h)

### Phase 3: 정류장 매핑
- [x] RoutingStationResolver 구현
  - placeId → Station 변환
  - 좌표 기반 가까운 정류장 찾기 (반경 검색)
  - 가장 가까운 정류장 1개 찾기

### Phase 4: 노선 필터링
- [x] RouteFilter 구현
  - 출발-도착 정류장을 연결하는 노선 찾기
  - 방향 검증 (출발 순서 < 도착 순서)
  - RouteCandidate 형태로 반환

### Phase 5: ETA 데이터
- [x] ETARawDataProvider 구현
  - 정류장별 버스 도착 예정 정보 조회
  - TAGO 실시간 API 연동 (TagoArrivalClient 활용)
  - 특정 노선 필터링 조회
  - 가장 빨리 도착하는 버스 조회

### Phase 6: DTO 정의
- [x] StopCandidate DTO
- [x] RouteCandidate DTO (arrivals 필드 포함)
- [x] ArrivalInfo DTO
- [x] RoutingRequest DTO
- [x] RoutingResponse DTO

### Phase 7: 통합
- [x] RoutingService (통합 서비스)
- [x] RoutingController (REST API)

---

## API 엔드포인트
| Method | URL                            | 설명                   |
| ------ | ------------------------------ | -------------------- |
| POST   | `/api/routing/route`           | 좌표 기반 경로 후보 탐색    |
| GET    | `/api/routing/route?from=&to=` | 정류장 ID 기반 후보 탐색   |
| GET    | `/api/routing/stations/nearby` | 근처 정류장 조회            |
| POST   | `/api/routing/search`          | **최적 경로 계산 ** |

### 요청/응답 예시
**POST /api/routing/search**
```json
// Request
{
  "originLat": 36.969006,
  "originLng": 127.870014,
  "destLat": 36.9912,
  "destLng": 127.9265
}

// Response (버스 포함)
{
  "totalTime": 75,
  "steps": [
    { "type": "walk", "duration": 2, "from": "출발지", "to": "한국교통대(대학본부건너편)" },
    { "type": "bus", "duration": 34, "from": "한국교통대(대학본부건너편)", "to": "세원아파트(맞은편)", "line": "999", "waitTime": 30 },
    { "type": "walk", "duration": 9, "from": "세원아파트(맞은편)", "to": "목적지" }
  ],
  "eta": "01:19 도착 예정"
}

// Response (후보 없음 -> 도보만)
{
  "totalTime": 20,
  "steps": [
    { "type": "walk", "duration": 20, "from": "출발지", "to": "목적지" }
  ],
  "eta": "00:33 도착 예정"
}

```
**POST /api/routing/route**
```json
// Request
{
  "departureLat": 36.9696,
  "departureLon": 127.8714,
  "arrivalLat": 36.9912,
  "arrivalLon": 127.9265
}

// Response
{
  "departureStop": {
    "stationId": "CHB272000201",
    "stationName": "한국교통대학교",
    "lat": 36.9698,
    "lon": 127.8720,
    "distanceFromOrigin": 65.2,
    "walkTimeFromOrigin": 1
  },
  "arrivalStop": {
    "stationId": "CHB272043072",
    "stationName": "충주역",
    "lat": 36.9910,
    "lon": 127.9260,
    "distanceFromOrigin": 50.1,
    "walkTimeFromOrigin": 1
  },
  "routes": [
    {
      "routeId": "CHB272000140",
      "routeName": "140",
      "departureStationId": "CHB272000201",
      "departureStationName": "한국교통대학교",
      "departureStationOrder": 5,
      "arrivalStationId": "CHB272043072",
      "arrivalStationName": "충주역",
      "arrivalStationOrder": 23,
      "stationCount": 18,
      "arrivals": [
        {
          "routeId": "CHB272000140",
          "routeName": "140",
          "arrivalMinutes": 5,
          "remainingStops": 3
        }
      ]
    }
  ],
  "totalWalkTime": 2,
  "message": "1개의 노선을 이용할 수 있습니다."
}
```

---

## B 파트 연동 인터페이스

### A → B 전달 데이터

**RouteCandidate**
```java
public class RouteCandidate {
    private String routeId;              // 노선 ID
    private String routeName;            // 노선 이름
    private String departureStationId;   // 승차 정류장 ID
    private String departureStationName; // 승차 정류장 이름
    private int departureStationOrder;   // 승차 정류장 순서
    private String arrivalStationId;     // 하차 정류장 ID
    private String arrivalStationName;   // 하차 정류장 이름
    private int arrivalStationOrder;     // 하차 정류장 순서
    private int stationCount;            // 경유 정류장 수
    private List<ArrivalInfo> arrivals;  // 도착 예정 정보
}
```

**StopCandidate**
```java
public class StopCandidate {
    private String stationId;           // 정류장 ID
    private String stationName;         // 정류장 이름
    private double lat;                 // 위도
    private double lon;                 // 경도
    private double distanceFromOrigin;  // 출발지에서의 거리 (m)
    private int walkTimeFromOrigin;     // 출발지에서 도보 시간 (분)
}
```

**ArrivalInfo**
```java
public class ArrivalInfo {
    private String routeId;          // 노선 ID
    private String routeName;        // 노선 이름
    private int arrivalMinutes;      // 도착 예정 시간 (분)
    private int remainingStops;      // 남은 정류장 수
}
```

---

## 핵심 클래스 설명

### DistanceCalculator
- **역할**: 좌표 간 거리 및 도보 시간 계산
- **알고리즘**: Haversine 공식
- **보행 속도**: 4km/h (약 67m/분)

### RoutingStationResolver
- **역할**: 정류장 검색 및 매핑
- **기능**:
  - `resolveStation(placeId)`: ID로 정류장 조회
  - `findNearbyStations(lat, lon, radius)`: 반경 내 정류장 목록
  - `findNearestStation(lat, lon)`: 가장 가까운 정류장

### RouteFilter
- **역할**: 이용 가능한 노선 필터링
- **기능**:
  - `filterRoutes(departureId, arrivalId)`: 두 정류장을 연결하는 노선 찾기
  - `findRoutesAtStation(stationId)`: 정류장 경유 노선 목록

### ETARawDataProvider
- **역할**: 실시간 버스 도착 예정 정보 제공
- **기능**:
  - `getArrivalInfo(stationId)`: 정류장의 모든 도착 예정 정보
  - `getArrivalInfoForRoutes(stationId, routeIds)`: 특정 노선들만 필터링
  - `getArrivalInfoForRoute(stationId, routeId)`: 특정 노선 1개
  - `getNextArrival(stationId)`: 가장 빨리 도착하는 버스
  - `getNextArrivalForRoutes(stationId, routeIds)`: 특정 노선들 중 가장 빠른 버스

### RoutingService
- **역할**: 경로 탐색 통합 서비스
- **흐름**:
  1. 출발지 좌표 → 가까운 출발 정류장 찾기
  2. 도착지 좌표 → 가까운 도착 정류장 찾기
  3. 두 정류장을 연결하는 노선 필터링
  4. RoutingResponse로 조합하여 반환

---

## 데이터베이스 테이블

### station
| 컬럼 | 타입 | 설명 |
|------|------|------|
| station_id | VARCHAR | PK, 정류장 ID |
| station_name | VARCHAR | 정류장 이름 |
| lat | DOUBLE | 위도 |
| lon | DOUBLE | 경도 |

### route
| 컬럼 | 타입 | 설명 |
|------|------|------|
| route_id | VARCHAR | PK, 노선 ID |
| route_name | VARCHAR | 노선 이름 |
| route_type | VARCHAR | 노선 유형 |

### route_station
| 컬럼 | 타입 | 설명 |
|------|------|------|
| route_id | VARCHAR | PK, FK → route |
| station_id | VARCHAR | PK, FK → station |
| station_order | INT | 정류장 순서 |

---

## 진행률

| 항목 | 상태 |
|------|------|
| 전체 완성도 | **100%** |
| 정류장 매핑 | ✅ 완료 |
| 노선 필터링 | ✅ 완료 |
| 거리/시간 계산 | ✅ 완료 |
| ETA 데이터 | ✅ 완료 |
| REST API | ✅ 완료 |


---

[//]: # (## 다음 단계 &#40;B 파트&#41;)

[//]: # ()
[//]: # (1. **B 파트 통합**)

[//]: # (   - A 파트에서 제공하는 데이터를 활용한 최적 경로 계산)

[//]: # (   - 총 소요 시간 기준 경로 정렬)

[//]: # (   - 최종 응답 조립)

[//]: # ()
[//]: # (2. **추가 고려 사항**)

[//]: # (   - 환승 경로 지원 &#40;버스 2대 이상 이용&#41;)

[//]: # (   - 실시간 ETA 반영한 동적 경로 추천)