package run_lion.reroute.routing.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * 정류장 엔티티 - DB의 station 테이블과 매핑
 */
@Entity
@Table(name = "station")
public class Station {

    @Id
    @Column(name = "station_id")
    private String stationId;  // 정류장 고유 ID (예: "CHB272043072")

    @Column(name = "station_name")
    private String stationName;  // 정류장 이름 (예: "한국교통대학교")

    @Column(name = "lat")
    private Double lat;  // 위도

    @Column(name = "lon")
    private Double lon;  // 경도

    // 기본 생성자 - JPA가 객체를 생성할 때 필요
    protected Station() {
    }

    // 모든 필드를 받는 생성자
    public Station(String stationId, String stationName, Double lat, Double lon) {
        this.stationId = stationId;
        this.stationName = stationName;
        this.lat = lat;
        this.lon = lon;
    }

    // Getter 메서드들 - 값을 읽을 때 사용
    public String getStationId() {
        return stationId;
    }

    public String getStationName() {
        return stationName;
    }

    public Double getLat() {
        return lat;
    }

    public Double getLon() {
        return lon;
    }
}