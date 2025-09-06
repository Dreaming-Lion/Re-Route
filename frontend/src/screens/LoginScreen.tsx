// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const { styles } = useTheme();
  const router = useRouter();
  const [username, setU] = useState("");
  const [password, setP] = useState("");

  return (
    <View style={styles.screen}>
      <Header title="로그인" onBack={() => router.back()} />
      <View style={{ padding: 16 }}>
        <TextInput style={styles.input} placeholder="아이디" onChangeText={setU} />
        <TextInput style={[styles.input, { marginTop: 8 }]} placeholder="비밀번호" secureTextEntry onChangeText={setP} />
        <Pressable style={[styles.button, { marginTop: 12 }]} onPress={() => router.replace("/")}>
          <Text style={styles.buttonText}>로그인</Text>
        </Pressable>
        <Pressable style={{ marginTop: 12 }} onPress={() => router.push("/signup")}>
          <Text>회원가입</Text>
        </Pressable>
      </View>
    </View>
  );
}
