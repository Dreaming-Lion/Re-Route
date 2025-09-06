// src/screens/HomeScreen.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { styles, colors } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <Header title="홈" />
      <View style={{ padding: 16 }}>
        <View style={styles.card}>
          <Text style={[styles.text, { fontWeight: "700", marginBottom: 8 }]}>목적지를 검색해 보세요</Text>
          <Pressable
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={() => router.push("/search")}
          >
            <Text style={styles.buttonText}>검색으로 이동</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
