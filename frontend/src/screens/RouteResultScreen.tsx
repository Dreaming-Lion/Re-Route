import React from "react";
import { View, Text } from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";

export default function RouteDetailScreen() {
  const { styles } = useTheme();
  const router = useRouter();

  const items = [
    { bus: "370번", time: "3분", note: "2정거장 전" },
    { bus: "470번", time: "7분", note: "5정거장 전" },
    { bus: "143번", time: "12분", note: "8정거장 전" },
  ];

  return (
    <View style={styles.screen}>
      <Header title="버스 위치" onBack={() => router.back()} />
      <View style={{ padding: 16 }}>
        <View style={[styles.card, { marginBottom: 12 }]}>
          <Text style={[styles.text, { fontWeight: "700", marginBottom: 4 }]}>강남역 3번 출구</Text>
          <Text>142번 정류장</Text>
        </View>
        {items.map((b, i) => (
          <View key={i} style={[styles.card, { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }]}>
            <Text style={styles.text}>{b.bus}</Text>
            <Text style={{ fontWeight: "700", color: "#3b82f6" }}>{b.time}</Text>
            <Text>{b.note}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
