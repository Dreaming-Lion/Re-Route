import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { Icon } from "../components/common/Icon";
import { useRouter } from "expo-router";

const recommended = [
  { name: "충주역", desc: "충주시 연수동 1135-1", icon: "train-outline" },
  { name: "충주시청", desc: "충주시 금릉동 14-2", icon: "business-outline" },
  { name: "건국대학교", desc: "충주시 단월동 322", icon: "school-outline" },
];

export default function SearchScreen() {
  const { styles, colors, radii } = useTheme();
  const router = useRouter();

  const [recent, setRecent] = useState(["건국대학교 충주캠퍼스", "충주시청", "중앙탑공원"]);
  const [q, setQ] = useState("");

  return (
    <View style={styles.screen}>
      <Header title="목적지 검색" />
      <View style={{ padding: 16 }}>
        {/* Search Bar */}
        <View style={{ position: "relative", marginBottom: 16 }}>
          <View style={{ position: "absolute", left: 12, top: 12 }}>
            <Icon name="search" />
          </View>
          <TextInput
            placeholder="목적지를 입력하세요"
            placeholderTextColor={colors.mutedForeground}
            value={q}
            onChangeText={setQ}
            style={[styles.input, { paddingLeft: 36 }]}
          />
        </View>

        {/* Recent */}
        {recent.length > 0 && (
          <>
            <Text style={[styles.text, { fontSize: 16, fontWeight: "600", marginBottom: 8 }]}>최근 목적지</Text>
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
                  onPress={() => router.push("/route-result")}
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

        {/* Recommended */}
        <Text style={[styles.text, { fontSize: 16, fontWeight: "600", marginTop: 12, marginBottom: 8 }]}>
          추천 검색지
        </Text>
        {recommended.map((p, i) => (
          <Pressable
            key={i}
            onPress={() => router.push("/route-result")}
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
      </View>
    </View>
  );
}
