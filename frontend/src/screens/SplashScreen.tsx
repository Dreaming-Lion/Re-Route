// src/screens/SplashScreen.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  // 로딩 아이콘 회전 애니메이션
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);
  const spinDeg = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={s.container}>
      {/* 배경 그라데이션 (로그인 버튼과 동일 팔레트) */}
      <LinearGradient
        colors={["#cfefff", "#d7f7e9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* 부드러운 데코 원들 */}
      <View style={[s.bubble, { top: 40, left: -20, width: 140, height: 140 }]} />
      <View style={[s.bubble, { top: height * 0.22, right: -30, width: 180, height: 180, opacity: 0.35 }]} />
      <View style={[s.bubble, { bottom: 60, left: width * 0.2, width: 120, height: 120, opacity: 0.25 }]} />

      {/* 카드 */}
      <View style={s.card}>
        {/* 원형 로고(그라데이션) */}
        <LinearGradient
          colors={["#39B7F6", "#16C79A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.logoCircle}
        >
          <Ionicons name="location-outline" size={28} color="white" />
        </LinearGradient>

        {/* 브랜드 타이포 */}
        <Text style={s.brand}>
          <Text style={{ color: "#2563EB" }}>Re:</Text>
          <Text style={{ color: "#10B981" }}>Route</Text>
        </Text>

        {/* 서브텍스트 */}
        <Text style={s.subtitle}>충주야</Text>

        {/* 로딩 인디케이터 (회전 아이콘) */}
        <Animated.View style={{ transform: [{ rotate: spinDeg }], marginTop: 10 }}>
          <Ionicons name="refresh-circle-outline" size={28} color="#60A5FA" />
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 9999,
  },
  card: {
    width: 220,
    paddingVertical: 28,
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  brand: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
  },
});
