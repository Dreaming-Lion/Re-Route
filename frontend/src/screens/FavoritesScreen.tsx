// src/screens/FavoritesScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput, Alert } from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { Icon } from "../components/common/Icon";
import { useRouter, useLocalSearchParams } from "expo-router";

const GRAD = ["#cfefff", "#d7f7e9"];

export default function FavoritesScreen() {
  const { styles, colors, radii } = useTheme();
  const router = useRouter();

  const [favorites, setFavorites] = useState([
    { id: 1, name: "건국대학교 충주캠퍼스", address: "충주시 단월동 322", emoji: "🎓" },
    { id: 2, name: "충주역", address: "충주시 연수동 1135-1", emoji: "🚉" },
  ]);

  // 상단 카드 입력값
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pickedEmoji, setPickedEmoji] = useState< string | null >(null);

  // map-pick에서 되돌아올 때 입력란에 채워 넣기
  const params = useLocalSearchParams<{ name?: string; address?: string; emoji?: string; addedAt?: string }>();
  useEffect(() => {
    if (params?.name || params?.address) {
      setName(String(params.name ?? ""));
      setAddress(String(params.address ?? ""));
      setPickedEmoji(params.emoji ? String(params.emoji) : "📍");
      // 파라미터 비우기
      router.replace("/(tabs)/favorites");
    }
  }, [params?.addedAt]);

  const addFavorite = () => {
    if (!name.trim() || !address.trim()) {
      Alert.alert("입력 필요", "장소명과 주소를 모두 입력해 주세요.");
      return;
    }
    setFavorites(prev => [
      { id: Date.now(), name: name.trim(), address: address.trim(), emoji: pickedEmoji ?? "📍" },
      ...prev,
    ]);
    setName("");
    setAddress("");
    setPickedEmoji(null);
  };

  return (
    <View style={styles.screen}>
      <Header title="즐겨찾는 장소" />

      <View style={{ padding: 16 }}>
        {/* ── 장소 검색/추가 카드 (상단) ───────────────────────── */}
        <View style={[s.searchCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.text, { fontWeight: "800", marginBottom: 8 }]}>장소 추가</Text>

          {/* 장소명 */}
          <View style={[s.inputRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Icon name="location-outline" />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="장소명 (예: 집)"
              placeholderTextColor={colors.mutedForeground}
              style={s.input}
              returnKeyType="next"
            />
          </View>

          {/* 주소 */}
          <View style={[s.inputRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Icon name="map-outline" />
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="주소"
              placeholderTextColor={colors.mutedForeground}
              style={s.input}
              returnKeyType="done"
              onSubmitEditing={addFavorite}
            />
          </View>

          {/* 액션 버튼들 */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
            <Pressable
              onPress={() => router.push("/map-pick")}
              style={[
                s.btnOutline,
                { borderColor: "#cfefff", backgroundColor: "#f6fffb" },
              ]}
            >
              <Icon name="map-outline" />
              <Text style={s.btnOutlineText}>지도에서 선택</Text>
            </Pressable>

            <Pressable onPress={addFavorite} style={s.btnSolid}>
              <Icon name="add" />
              <Text style={s.btnSolidText}>즐겨찾기에 추가</Text>
            </Pressable>
          </View>
        </View>

        {/* ── 즐겨찾기 목록 (카드 아래) ───────────────────────── */}
        <Text style={[styles.text, { fontSize: 16, fontWeight: "800", marginTop: 10, marginBottom: 8 }]}>
          내 즐겨찾기
        </Text>

        {favorites.map(f => (
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

            <Pressable onPress={() => setFavorites(prev => prev.filter(x => x.id !== f.id))}>
              <Icon name="trash-outline" color="#b34a3a" />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  searchCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  input: { flex: 1, marginLeft: 8, fontSize: 15 },

  // 버튼들
  btnOutline: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  btnOutlineText: { fontWeight: "800", color: "#0f172a" },

  btnSolid: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#d7f7e9",
    borderWidth: 1,
    borderColor: "#cfefff",
  },
  btnSolidText: { fontWeight: "800", color: "#0f172a" },
});
