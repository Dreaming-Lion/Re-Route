import React, { useState } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";

export default function SignupScreen() {
  const { styles } = useTheme();
  const router = useRouter();
  const [f, sF] = useState({ nickname: "", username: "", password: "", confirm: "" });

  return (
    <View style={styles.screen}>
      <Header title="회원가입" onBack={() => router.back()} />
      <View style={{ padding: 16 }}>
        {["닉네임", "아이디", "비밀번호", "비밀번호 확인"].map((label, i) => (
          <TextInput
            key={i}
            style={[styles.input, i > 0 && { marginTop: 8 }]}
            placeholder={label}
            secureTextEntry={i > 1}
          />
        ))}
        <Pressable style={[styles.button, { marginTop: 12 }]} onPress={() => router.replace("/login")}>
          <Text style={styles.buttonText}>회원가입</Text>
        </Pressable>
      </View>
    </View>
  );
}
