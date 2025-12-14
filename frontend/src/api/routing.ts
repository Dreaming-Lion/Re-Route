export type ArrivalInfo = {
  routeId: string;
  routeName: string;
  arrivalMinutes: number;
  remainingStops: number; // = prev_station_count 같은 의미로 쓰는 값
};

export type RouteCandidate = {
  routeId: string;
  routeName: string; // routeNo로 씀
  arrivals?: ArrivalInfo[];
};

const BASE = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function fetchRouteCandidates(from: string, to: string): Promise<RouteCandidate[]> {
  const url = `${BASE}/api/routing/route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`routing candidates fail: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
