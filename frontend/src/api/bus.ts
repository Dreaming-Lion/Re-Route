import { api } from "./client";

/** Path API 응답 (백엔드 PathResult) */
export type PathResult = {
  busId: string;            // routeId
  busNo: string;            // 노선 번호
  arrTimeMin: number;       // 분
  prevStationCount: number; // 몇 정류장 전
};

export type Arrival = {
  route_id?: string;
  route_no: string;
  arr_time: number;           // 초
  prev_station_count: number; // 정류장 수
  source: "TAGO" | "CITY";
};

export type BusGps = {
  routeNm: string;
  gpsLati: number;
  gpsLong: number;
  nodeNm: string;
  routeTp: string;
};

// ✅ (1) 실시간 경로: /api/bus/realtime/path?from=...&to=...
export async function fetchRealtimePath(from: string, to: string): Promise<PathResult[]> {
  const { data } = await api.get(`/api/bus/realtime/path`, { params: { from, to } });
  return (data ?? []).map((x: any) => ({
    busId: String(x.busId ?? x.bus_id ?? x.route_id ?? ""),
    busNo: String(x.busNo ?? x.bus_no ?? x.route_no ?? ""),
    arrTimeMin: Number(x.arrTimeMin ?? x.arr_time_min ?? 0),
    prevStationCount: Number(x.prevStationCount ?? x.prev_station_count ?? 0),
  }));
}

// ✅ (2) TAGO 실시간 도착: /api/realtime/arrival/{stationId}
export async function fetchArrivalsTAGO(stationId: string): Promise<Arrival[]> {
  const { data } = await api.get(`/api/realtime/arrival/${stationId}`);
  return (data ?? []).map((x: any) => ({
    route_id: x.route_id ? String(x.route_id) : undefined,
    route_no: String(x.route_no ?? ""),
    arr_time: Number(x.arr_time ?? 0),
    prev_station_count: Number(x.prev_station_count ?? 0),
    source: "TAGO" as const,
  }));
}

/**
 * ✅ (옵션) 충주시청 저장 데이터 도착정보
 * 너 백엔드가 실제로 제공하는 URL로 바꿔줘.
 * 없으면 404 → 빈 배열 처리로 TAGO만으로 동작함.
 */
const CITY_ARRIVAL_URL = "/api/local/arrival"; // <- 필요시 변경
export async function fetchArrivalsCITY(stationId: string): Promise<Arrival[]> {
  try {
    const { data } = await api.get(`${CITY_ARRIVAL_URL}/${stationId}`);
    return (data ?? []).map((x: any) => ({
      route_id: x.route_id ? String(x.route_id) : undefined,
      route_no: String(x.route_no ?? ""),
      arr_time: Number(x.arr_time ?? 0),
      prev_station_count: Number(x.prev_station_count ?? 0),
      source: "CITY" as const,
    }));
  } catch {
    return [];
  }
}

/** ✅ 중복 규칙: 같은 노선(route_no)면 TAGO만 남김 */
export function mergeArrivalsPreferTAGO(tago: Arrival[], city: Arrival[]) {
  const map = new Map<string, Arrival>();
  for (const a of city) if (a.route_no) map.set(a.route_no, a);
  for (const a of tago) if (a.route_no) map.set(a.route_no, a); // TAGO로 덮기
  return [...map.values()].sort((a, b) => (a.arr_time ?? 0) - (b.arr_time ?? 0));
}

export async function fetchMergedArrivals(stationId: string) {
  const [tago, city] = await Promise.all([
    fetchArrivalsTAGO(stationId),
    fetchArrivalsCITY(stationId),
  ]);
  return mergeArrivalsPreferTAGO(tago, city);
}

// ✅ (3) GPS: /api/realtime/gps?routeId=...&stationId=...
export async function fetchBusGps(routeId: string, stationId: string): Promise<BusGps[]> {
  const { data } = await api.get(`/api/realtime/gps`, { params: { routeId, stationId } });
  return (data ?? []).map((x: any) => ({
    routeNm: String(x.routeNm ?? x.routenm ?? ""),
    gpsLati: Number(x.gpsLati ?? x.gpslati ?? 0),
    gpsLong: Number(x.gpsLong ?? x.gpslong ?? 0),
    nodeNm: String(x.nodeNm ?? x.nodenm ?? ""),
    routeTp: String(x.routeTp ?? x.routetp ?? ""),
  }));
}
