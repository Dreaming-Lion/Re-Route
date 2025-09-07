// src/screens/RouteResultScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const GRAD = ["#cfefff", "#d7f7e9"];

type Stop = {
  id: string;
  name: string;
  walk: string;
  lines: string[];
  more?: string;   // "+3개 노선" 같은 표시용
};

const STOPS: Stop[] = [
  { id: "s1", name: "대학로",          walk: "도보 2분 (150m)",  lines: ["146", "472", "N16"], more: "+3개 노선" },
  { id: "s2", name: "정문",            walk: "도보 5분 (380m)",  lines: ["360", "740", "N37"], more: "+7개 노선" },
  { id: "s3", name: "서문",            walk: "도보 7분 (520m)",  lines: ["143", "401", "N15"], more: "+5개 노선" },
  { id: "s4", name: "논현역 2번 출구", walk: "도보 8분 (650m)",  lines: ["421", "463"],        more: "+2개 노선" },
  { id: "s5", name: "신논현역 1번 출구", walk: "도보 10분 (780m)", lines: ["333", "350", "542"], more: "+4개 노선" },
];

export default function RouteResultScreen() {
  const { styles: themeStyles, colors, radii } = useTheme();
  const router = useRouter();
  const [liked, setLiked] = useState<Record<string, boolean>>({ s2: true });

  const toggleLike = (id: string) => setLiked(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <View style={themeStyles.screen}>
      <Header title="정류장 결과" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {/* 현재 위치 / 검색 카드 */}
        <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.gradWrap}>
          <Pressable
            onPress={() => router.push("/search")}
            style={[s.searchCard, { backgroundColor: "white" }]}
          >
            <View style={s.leftPin}>
              <Ionicons name="location-sharp" size={16} color="white" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.searchLabel}>현재 위치</Text>
              <Text style={s.searchValue}>한국교통대학교</Text>
            </View>
            <Ionicons name="search" size={18} color="#0f172a" />
          </Pressable>
        </LinearGradient>

        {/* 섹션 타이틀 */}
        <Text style={[s.sectionTitle, { color: colors.text }]}>가까운 정류장</Text>
        <Text style={[s.sectionSub, { color: colors.mutedText }]}>
          현재 위치에서 가까운 순으로 정렬
        </Text>

        {/* 정류장 카드 리스트 */}
        <View style={{ gap: 10, marginTop: 10 }}>
          {STOPS.map((stop, i) => (
            <Pressable
              key={stop.id}
              onPress={() => router.push("/route-detail")}
              style={[
                s.stopCard,
                { backgroundColor: colors.card, borderColor: colors.border },
                i === 1 && { borderColor: "#cfefff" }, // 살짝 강조
              ]}
            >
              {/* 왼쪽 아이콘 */}
              <View style={s.leading}>
                <View style={s.busIconBg}>
                  <Ionicons name="bus" size={16} color="#3B82F6" />
                </View>
              </View>

              {/* 본문 */}
              <View style={{ flex: 1 }}>
                <Text style={[s.stopName, { color: colors.text }]}>{stop.name}</Text>
                <Text style={[s.stopWalk, { color: colors.mutedText }]}>{stop.walk}</Text>

                {/* 노선 배지 */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {stop.lines.map((ln) => (
                    <View key={ln} style={s.badge}>
                      <Text style={s.badgeText}>{ln}</Text>
                    </View>
                  ))}
                  {!!stop.more && (
                    <Text style={s.moreText}>{stop.more}</Text>
                  )}
                </View>
              </View>

              {/* 우측 하트 */}
              <Pressable onPress={() => toggleLike(stop.id)} hitSlop={10} style={s.heartBtn}>
                <Ionicons
                  name={liked[stop.id] ? "heart" : "heart-outline"}
                  size={18}
                  color={liked[stop.id] ? "#EF4444" : colors.mutedText}
                />
              </Pressable>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  // 상단 검색 카드(그라데이션 테두리 느낌)
  gradWrap: {
    borderRadius: 14,
    padding: 2,
    marginBottom: 12,
  },
  searchCard: {
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
  leftPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
  },
  searchLabel: { fontSize: 11, fontWeight: "700", color: "#64748B" },
  searchValue: { fontSize: 14, fontWeight: "800", color: "#0f172a" },

  sectionTitle: { fontSize: 16, fontWeight: "800", marginTop: 6 },
  sectionSub: { fontSize: 12, fontWeight: "600", marginTop: 2 },

  // 정류장 카드
  stopCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  leading: { width: 40, alignItems: "center" },
  busIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0F2FE",
  },
  stopName: { fontSize: 14, fontWeight: "800" },
  stopWalk: { fontSize: 11, fontWeight: "600", marginTop: 2 },

  badge: {
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 11,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "white", fontSize: 12, fontWeight: "800" },
  moreText: { fontSize: 11, fontWeight: "700", color: "#64748B", alignSelf: "center" },

  heartBtn: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
});
