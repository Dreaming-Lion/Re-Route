// backend/src/main/java/run_lion/reroute/realtimebus/service/LocalBusArrivalService.java
package run_lion.reroute.realtimebus.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import run_lion.reroute.realtimebus.constant.StationIds;
import run_lion.reroute.realtimebus.dto.LocalArrivalDto;

import java.io.InputStream;
import java.time.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LocalBusArrivalService {

    // stationId -> (routeNo -> times)
    private final Map<String, Map<String, List<LocalTime>>> timetable = new ConcurrentHashMap<>();

    private static final Pattern ROUTE_NO_PATTERN = Pattern.compile("\\d{2,4}(-\\d)?"); // 112-1 같은거

    @PostConstruct
    public void load() {
        // resources 경로
        // backend/src/main/resources/data/chungju_bus_timetable.xlsx
        String path = "data/chungju_bus_timetable.xlsx";
        timetable.clear();

        try (InputStream is = new ClassPathResource(path).getInputStream();
             Workbook wb = WorkbookFactory.create(is)) {

            Sheet sh = wb.getSheetAt(0);
            FormulaEvaluator eval = wb.getCreationHelper().createFormulaEvaluator();

            Integer routeNoCol = null;                 // 0-based
            Map<Integer, String> colToStationId = new HashMap<>(); // 0-based col -> stationId
            String currentRouteNo = null;

            for (int r = 0; r <= sh.getLastRowNum(); r++) {
                Row row = sh.getRow(r);
                if (row == null) continue;

                List<String> rowTexts = readRowAsStrings(row, eval);

                if (isHeaderRow(rowTexts, r)) {
                    // 헤더 갱신
                    routeNoCol = findColIndexContains(rowTexts, "노선번호");
                    colToStationId = buildStationColumnMap(rowTexts);

                    // 999 블록(맨 위)은 "노선번호"라는 글자가 없어서 예외 처리: A열이 노선번호
                    if (r == 0 && routeNoCol == null) routeNoCol = 0;

                    currentRouteNo = null;
                    continue;
                }

                if (colToStationId.isEmpty()) continue;

                // routeNo 갱신 (섹션마다 노선번호 컬럼이 다름)
                if (routeNoCol != null) {
                    String routeCell = safeGet(rowTexts, routeNoCol);
                    String parsed = parseRouteNo(routeCell);
                    if (parsed != null) currentRouteNo = parsed;
                }

                if (currentRouteNo == null) continue;

                // 타겟 정류장 컬럼(터미널/충주역/교통대)만 파싱
                for (Map.Entry<Integer, String> e : colToStationId.entrySet()) {
                    int c = e.getKey();
                    String stationId = e.getValue();

                    Cell cell = row.getCell(c);
                    Optional<LocalTime> t = parseTimeCell(cell, eval);
                    if (t.isEmpty()) continue;

                    timetable
                        .computeIfAbsent(stationId, k -> new ConcurrentHashMap<>())
                        .computeIfAbsent(currentRouteNo, k -> Collections.synchronizedList(new ArrayList<>()))
                        .add(t.get());
                }
            }

            // 정렬 + 중복 제거
            for (Map<String, List<LocalTime>> byRoute : timetable.values()) {
                for (Map.Entry<String, List<LocalTime>> e : byRoute.entrySet()) {
                    List<LocalTime> sorted = e.getValue().stream()
                        .distinct()
                        .sorted()
                        .collect(Collectors.toList());
                    e.setValue(Collections.synchronizedList(sorted));
                }
            }

            log.info("[LocalBusArrivalService] loaded timetable stations={}, file={}",
                timetable.keySet(), path);

        } catch (Exception ex) {
            log.error("[LocalBusArrivalService] failed to load excel: {}", ex.getMessage(), ex);
            timetable.clear();
        }
    }

    /**
     * 시간표 기반 도착예정(초 단위) 반환
     * - 오늘 시간이 지나있으면 "내일"로 롤오버
     * - prev_station_count는 -1 (시간표는 몇 정류장 전 정보 없음)
     */
    public List<LocalArrivalDto> getArrivals(String stationId, int limit) {
        Map<String, List<LocalTime>> byRoute = timetable.getOrDefault(stationId, Map.of());
        if (byRoute.isEmpty()) return List.of();

        LocalDateTime now = LocalDateTime.now();
        List<LocalArrivalDto> out = new ArrayList<>();

        for (Map.Entry<String, List<LocalTime>> entry : byRoute.entrySet()) {
            String routeNo = entry.getKey();
            List<LocalTime> times = entry.getValue();

            List<LocalDateTime> nextTimes = times.stream()
                .map(t -> LocalDateTime.of(now.toLocalDate(), t))
                .map(dt -> dt.isBefore(now) ? dt.plusDays(1) : dt)
                .sorted()
                .limit(limit)
                .toList();

            for (LocalDateTime dt : nextTimes) {
                long sec = Duration.between(now, dt).getSeconds();
                if (sec < 0) continue;

                out.add(new LocalArrivalDto(
                    null,
                    routeNo,
                    (int) sec,
                    -1
                ));
            }
        }

        return out.stream()
            .sorted(Comparator.comparingInt(LocalArrivalDto::getArr_time))
            .limit(limit)
            .collect(Collectors.toList());
    }

    // ---------------- helpers ----------------

    private boolean isHeaderRow(List<String> rowTexts, int rowIndex) {
        // 일반 섹션 헤더: "노선번호" 포함
        boolean hasRouteNoHeader = rowTexts.stream().anyMatch(s -> s.contains("노선번호"));

        // 999 섹션 헤더(맨 첫 줄): 터미널/교통대 키워드가 있음
        boolean looks999Header = rowIndex == 0 &&
            rowTexts.stream().anyMatch(s -> s.contains("터미널")) &&
            rowTexts.stream().anyMatch(s -> s.contains("교통대"));

        // 교통대 셔틀 같은 섹션도 헤더 감지 (노선번호 없을 수 있음)
        boolean looksShuttleHeader =
            rowTexts.stream().anyMatch(s -> s.contains("교통대")) &&
            rowTexts.stream().anyMatch(s -> s.contains("터미널")) &&
            rowTexts.stream().filter(s -> !s.isBlank()).count() >= 3;

        return hasRouteNoHeader || looks999Header || looksShuttleHeader;
    }

    private Map<Integer, String> buildStationColumnMap(List<String> header) {
        Map<Integer, String> map = new HashMap<>();

        int chungjuSeen = 0;
        for (int c = 0; c < header.size(); c++) {
            String h = header.get(c);
            if (h == null) continue;

            // 터미널
            if (h.contains("터미널")) {
                map.put(c, StationIds.TERMINAL);
                continue;
            }

            // 충주역(방향 2개일 수 있음)
            if (h.contains("충주역")) {
                chungjuSeen++;
                if (chungjuSeen == 1) map.put(c, StationIds.STATION_TO_KNUT);
                else map.put(c, StationIds.STATION_TO_TERMINAL);
                continue;
            }

            // 교통대(도착/출발 포함)
            if (h.contains("교통대")) {
                map.put(c, StationIds.KNUT);
            }
        }

        return map;
    }

    private Integer findColIndexContains(List<String> rowTexts, String token) {
        for (int i = 0; i < rowTexts.size(); i++) {
            if (rowTexts.get(i).contains(token)) return i;
        }
        return null;
    }

    private List<String> readRowAsStrings(Row row, FormulaEvaluator eval) {
        int last = Math.max(row.getLastCellNum(), 0);
        List<String> out = new ArrayList<>(last);
        for (int c = 0; c < last; c++) {
            out.add(getCellString(row.getCell(c), eval));
        }
        return out;
    }

    private String getCellString(Cell cell, FormulaEvaluator eval) {
        if (cell == null) return "";

        CellType type = cell.getCellType();
        if (type == CellType.FORMULA) type = eval.evaluateFormulaCell(cell);

        return switch (type) {
            case STRING -> safe(cell.getStringCellValue());
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getLocalDateTimeCellValue().toLocalTime().toString();
                }
                double v = cell.getNumericCellValue();
                // 노선번호 같은 정수
                if (Math.floor(v) == v) yield String.valueOf((int) v);
                yield String.valueOf(v);
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }

    private Optional<LocalTime> parseTimeCell(Cell cell, FormulaEvaluator eval) {
        if (cell == null) return Optional.empty();

        CellType type = cell.getCellType();
        if (type == CellType.FORMULA) type = eval.evaluateFormulaCell(cell);

        try {
            if (type == CellType.NUMERIC) {
                if (DateUtil.isCellDateFormatted(cell)) {
                    return Optional.of(cell.getLocalDateTimeCellValue().toLocalTime().withSecond(0));
                }
                // 엑셀 시간이 숫자(분수)로 들어온 경우도 방어
                double v = cell.getNumericCellValue();
                if (v > 0 && v < 1) {
                    Date d = DateUtil.getJavaDate(v);
                    Instant ins = d.toInstant();
                    return Optional.of(ins.atZone(ZoneId.systemDefault()).toLocalTime().withSecond(0));
                }
                return Optional.empty();
            }

            if (type == CellType.STRING) {
                String raw = safe(cell.getStringCellValue());
                if (raw.isBlank()) return Optional.empty();
                if (raw.contains("직행")) return Optional.empty();

                // "8:10/8:15" → "8:10"
                if (raw.contains("/")) raw = raw.split("/")[0].trim();

                // "08:17:00" or "8:10"
                if (raw.matches("\\d{1,2}:\\d{2}:\\d{2}")) return Optional.of(LocalTime.parse(raw).withSecond(0));
                if (raw.matches("\\d{1,2}:\\d{2}")) return Optional.of(LocalTime.parse(raw + ":00").withSecond(0));

                return Optional.empty();
            }
        } catch (Exception ignored) {
            return Optional.empty();
        }

        return Optional.empty();
    }

    private String parseRouteNo(String s) {
        if (s == null) return null;
        String t = s.trim();
        if (t.isBlank()) return null;
        if (ROUTE_NO_PATTERN.matcher(t).matches()) return t;
        return null;
    }

    private String safe(String s) {
        return s == null ? "" : s.trim();
    }

    private String safeGet(List<String> list, int idx) {
        if (idx < 0 || idx >= list.size()) return "";
        return list.get(idx);
    }
}
