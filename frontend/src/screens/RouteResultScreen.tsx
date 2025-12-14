import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { fetchRouteCandidates, type RouteCandidate } from "../api/routing";
import { fetchLocalArrivals, type LocalArrival } from "../api/localArrival";

const GRAD = ["#cfefff", "#d7f7e9"];

type RowVM = {
  routeId: string;
  routeNo: string;
  isLive: boolean;
  etaMinText: string;
  prevStopsText: string; // LIVE일 때만
};

export default function RouteResultScreen() {
  const { styles: themeStyles, colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    originId?: string;
    originName?: string;
    destinationId?: string;
    destinationName?: string;
  }>();

  const originId = params.originId ?? "";
  const destinationId = params.destinationId ?? "";
  const originName = params.originName ?? "출발지";
  const destinationName = params.destinationName ?? "도착지";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<RowVM[]>([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const empty = useMemo(() => !loading && rows.length === 0, [loading, rows.length]);

  const localByRouteNo = (locals: LocalArrival[]) => {
    // route_no별 가장 빠른 1개만 남김
    const m = new Map<string, LocalArrival>();
    for (const it of locals) {
      const key = String(it.route_no ?? "").trim();
      if (!key) continue;
      const prev = m.get(key);
      if (!prev || it.arr_time < prev.arr_time) m.set(key, it);
    }
    return m;
  };

  async function load() {
    try {
      setError(null);
      if (!originId || !destinationId) {
        setRows([]);
        return;
      }

      const [candidates, locals] = await Promise.all([
        fetchRouteCandidates(originId, destinationId),
        fetchLocalArrivals(originId, 80),
      ]);

      const localMap = localByRouteNo(locals);

      // ✅ 후보 노선 기반으로만 리스트 구성:
      // - arrivals 있으면 LIVE
      // - 없으면 시간표(local)로 fallback
      const vms: RowVM[] = (candidates ?? [])
        .map((c: RouteCandidate) => {
          const routeNo = String(c.routeName ?? "").trim();
          if (!routeNo) return null;

          const live = c.arrivals?.[0]; // fastest 1개만 쓰는 정책
          if (live) {
            return {
              routeId: c.routeId,
              routeNo,
              isLive: true,
              etaMinText: live.arrivalMinutes <= 0 ? "곧 도착" : `${live.arrivalMinutes}분`,
              prevStopsText: `${live.remainingStops}정류장 전`,
            };
          }

          const schedule = localMap.get(routeNo);
          if (schedule) {
            const min = Math.max(0, Math.ceil(schedule.arr_time / 60));
            return {
              routeId: c.routeId,
              routeNo,
              isLive: false,
              etaMinText: min <= 0 ? "곧 도착(시간표)" : `${min}분(시간표)`,
              prevStopsText: "",
            };
          }

          return {
            routeId: c.routeId,
            routeNo,
            isLive: false,
            etaMinText: "정보 없음",
            prevStopsText: "",
          };

        })
        .filter(Boolean) as RowVM[];

      // ✅ 정렬: LIVE 우선, 그 다음 ETA 빠른 순
      vms.sort((a, b) => {
        if (a.isLive !== b.isLive) return a.isLive ? -1 : 1;
        const an = parseInt(a.etaMinText, 10);
        const bn = parseInt(b.etaMinText, 10);
        if (Number.isNaN(an) && Number.isNaN(bn)) return 0;
        if (Number.isNaN(an)) return 1;
        if (Number.isNaN(bn)) return -1;
        return an - bn;
      });

      setRows(vms);
      setLastUpdatedAt(new Date());
    } catch (e: any) {
      setError(e?.message ?? "경로를 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originId, destinationId]);

  return (
    <View style={themeStyles.screen}>
      <Header title="경로 결과" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.gradWrap}>
          <View style={[s.summaryCard, { backgroundColor: "white" }]}>
            <View style={{ flex: 1 }}>
              <Text style={s.summaryLabel}>출발</Text>
              <Text style={s.summaryValue}>{originName}</Text>
              <Text style={s.summaryId}>{originId}</Text>
            </View>

            <Ionicons name="arrow-forward" size={18} color="#0f172a" />

            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={s.summaryLabel}>도착</Text>
              <Text style={s.summaryValue}>{destinationName}</Text>
              <Text style={s.summaryId}>{destinationId}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
          <Text style={[s.sectionTitle, { color: colors.text }]}>추천 노선</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {loading ? <ActivityIndicator /> : null}
            <Text style={{ color: colors.mutedText, fontWeight: "700", fontSize: 12 }}>
              {lastUpdatedAt ? `업데이트: ${lastUpdatedAt.toLocaleTimeString()}` : ""}
            </Text>
            <Pressable onPress={load} hitSlop={10}>
              <Ionicons name="refresh" size={16} color={colors.mutedText} />
            </Pressable>
          </View>
        </View>

        {!!error && <Text style={{ color: "#DC2626", fontWeight: "800", marginTop: 10 }}>{error}</Text>}

        {empty ? (
          <Text style={{ color: colors.mutedText, fontWeight: "700", marginTop: 12, textAlign: "center" }}>
            이용 가능한 노선이 없어요.
          </Text>
        ) : null}

        <View style={{ gap: 10, marginTop: 12 }}>
          {rows.map((it, idx) => (
            <Pressable
              key={`${it.routeId}-${idx}`}
              onPress={() =>
                router.push({
                  pathname: "/route-detail",
                  params: {
                    stationId: originId,
                    stationName: originName,
                    routeId: it.routeId, // ✅ /api/realtime/gps?routeId=&stationId= 유지 OK
                    routeNo: it.routeNo,
                  },
                })
              }
              style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={s.left}>
                <View style={s.busIconBg}>
                  <Ionicons name="bus" size={16} color="#3B82F6" />
                </View>
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={[s.busNo, { color: colors.text }]}>{it.routeNo}번</Text>

                    {it.isLive ? (
                      <View style={s.livePill}><Text style={s.livePillText}>LIVE</Text></View>
                    ) : (
                      <View style={s.schedulePill}><Text style={s.schedulePillText}>시간표</Text></View>
                    )}
                  </View>

                  {!!it.prevStopsText && (
                    <Text style={[s.sub, { color: colors.mutedText }]}>{it.prevStopsText}</Text>
                  )}
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={s.eta}>{it.etaMinText}</Text>
                <Text style={[s.sub, { color: colors.mutedText }]}>탭하면 GPS 보기</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  gradWrap: { borderRadius: 14, padding: 2, marginBottom: 12 },
  summaryCard: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  summaryLabel: { fontSize: 11, fontWeight: "800", color: "#64748B" },
  summaryValue: { fontSize: 14, fontWeight: "900", color: "#0f172a", marginTop: 2 },
  summaryId: { fontSize: 10, fontWeight: "700", color: "#94a3b8", marginTop: 2 },

  sectionTitle: { fontSize: 16, fontWeight: "900" },

  card: { borderWidth: 1, borderRadius: 14, padding: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  left: { flexDirection: "row", alignItems: "center", gap: 10 },
  busIconBg: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#E0F2FE" },
  busNo: { fontSize: 14, fontWeight: "900" },
  eta: { fontSize: 18, fontWeight: "900", color: "#2563EB" },
  sub: { fontSize: 11, fontWeight: "700" },

  livePill: { height: 18, paddingHorizontal: 8, borderRadius: 999, backgroundColor: "rgba(37,99,235,0.12)", alignItems: "center", justifyContent: "center" },
  livePillText: { fontSize: 11, fontWeight: "900", color: "#2563EB" },

  schedulePill: { height: 18, paddingHorizontal: 8, borderRadius: 999, backgroundColor: "rgba(100,116,139,0.12)", alignItems: "center", justifyContent: "center" },
  schedulePillText: { fontSize: 11, fontWeight: "900", color: "#64748B" },
});
