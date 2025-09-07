// src/screens/SearchScreen.tsx
import React, { useState } from "react";
import {
  View, Text, TextInput, Pressable, StyleSheet, Alert,
  ScrollView, KeyboardAvoidingView, Platform
} from "react-native"; // ← ScrollView, KeyboardAvoidingView 추가
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { Icon } from "../components/common/Icon";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const recommended = [
  { name: "충주역", desc: "충주시 연수동 1135-1", icon: "train-outline" },
  { name: "충주시청", desc: "충주시 금릉동 14-2", icon: "business-outline" },
  { name: "건국대학교", desc: "충주시 단월동 322", icon: "school-outline" },
];

const GRAD = ["#cfefff", "#d7f7e9"];

export default function SearchScreen() {
  const { styles, colors, radii } = useTheme();
  const router = useRouter();

  const [recent, setRecent] = useState(["건국대학교 충주캠퍼스", "충주시청", "중앙탑공원"]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const goRouteDetail = () => {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert("입력 필요", "출발지와 목적지를 모두 입력해 주세요.");
      return;
    }
    router.push({ pathname: "/route-result", params: { origin, destination } });
  };

  const swap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  return (
    <View style={styles.screen}>
      <Header title="목적지 검색" />

      {/* ✅ 스크롤 가능 + 키보드 회피 */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* 상단 검색 카드 */}
          <View
            style={[
              s.searchCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {/* 출발지 */}
            <View style={[s.inputRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Icon name="navigate-outline" />
              <TextInput
                value={origin}
                onChangeText={setOrigin}
                placeholder="출발지 입력"
                placeholderTextColor={colors.mutedForeground}
                style={s.input}
                returnKeyType="next"
              />
            </View>

            {/* 스왑 버튼 */}
            <Pressable onPress={swap} style={s.swapBtn}>
              <Icon name="swap-vertical" />
            </Pressable>

            {/* 목적지 */}
            <View style={[s.inputRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Icon name="location-outline" />
              <TextInput
                value={destination}
                onChangeText={setDestination}
                placeholder="목적지 입력"
                placeholderTextColor={colors.mutedForeground}
                style={s.input}
                returnKeyType="search"
                onSubmitEditing={goRouteDetail}
              />
            </View>

            {/* 검색 버튼 */}
            <Pressable onPress={goRouteDetail} style={s.searchBtnShadow}>
              <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.searchBtn}>
                <Icon name="search" />
                <View style={{ width: 6 }} />
                <View><Text style={s.searchBtnText}>경로 검색</Text></View>
              </LinearGradient>
            </Pressable>
          </View>

          {/* 최근 목적지 */}
          {recent.length > 0 && (
            <>
              <Text style={[styles.text, { fontSize: 16, fontWeight: "600", marginTop: 16, marginBottom: 8 }]}>
                최근 목적지
              </Text>
              {recent.map((item, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.card,
                    {
                      paddingVertical: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    },
                  ]}
                >
                  <Pressable
                    onPress={() => setDestination(item)}
                    style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                  >
                    <Icon name="time-outline" />
                    <Text style={styles.text}>{item}</Text>
                  </Pressable>
                  <Pressable onPress={() => setRecent(recent.filter((_, i) => i !== idx))}>
                    <Icon name="close" />
                  </Pressable>
                </View>
              ))}
            </>
          )}

          {/* 추천 검색지 */}
          <Text style={[styles.text, { fontSize: 16, fontWeight: "600", marginTop: 12, marginBottom: 8 }]}>
            추천 검색지
          </Text>
          {recommended.map((p, i) => (
            <Pressable
              key={i}
              onPress={() => setDestination(p.name)}
              style={[styles.card, { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 }]}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radii.lg,
                  backgroundColor: "#E8F7F4",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name={p.icon} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.text, { fontWeight: "600" }]}>{p.name}</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{p.desc}</Text>
              </View>
              <Icon name="location-outline" />
            </Pressable>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  searchCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
  },
  swapBtn: {
    alignSelf: "center",
    marginBottom: 10,
    borderRadius: 999,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },
  searchBtnShadow: { borderRadius: 12, overflow: "hidden" },
  searchBtn: {
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  searchBtnText: { fontSize: 15, fontWeight: "800", color: "#0f172a" },
});
