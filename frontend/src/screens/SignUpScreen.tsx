// src/screens/SignupScreen.tsx
import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const GRAD = ["#cfefff", "#d7f7e9"]; // 하늘→민트

export default function SignupScreen() {
  const { styles: themeStyles, colors } = useTheme();
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const errors = {
    nickname: nickname.trim().length < 2 ? "닉네임은 2자 이상이어야 합니다." : "",
    username: username.trim().length < 4 ? "아이디는 4자 이상, 영문자 및 숫자로만 구성되어야 합니다." : "",
    pw: pw.length < 6 ? "비밀번호는 6자 이상, 반드시 영문자와 숫자, 특수문자로 구성해야 합니다." : "",
    pw2: pw2 !== pw ? "비밀번호가 일치하지 않습니다" : "",
  };

  const isValid = useMemo(
    () => !errors.nickname && !errors.username && !errors.pw && !errors.pw2 && nickname && username && pw && pw2,
    [errors, nickname, username, pw, pw2]
  );

  const onSubmit = () => {
    if (!isValid) return;
    // TODO: 실제 회원가입 API 연동
    Alert.alert("회원가입 완료", "로그인 화면으로 이동합니다.", [
      { text: "확인", onPress: () => router.replace("/login") },
    ]);
  };

  return (
    <View style={themeStyles.screen}>
      <Header title="회원가입" onBack={() => router.back()} />

      <View style={{ padding: 16 }}>
        {/* 브랜드 */}
        <View style={s.hero}>
          <View style={s.logoCircle}>
            <Ionicons name="person-add-outline" size={22} color="#0f172a" />
          </View>
          <Text style={s.brand}>
            Re:Route <Text style={{ color: "#0f172a", fontWeight: "900" }}>충주</Text>
          </Text>
          <Text style={s.subtitle}>충주시 버스 알리미 · 회원가입</Text>
        </View>

        {/* 입력 카드 */}
        <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* 닉네임 */}
          <Text style={[s.label, { color: colors.text }]}>닉네임</Text>
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="예: 충주시민"
            placeholderTextColor={colors.mutedText}
            style={s.input}
            returnKeyType="next"
          />
          {!!errors.nickname && <Text style={s.err}>{errors.nickname}</Text>}

          {/* 아이디 */}
          <Text style={[s.label, { marginTop: 12, color: colors.text }]}>아이디</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="아이디를 입력하세요."
            placeholderTextColor={colors.mutedText}
            autoCapitalize="none"
            style={s.input}
            returnKeyType="next"
          />
          {!!errors.username && <Text style={s.err}>{errors.username}</Text>}

          {/* 비밀번호 */}
          <Text style={[s.label, { marginTop: 12, color: colors.text }]}>비밀번호</Text>
          <TextInput
            value={pw}
            onChangeText={setPw}
            placeholder="비밀번호"
            placeholderTextColor={colors.mutedText}
            secureTextEntry
            style={s.input}
            returnKeyType="next"
          />
          {!!errors.pw && <Text style={s.err}>{errors.pw}</Text>}

          {/* 비밀번호 확인 */}
          <Text style={[s.label, { marginTop: 12, color: colors.text }]}>비밀번호 확인</Text>
          <TextInput
            value={pw2}
            onChangeText={setPw2}
            placeholder="비밀번호 확인"
            placeholderTextColor={colors.mutedText}
            secureTextEntry
            style={s.input}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />
          {!!errors.pw2 && <Text style={s.err}>{errors.pw2}</Text>}

          {/* 가입 버튼 */}
          <Pressable style={s.btnShadow} onPress={onSubmit} disabled={!isValid}>
            <LinearGradient
              colors={GRAD}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[s.primaryBtn, !isValid && { opacity: 0.6 }]}
            >
              <Text style={s.primaryBtnText}>회원가입</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* 로그인 이동 */}
        <View style={s.footerRow}>
          <Text style={{ color: colors.mutedText }}>이미 계정이 있으신가요?</Text>
          <Pressable onPress={() => router.replace("/login")}>
            <Text style={[s.link, { color: "#3B82F6" }]}> 로그인</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: "center", marginTop: 8, marginBottom: 14 },
  logoCircle: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: "white",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
    marginBottom: 8,
  },
  brand: { fontSize: 22, fontWeight: "900", color: "#0f172a" },
  subtitle: { marginTop: 2, fontSize: 12, color: "#64748B" },

  card: {
    borderWidth: 1, borderRadius: 16, padding: 14,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },

  label: { fontSize: 12, fontWeight: "800" },
  input: {
    marginTop: 6, height: 44, borderRadius: 12, paddingHorizontal: 12,
    backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E5E7EB", color: "#0f172a",
  },
  err: { marginTop: 4, fontSize: 11, color: "#DC2626", fontWeight: "700" },

  btnShadow: { marginTop: 14, borderRadius: 12, overflow: "hidden" },
  primaryBtn: { height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  primaryBtnText: { fontSize: 15, fontWeight: "900", color: "#0f172a" },

  footerRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16 },
  link: { fontWeight: "900" },
});
