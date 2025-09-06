import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { Icon } from "../components/common/Icon";
import { useRouter } from "expo-router";

export default function FavoritesScreen() {
  const { styles, colors, radii } = useTheme();
  const router = useRouter();

  const [favorites, setFavorites] = useState([
    { id: 1, name: "건국대학교 충주캠퍼스", address: "충주시 단월동 322", emoji: "🎓" },
    { id: 2, name: "충주역", address: "충주시 연수동 1135-1", emoji: "🚉" },
  ]);

  return (
    <View style={styles.screen}>
      <Header title="즐겨찾는 장소" right={{ icon: "add", onPress: () => router.push("/search") }} />
      <View style={{ padding: 16 }}>
        {favorites.map((f) => (
          <View
            key={f.id}
            style={[
              styles.card,
              { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
            ]}
          >
            <Pressable
              onPress={() => router.push("/route-result")}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#E8F7F4",
                  borderRadius: radii.lg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 18 }}>{f.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.text, { fontWeight: "600" }]}>{f.name}</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{f.address}</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setFavorites((prev) => prev.filter((x) => x.id !== f.id))}>
              <Icon name="trash-outline" color="#b34a3a" />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
