// src/screens/GuideScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, LayoutAnimation, Platform, UIManager } from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const GRAD = ["#cfefff", "#d7f7e9"]; // 앱 공통 팔레트

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function GuideScreen() {
  const { styles: themeStyles, colors } = useTheme();
  const router = useRouter();

  return (
    <View style={themeStyles.screen}>
      <Header title="사용 가이드" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {/* Hero 카드 */}
        <View style={[s.hero, { borderColor: colors.border }]}>
          <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.heroOverlay} />
          <View style={s.logoCircle}>
            <Ionicons name="bus-outline" size={22} color="#0f172a" />
          </View>
          <Text style={s.heroTitle}>Re:Route <Text style={{ fontWeight: "900" }}>충주</Text></Text>
          <Text style={[s.heroSub, { color: "#3b556d" }]}>충주시 버스 알리미 · 간단 사용 가이드</Text>

          <Pressable style={s.btnGrad} onPress={() => router.push("/search")}>
            <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.btnGradInner}>
              <Ionicons name="search" size={16} color="#0f172a" />
              <Text style={s.btnGradText}>바로 길찾기</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* 섹션: 빠른 시작 */}
        <Text style={[s.sectionTitle, { color: colors.text }]}>빠른 시작</Text>
        <View style={{ gap: 10 }}>
          <StepCard
            icon="location-outline"
            title="1) 출발/도착 입력"
            desc="검색 화면에서 출발지와 목적지를 모두 입력해 주세요."
            cta="검색 화면 열기"
            onPress={() => router.push("/search")}
            colors={colors}
          />
          <StepCard
            icon="bus-outline"
            title="2) 정류장/노선 확인"
            desc="가까운 정류장과 노선의 도착 정보를 확인하세요."
            cta="결과 보기"
            onPress={() => router.push("/route-result")}
            colors={colors}
          />
          <StepCard
            icon="notifications-outline"
            title="3) 알림/즐겨찾기"
            desc="자주 쓰는 장소는 즐겨찾기, 특정 노선은 도착 알림을 설정하세요."
            cta="즐겨찾기 관리"
            onPress={() => router.push("/(tabs)/favorites")}
            colors={colors}
          />
        </View>

        {/* 섹션: 자주 쓰는 기능 */}
        <Text style={[s.sectionTitle, { color: colors.text, marginTop: 16 }]}>자주 쓰는 기능</Text>
        <View style={{ gap: 10 }}>
          <FeatureRow
            colors={colors}
            icon="heart-outline"
            title="즐겨찾기"
            desc="집/회사 같은 장소를 저장하고 빠르게 길찾기 하세요."
            cta="열기"
            onPress={() => router.push("/(tabs)/favorites")}
          />
          <FeatureRow
            colors={colors}
            icon="alert-circle-outline"
            title="정류장 알림"
            desc="도착 3~5분 전에 알림을 받아 놓치지 마세요."
            cta="예시 보기"
            onPress={() => router.push("/route-detail")}
          />
          <FeatureRow
            colors={colors}
            icon="map-outline"
            title="지도에서 선택"
            desc="지도로 위치를 골라 즐겨찾기에 추가할 수 있어요."
            cta="지도로 고르기"
            onPress={() => router.push("/map-pick")}
          />
        </View>

        {/* 섹션: FAQ */}
        <Text style={[s.sectionTitle, { color: colors.text, marginTop: 16 }]}>자주 묻는 질문</Text>
        <FAQItem
          q="로그인 없이도 기능을 쓸 수 있나요?"
          a="검색과 가이드는 로그인 없이 사용 가능해요. 즐겨찾기·알림 같은 개인화 기능은 로그인 후 이용해 주세요."
          colors={colors}
        />
        <FAQItem
          q="도착 정보가 실제와 다를 때는?"
          a="실시간 정보는 운영사·장치 상태에 따라 오차가 발생할 수 있어요. 재시도하거나 해당 노선·정류장의 공지사항을 확인해 주세요."
          colors={colors}
        />
        <FAQItem
          q="즐겨찾기 장소는 어디에서 수정하나요?"
          a="마이페이지 → 즐겨찾기에서 수정·삭제할 수 있어요. 홈에서도 빠르게 접근할 수 있어요."
          colors={colors}
        />

        {/* 바닥 도움말 */}
        <View style={[s.tipCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <View style={s.tipStripe} />
          <View style={{ flex: 1 }}>
            <Text style={s.tipTitle}>Tip</Text>
            <Text style={s.tipDesc}>
              알림은 배터리 최적화의 영향을 받을 수 있어요. 중요한 알림이라면 시스템 설정에서 앱의 배터리 최적화를 해제해 주세요.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ───────────────────────────── components ───────────────────────────── */

function StepCard({
  icon,
  title,
  desc,
  cta,
  onPress,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
  cta: string;
  onPress: () => void;
  colors: any;
}) {
  return (
    <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={s.cardHead}>
        <View style={s.leadingIcon}>
          <Ionicons name={icon} size={18} color="#0ea5e9" />
        </View>
        <Text style={[s.cardTitle, { color: "#0f172a" }]}>{title}</Text>
      </View>
      <Text style={[s.cardDesc, { color: colors.mutedText }]}>{desc}</Text>
      <Pressable onPress={onPress} style={s.btnBlue}>
        <Ionicons name="arrow-forward" size={14} color="#0f172a" />
        <Text style={s.btnBlueText}>{cta}</Text>
      </Pressable>
    </View>
  );
}

function FeatureRow({
  icon,
  title,
  desc,
  cta,
  onPress,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
  cta: string;
  onPress: () => void;
  colors: any;
}) {
  return (
    <View style={[s.rowCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={s.rowLeft}>
        <View style={s.rowIconBg}>
          <Ionicons name={icon} size={18} color="#3B82F6" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.rowTitle}>{title}</Text>
          <Text style={[s.rowDesc, { color: colors.mutedText }]}>{desc}</Text>
        </View>
      </View>
      <Pressable onPress={onPress} style={s.rowBtn}>
        <Text style={s.rowBtnText}>{cta}</Text>
      </Pressable>
    </View>
  );
}

function FAQItem({ q, a, colors }: { q: string; a: string; colors: any }) {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  };
  return (
    <View style={[s.faqItem, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <Pressable onPress={toggle} style={s.faqHead}>
        <Text style={s.faqQ}>{q}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={16} color="#64748B" />
      </Pressable>
      {open && <Text style={[s.faqA, { color: colors.mutedText }]}>{a}</Text>}
    </View>
  );
}

/* ───────────────────────────── styles ───────────────────────────── */

const s = StyleSheet.create({
  // Hero
  hero: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
    backgroundColor: "white",
    overflow: "hidden",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  heroOverlay: { ...StyleSheet.absoluteFillObject, opacity: 0.16 },
  logoCircle: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: "white",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
    marginBottom: 8,
  },
  heroTitle: { fontSize: 20, fontWeight: "900", color: "#0f172a" },
  heroSub: { marginTop: 4, fontSize: 12, fontWeight: "600" },

  // Section
  sectionTitle: { fontSize: 16, fontWeight: "900", marginBottom: 8 },

  // Generic card
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHead: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 },
  leadingIcon: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: "#ECFEFF",
    alignItems: "center", justifyContent: "center",
  },
  cardTitle: { fontSize: 14, fontWeight: "800" },
  cardDesc: { fontSize: 12, fontWeight: "600", marginBottom: 8 },

  // Buttons
    btnGrad: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
    alignSelf: "stretch", 
    },

    btnGradInner: {
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    width: "100%",        
    },
  btnGradText: { fontSize: 14, fontWeight: "900", color: "#0f172a" },

  btnBlue: {
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#cfefff",
    borderWidth: 1,
    borderColor: "#b7e3ff",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
  },
  btnBlueText: { fontSize: 12, fontWeight: "900", color: "#0f172a" },

  // Feature rows
  rowCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  rowIconBg: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: "center", justifyContent: "center", backgroundColor: "#E0F2FE",
  },
  rowTitle: { fontSize: 14, fontWeight: "800", color: "#0f172a" },
  rowDesc: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  rowBtn: {
    height: 36, paddingHorizontal: 12, borderRadius: 10,
    backgroundColor: "#d7f7e9", borderWidth: 1, borderColor: "#cfefff",
    alignItems: "center", justifyContent: "center",
  },
  rowBtnText: { fontSize: 12, fontWeight: "900", color: "#0f172a" },

  // FAQ
  faqItem: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
  },
  faqHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  faqQ: { fontSize: 13, fontWeight: "900", color: "#0f172a" },
  faqA: { marginTop: 6, fontSize: 12, lineHeight: 18 },

  // Tip card with stripe
  tipCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
  },
  tipStripe: {
    width: 4,
    borderRadius: 2,
    backgroundColor: "#cfefff",
  },
  tipTitle: { fontSize: 12, fontWeight: "900", color: "#0f172a" },
  tipDesc: { fontSize: 12, fontWeight: "600", marginTop: 2, color: "#475569" },
});
