export type LocalArrival = {
  route_id: string | null;
  route_no: string;
  arr_time: number; // seconds
  prev_station_count: number; // -1
};

const BASE = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function fetchLocalArrivals(stationId: string, limit = 50): Promise<LocalArrival[]> {
  const url = `${BASE}/api/local/arrival/${encodeURIComponent(stationId)}?limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`local arrivals fail: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
