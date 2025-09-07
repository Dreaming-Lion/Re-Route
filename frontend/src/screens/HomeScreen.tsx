// src/screens/HomeScreen.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";

type BusItem = {
  id: string;
  badgeBg: string;
  number: string;
  title: string;
  route: string;
  eta: string;
  etaColor: string;
  sub: string;
};

export default function HomeScreen() {
  const { styles: themeStyles, colors } = useTheme();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);

  const handleAuthGate = (onAuthed: () => void) => {
    if (isLoggedIn) onAuthed();
    else setAuthVisible(true);
  };

  const busData: BusItem[] = useMemo(
    () => [
      {
        id: "472",
        badgeBg: "#3B82F6",
        number: "472",
        title: "472번",
        route: "충주역 → 건국대",
        eta: "2분",
        etaColor: "#2563EB",
        sub: "3정거장 전",
      },
      {
        id: "146",
        badgeBg: "#22C55E",
        number: "146",
        title: "146번",
        route: "충주역 → 세명대",
        eta: "5분",
        etaColor: "#16A34A",
        sub: "7정거장 전",
      },
      {
        id: "246",
        badgeBg: "#EF4444",
        number: "246",
        title: "246번",
        route: "충주역 → 중앙탑",
        eta: "12분",
        etaColor: "#DC2626",
        sub: "운행중",
      },
    ],
    []
  );

  return (
    <View style={themeStyles.screen}>
      <Header title="홈" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* 검색 바 (로그인 필요) */}
        <Pressable
          onPress={() => handleAuthGate(() => router.push("/search"))}
          style={({ pressed }) => [
            s.searchBar,
            { borderColor: colors.border, backgroundColor: colors.card },
            pressed && s.pressed,
          ]}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.mutedText}
            style={{ marginRight: 8 }}
          />
          <Text style={[s.searchPlaceholder, { color: colors.mutedText }]}>
            목적지를 검색하세요
          </Text>
        </Pressable>

        {/* 액션 카드 */}
        <View style={s.actionsRow}>
          <ActionCard
            label="길찾기"
            icon="navigate-outline"
            onPress={() => handleAuthGate(() => router.push("/search"))}
            colors={colors}
          />
          <ActionCard
            label="즐겨찾기"
            icon="heart-outline"
            onPress={() => handleAuthGate(() => router.push("/favorites"))}
            colors={colors}
          />
          <ActionCard
            label="사용 가이드"
            icon="flash-outline"
            onPress={() => router.push("/guide")}
            colors={colors}
          />
        </View>

        {/* 실시간 버스 정보 */}
        <Text
          style={[
            s.sectionTitle,
            { color: colors.text, marginTop: 16, marginBottom: 8 },
          ]}
        >
          실시간 버스 정보
        </Text>

        {busData.map((b) => (
          <Pressable
            key={b.id}
            onPress={() => handleAuthGate(() => router.push(`/bus/${b.id}`))}
            style={({ pressed }) => [
              s.busCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
              pressed && s.pressed,
            ]}
          >
            <View style={s.busLeft}>
              <View style={[s.busBadge, { backgroundColor: b.badgeBg }]}>
                <Text style={s.busBadgeText}>{b.number}</Text>
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={[s.busTitle, { color: colors.text }]}>{b.title}</Text>
                <Text style={[s.busRoute, { color: colors.mutedText }]}>{b.route}</Text>
              </View>
            </View>

            <View style={s.busRight}>
              <Text style={[s.busEta, { color: b.etaColor }]}>{b.eta}</Text>
              <Text style={[s.busSub, { color: colors.mutedText }]}>{b.sub}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* 인증 모달 */}
      <Modal
        visible={authVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAuthVisible(false)}
      >
        <Pressable style={s.backdrop} onPress={() => setAuthVisible(false)} />
        <View style={[s.authCard, { backgroundColor: colors.card }]}>
          <Text style={[s.authTitle, { color: colors.text }]}>로그인 필요</Text>
          <Text style={[s.authDesc, { color: colors.mutedText }]}>
            이 기능을 사용하려면 로그인이 필요해요.
          </Text>

          {/* 로그인: /login 이동 (그라데이션 유지) */}
          <Pressable
            onPress={() => {
              setAuthVisible(false);
              router.push("/login");
            }}
            style={({ pressed }) => [s.authBtnShadow, pressed && s.pressed, { width: "100%" }]}
          >
            <LinearGradient
              colors={["#cfefff", "#d7f7e9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.authLoginBtn}
            >
              <Ionicons name="log-in-outline" size={18} color="#0f172a" />
              <Text style={s.authLoginText}>로그인</Text>
            </LinearGradient>
          </Pressable>

          {/* ✅ 닫기 버튼: 로그인 버튼과 동일 폭 */}
          <Pressable
            onPress={() => setAuthVisible(false)}
            style={({ pressed }) => [s.authClose, pressed && { opacity: 0.9 }]}
            hitSlop={8}
          >
            <Text style={s.authCloseText}>닫기</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

function ActionCard({
  label,
  icon,
  onPress,
  colors,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  colors: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.actionCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        pressed && s.pressed,
      ]}
    >
      <View style={s.actionIconWrap}>
        <Ionicons name={icon} size={22} color="#0ea5e9" />
      </View>
      <Text style={[s.actionLabel, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  pressed: {
    opacity: 0.85,
    transform: [{ scale: Platform.OS === "ios" ? 0.98 : 1 }],
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  searchPlaceholder: { fontSize: 16 },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
    marginBottom: 4,
  },
  actionCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECFEFF",
    marginBottom: 8,
  },
  actionLabel: { fontSize: 13, fontWeight: "600" },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  busCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  busLeft: { flexDirection: "row", alignItems: "center" },
  busBadge: {
    width: 46,
    height: 46,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  busBadgeText: { color: "white", fontWeight: "800", fontSize: 14 },
  busTitle: { fontSize: 16, fontWeight: "700", marginBottom: 2 },
  busRoute: { fontSize: 12, fontWeight: "500" },
  busRight: { alignItems: "flex-end" },
  busEta: { fontSize: 22, fontWeight: "900", lineHeight: 26 },
  busSub: { marginTop: 2, fontSize: 12, fontWeight: "600" },

  // 인증 모달
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  authCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  authTitle: { fontSize: 16, fontWeight: "800", marginBottom: 4 },
  authDesc: { fontSize: 13, marginBottom: 14 },
  authBtnShadow: { borderRadius: 12, overflow: "hidden" },
  authLoginBtn: {
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  authLoginText: { fontSize: 15, fontWeight: "800", color: "#0f172a" },

  // 닫기 버튼: 로그인 버튼과 동일한 높이/폭
  authClose: {
    width: "100%",
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cfefff",     // 연파랑 테두리
    backgroundColor: "#F6FAFF", // 아주 옅은 블루 배경
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  authCloseText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0f172a",
  },
});
