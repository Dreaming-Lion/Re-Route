// src/screens/RouteDetailScreen.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const GRAD = ["#cfefff", "#d7f7e9"];

const items = [
  { bus: "370번", time: "3분", note: "2정거장 전", tint: "#2563EB" }, // 파랑
  { bus: "470번", time: "7분", note: "5정거장 전", tint: "#16A34A" }, // 초록
  { bus: "143번", time: "12분", note: "8정거장 전", tint: "#DC2626" }, // 빨강
];

export default function RouteDetailScreen() {
  const { styles: themeStyles, colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[themeStyles.screen, { paddingBottom: 0 }]}>
      <Header title="버스 위치" onBack={() => router.back()} />

      {/* 맵 영역(프로토타입: 흰색 카드 플레이스홀더) */}
      <View style={s.mapWrap}>
        <View style={s.placeholderWrap}>
          <View style={[s.placeholderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="map-outline" size={22} color="#94a3b8" />
            <Text style={s.placeholderTitle}>지도 영역 (프로토타입)</Text>
            <Text style={s.placeholderSub}>여기에 지도/경로가 표시됩니다</Text>
          </View>
        </View>

        {/* 상단 위치 카드 */}
        <View style={[s.topInfo, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[s.topTitle, { color: colors.text }]}>강남역 3번 출구</Text>
            <Text style={[s.topSub, { color: colors.mutedText }]}>142번 정류장</Text>
          </View>
          <Text style={[s.topEta, { color: "#2563EB" }]}>3분</Text>
          <Pressable style={s.iconBtn}>
            <Ionicons name="ellipsis-vertical" size={16} color={colors.mutedText} />
          </Pressable>
        </View>

        {/* 플로팅 컨트롤 */}
        <View style={s.fabsCol}>
          <Pressable style={[s.fab, s.shadowLg]}>
            <Ionicons name="locate-outline" size={18} color="#0f172a" />
          </Pressable>

          <Pressable style={[s.pinFab, s.shadowLg]}>
            <Ionicons name="pin" size={18} color="white" />
          </Pressable>

          <Pressable style={[s.fab, s.shadowLg]}>
            <Ionicons name="add" size={18} color="#0f172a" />
          </Pressable>
          <Pressable style={[s.fab, s.shadowLg]}>
            <Ionicons name="remove" size={18} color="#0f172a" />
          </Pressable>
        </View>

        {/* 바텀시트 */}
        <View style={[s.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[s.sheetTitle, { color: colors.text }]}>실시간 버스 정보</Text>

          {items.map((b, i) => (
            <Pressable
              key={i}
              style={[
                s.row,
                i === 0 && { backgroundColor: "rgba(207,239,255,0.35)" }, // 첫 행 하이라이트
                { borderColor: colors.border },
              ]}
            >
              <View style={s.rowLeft}>
                <View style={s.rowIconBg}>
                  <Ionicons name="bus" size={16} color="#3B82F6" />
                </View>
                <View>
                  <Text style={[s.busName, { color: colors.text }]}>{b.bus}</Text>
                  <Text style={[s.busNote, { color: colors.mutedText }]}>일반</Text>
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={[s.busEta, { color: b.tint }]}>{b.time}</Text>
                <Text style={[s.busSub, { color: colors.mutedText }]}>{b.note}</Text>
              </View>
            </Pressable>
          ))}

          {/* 알림 설정 버튼 */}
          <Pressable style={s.btnShadow} onPress={() => router.push("/(tabs)/favorites")}>
            <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.primaryBtn}>
              <Text style={s.primaryBtnText}>알림 설정</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  mapWrap: { flex: 1 },

  // ───────── Placeholder (Map 자리)
  placeholderWrap: {
    ...StyleSheet.absoluteFillObject,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderCard: {
    width: "100%",
    height: "85%",
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  placeholderTitle: { marginTop: 6, fontSize: 14, fontWeight: "800", color: "#0f172a" },
  placeholderSub: { marginTop: 2, fontSize: 12, color: "#64748B" },

  // ───────── 상단 정보 카드
  topInfo: {
    position: "absolute",
    top: 10,
    left: 12,
    right: 12,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  topTitle: { fontSize: 14, fontWeight: "800" },
  topSub: { fontSize: 12, fontWeight: "600" },
  topEta: { fontSize: 16, fontWeight: "900" },
  iconBtn: { width: 28, height: 28, alignItems: "center", justifyContent: "center", borderRadius: 14 },

  // ───────── 플로팅 버튼
  fabsCol: { position: "absolute", right: 12, top: 110, alignItems: "center", gap: 10 },
  fab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  pinFab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  shadowLg: {
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  // ───────── 바텀시트
  sheet: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  sheetTitle: { fontSize: 16, fontWeight: "800", marginBottom: 8 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0F2FE",
  },
  busName: { fontSize: 14, fontWeight: "800" },
  busNote: { fontSize: 12, fontWeight: "600" },
  busEta: { fontSize: 18, fontWeight: "900", lineHeight: 22 },
  busSub: { fontSize: 11, fontWeight: "600", marginTop: 2 },

  // ───────── 버튼
  btnShadow: { borderRadius: 12, overflow: "hidden", marginTop: 6 },
  primaryBtn: {
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { fontSize: 15, fontWeight: "800", color: "#0f172a" },
});
