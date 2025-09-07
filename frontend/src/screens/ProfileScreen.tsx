// src/screens/ProfileScreen.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";

type Fav = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconTint: string;
  title: string;
  desc: string;
};

const GRAD = ["#cfefff", "#d7f7e9"]; // 팔레트 유지

export default function MyPageScreen() {
  const { styles: themeStyles, colors } = useTheme();
  const router = useRouter();

  const favorites: Fav[] = [
    { id: "home", icon: "home-outline",     iconTint: "#10B981", title: "집",   desc: "서울역 2번 출구" },
    { id: "work", icon: "business-outline", iconTint: "#60A5FA", title: "회사", desc: "강남역 3번 출구" },
    { id: "gym",  icon: "barbell-outline",  iconTint: "#F59E0B", title: "헬스장", desc: "봉천역구청 8번 출구" },
    { id: "hos",  icon: "medkit-outline",   iconTint: "#F87171", title: "병원", desc: "신촌역 4번 출구" },
  ];

  return (
    <View style={themeStyles.screen}>
      <Header title="마이페이지" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {/* 프로필 카드: 화이트 베이스 + 아주 연한 그라데이션 오버레이 */}
        <View style={[s.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.cardOverlay} />

          {/* 아바타 (그라데이션 링) */}
          <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.avatarRing}>
            <View style={s.avatarInner}>
              <Ionicons name="person-outline" size={28} color="#0f172a" />
            </View>
          </LinearGradient>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.name}>충주시민</Text>
            <Text style={s.caption}>선량한 시민</Text>
          </View>

          {/* ✅ 개인정보 수정 버튼: 그라데이션 → 솔리드 */}
          <Pressable
            onPress={() => router.push("/edit-profile")}
            style={({ pressed }) => [
              s.editBtnSolid,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Ionicons name="create-outline" size={16} color="#0f172a" />
            <Text style={s.editBtnText}>개인정보 수정</Text>
          </Pressable>
        </View>

        {/* 즐겨찾는 장소 */}
        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: colors.text }]}>즐겨찾는 장소</Text>
          <Pressable onPress={() => { /* 추가 액션 연결 */ }}>
            <Text style={[s.addLink, { color: "#3B82F6" }]}>+ 추가</Text>
          </Pressable>
        </View>

        <View style={{ gap: 10 }}>
          {favorites.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => {}}
              style={({ pressed }) => [
                s.favItem,
                { backgroundColor: colors.card, borderColor: colors.border },
                pressed && { opacity: 0.96 },
              ]}
            >
              <View style={[s.favIconBg, { backgroundColor: "#ECFEFF" }]}>
                <Ionicons name={f.icon} size={20} color={f.iconTint} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[s.favTitle, { color: colors.text }]}>{f.title}</Text>
                <Text style={[s.favDesc, { color: colors.mutedText }]}>{f.desc}</Text>
              </View>

              <View style={s.chevBtn}>
                <Ionicons name="chevron-forward" size={16} color="#60A5FA" />
              </View>
            </Pressable>
          ))}
        </View>

        {/* 하단 로그아웃 버튼 */}
        <Pressable
          onPress={() => router.push("/home")} // TODO: 실제 signOut 로직 연결
          style={({ pressed }) => [
            s.logoutBtn,
            { opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Ionicons name="log-out-outline" size={18} color="white" />
          <Text style={s.logoutText}>로그아웃</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  profileCard: {
    borderRadius: 16,
    padding: 14,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
  },
  avatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  avatarInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 18, fontWeight: "800", color: "#0f172a" },
  caption: { marginTop: 2, fontSize: 12, color: "#475569" },

  // ✅ 솔리드 버튼 (그라데이션 없음)
  editBtnSolid: {
    height: 36,
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#d7f7e9",      // 팔레트 유지: 민트 톤
    borderWidth: 1,
    borderColor: "#cfefff",          // 팔레트의 다른 끝으로 보더
  },
  editBtnText: { fontSize: 13, fontWeight: "800", color: "#0f172a" },

  sectionHeader: {
    marginTop: 6,
    marginBottom: 8,
    paddingHorizontal: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 15, fontWeight: "800" },
  addLink: { fontSize: 12, fontWeight: "700" },

  favItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  favIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
  },
  favTitle: { fontSize: 14, fontWeight: "700" },
  favDesc: { fontSize: 12, fontWeight: "500" },
  chevBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  // 하단 로그아웃
  logoutBtn: {
    marginTop: 18,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#EF4444",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  logoutText: { color: "white", fontSize: 15, fontWeight: "800" },
});
