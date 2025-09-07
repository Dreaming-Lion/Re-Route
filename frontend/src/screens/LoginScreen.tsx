// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const GRAD = ["#cfefff", "#d7f7e9"]; // 앱에서 쓰던 하늘→민트

export default function LoginScreen() {
  const { styles: themeStyles, colors } = useTheme();
  const router = useRouter();

  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [stay, setStay] = useState(false);

  const onLogin = () => {
    // TODO: 실제 로그인 API 연동
    router.replace("/"); // 로그인 후 홈으로
  };

  return (
    <View style={themeStyles.screen}>
      <Header title="로그인" onBack={() => router.back()} />

      <View style={{ padding: 16 }}>
        {/* 브랜드 / 서브타이틀 */}
        <View style={s.hero}>
          <View style={s.logoCircle}>
            <Ionicons name="bus-outline" size={22} color="#0f172a" />
          </View>
          <Text style={s.brand}>
            Re:Route <Text style={{ color: "#0f172a", fontWeight: "900" }}>충주</Text>
          </Text>
          <Text style={s.subtitle}>충주시 버스 알리미</Text>
        </View>

        {/* 입력 카드 */}
        <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* 아이디 */}
          <Text style={[s.label, { color: colors.text }]}>아이디</Text>
          <TextInput
            value={username}
            onChangeText={setU}
            placeholder="아이디를 입력하세요"
            placeholderTextColor={colors.mutedText}
            autoCapitalize="none"
            style={s.input}
            returnKeyType="next"
          />

          {/* 비밀번호 */}
          <Text style={[s.label, { marginTop: 12, color: colors.text }]}>비밀번호</Text>
          <TextInput
            value={password}
            onChangeText={setP}
            placeholder="비밀번호를 입력하세요"
            placeholderTextColor={colors.mutedText}
            secureTextEntry
            style={s.input}
            returnKeyType="done"
            onSubmitEditing={onLogin}
          />

          {/* 상태 유지 / 비번 찾기 */}
          <View style={s.rowBetween}>
            <Pressable style={s.keepRow} onPress={() => setStay((v) => !v)}>
              <View
                style={[
                  s.checkbox,
                  { borderColor: colors.border, backgroundColor: stay ? "#d7f7e9" : "white" },
                ]}
              >
                {stay && <Ionicons name="checkmark" size={14} color="#0f172a" />}
              </View>
              <Text style={[s.keepText, { color: colors.mutedText }]}>로그인 상태 유지</Text>
            </Pressable>
          </View>

          {/* 로그인 버튼 (그라데이션) */}
          <Pressable style={s.btnShadow} onPress={onLogin}>
            <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.primaryBtn}>
              <Text style={s.primaryBtnText}>로그인</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* 구분선 */}
        <View style={s.dividerWrap}>
          <View style={[s.hr, { backgroundColor: colors.border }]} />
          <Text style={[s.hrText, { color: colors.mutedText }]}>또는</Text>
          <View style={[s.hr, { backgroundColor: colors.border }]} />
        </View>

        <View style={s.signupRow}>
          <Text style={{ color: colors.mutedText }}>아직 계정이 없으신가요?</Text>
          <Pressable onPress={() => router.push("/signup")}>
            <Text style={[s.link, { color: "#3B82F6" }]}> 회원가입</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: "center", marginTop: 8, marginBottom: 14 },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    marginBottom: 8,
  },
  brand: { fontSize: 22, fontWeight: "900", color: "#0f172a" },
  subtitle: { marginTop: 2, fontSize: 12, color: "#64748B" },

  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  label: { fontSize: 12, fontWeight: "800" },
  input: {
    marginTop: 6,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#0f172a",
  },

  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  keepRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  keepText: { fontSize: 12, fontWeight: "700" },

  btnShadow: { marginTop: 12, borderRadius: 12, overflow: "hidden" },
  primaryBtn: {
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { fontSize: 15, fontWeight: "900", color: "#0f172a" },

  dividerWrap: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16, paddingHorizontal: 6 },
  hr: { height: 1, flex: 1, opacity: 0.6 },
  hrText: { fontSize: 12, fontWeight: "700" },

  signupRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 12 },
  link: { fontWeight: "900" },
});
