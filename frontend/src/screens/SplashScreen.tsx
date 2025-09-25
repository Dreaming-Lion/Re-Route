// src/screens/SplashScreen.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

/** 밝은 파스텔 그라데이션 (스크린샷 톤) */
const BG_GRAD = ["#dff2ff", "#e9fff6"]; // 하늘→민트 쿨톤, 밝게
const LOGO_GRAD = ["#3B82F6", "#10B981"]; // 브랜드 블루→그린

export default function SplashScreen() {
  // 로딩 아이콘 회전
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);
  const spinDeg = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  // 로고 살짝 둥둥
  const float = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [float]);
  const floatY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

  // 보케(흰 원) 은은한 숨쉬기 + 페이드
  const mkPulse = (delay = 0) => {
    const v = new Animated.Value(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 2200, delay, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
    return v;
  };
  const p1 = useRef(mkPulse(0)).current;      // 좌상
  const p2 = useRef(mkPulse(400)).current;    // 우중
  const p3 = useRef(mkPulse(900)).current;    // 좌하
  const scale1 = p1.interpolate({ inputRange: [0, 1], outputRange: [1, 1.07] });
  const scale2 = p2.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });
  const scale3 = p3.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const op1 = p1.interpolate({ inputRange: [0, 1], outputRange: [0.22, 0.32] });
  const op2 = p2.interpolate({ inputRange: [0, 1], outputRange: [0.16, 0.26] });
  const op3 = p3.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.22] });

  return (
    <View style={s.container}>
      {/* 밝은 그라데이션 배경 */}
      <LinearGradient
        colors={BG_GRAD}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* 보케(흰 원) – 은은한 스케일/투명도 애니메이션 */}
      <Animated.View
        style={[
          s.bokeh,
          { top: 36, left: -22, width: 160, height: 160, opacity: op1, transform: [{ scale: scale1 }] },
        ]}
      />
      <Animated.View
        style={[
          s.bokeh,
          { top: height * 0.22, right: -34, width: 210, height: 210, opacity: op2, transform: [{ scale: scale2 }] },
        ]}
      />
      <Animated.View
        style={[
          s.bokeh,
          { bottom: 64, left: width * 0.22, width: 140, height: 140, opacity: op3, transform: [{ scale: scale3 }] },
        ]}
      />

      {/* 카드 */}
      <View style={s.card}>
        {/* 원형 로고(브랜드 그라데이션) + 미세 플로팅 */}
        <Animated.View style={{ transform: [{ translateY: floatY }] }}>
          <LinearGradient colors={LOGO_GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.logoCircle}>
            <Ionicons name="location-outline" size={28} color="white" />
          </LinearGradient>
        </Animated.View>

        {/* 브랜드 타이포 (밝은 배경에 또렷하게) */}
        <Text style={s.brand}>
          <Text style={{ color: LOGO_GRAD[0] }}>Re:</Text>
          <Text style={{ color: LOGO_GRAD[1] }}>Route</Text>
        </Text>

        {/* 로딩 인디케이터(회전) */}
        <Animated.View style={{ transform: [{ rotate: spinDeg }], marginTop: 10 }}>
          <Ionicons name="refresh-circle-outline" size={28} color="#3B82F6" />
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },

  // 밝은 흰색 보케
  bokeh: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 9999,
    // 살짝 블러 느낌용 그림자 (웹/안드로이드 차이 고려)
    shadowColor: "#ffffff",
    shadowOpacity: Platform.OS === "web" ? 0.7 : 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },

  card: {
    width: 230,
    paddingVertical: 28,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    shadowColor: "#86c5ff",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    marginTop: 14,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#5b6b7a",
    letterSpacing: 0.2,
  },
});
