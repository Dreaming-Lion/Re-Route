// src/screens/FavoritesScreen.tsx
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, TextInput, Alert, ScrollView } from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { Icon } from "../components/common/Icon";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FavItem = {
  id: number;
  name: string;
  address: string;
  emoji: string;
  lat?: number | null;
  lng?: number | null;
};

const FAVORITES_KEY = "@favorites_v1";
const LAST_PICK_KEY = "@last_pick_v1";

export default function FavoritesScreen() {
  const { styles, colors, radii } = useTheme();
  const router = useRouter();

  const [favorites, setFavorites] = useState<FavItem[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pickedEmoji, setPickedEmoji] = useState<string | null>(null);
  const [pickedCoord, setPickedCoord] = useState<{ lat?: number | null; lng?: number | null }>({});

  // 최초: 즐겨찾기 복구
  useEffect(() => {
    (async () => {
        const raw = await AsyncStorage.getItem(FAVORITES_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as FavItem[];
          if (Array.isArray(saved)) {
            setFavorites(saved);
            return;
          }
        }
    })();
  }, []);

  // 변경 시 저장
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch {}
    })();
  }, [favorites]);

  // map-pick에서 돌아오면: 저장된 LAST_PICK_KEY 읽어 입력란 채우기
  const params = useLocalSearchParams<{ addedAt?: string }>();
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const raw = await AsyncStorage.getItem(LAST_PICK_KEY);
          if (!raw) return;
          const p = JSON.parse(raw) as { name?: string; address?: string; emoji?: string; lat?: number; lng?: number };
          setName(String(p.name ?? ""));
          setAddress(String(p.address ?? ""));
          setPickedEmoji(p.emoji ? String(p.emoji) : "📍");
          setPickedCoord({ lat: p.lat, lng: p.lng });
        } catch {}
      })();
    }, [params?.addedAt]) // 쿼리 변화 시 재조회
  );

  const addFavorite = () => {
    if (!name.trim() || !address.trim()) {
      Alert.alert("입력 필요", "장소명과 주소를 모두 입력해 주세요.");
      return;
    }
    const item: FavItem = {
      id: Date.now(),
      name: name.trim(),
      address: address.trim(),
      emoji: pickedEmoji ?? "📍",
      lat: pickedCoord.lat ?? null,
      lng: pickedCoord.lng ?? null,
    };
    setFavorites(prev => [item, ...prev]);
    setName("");
    setAddress("");
    setPickedEmoji(null);
    setPickedCoord({});
  };

  const removeFavorite = (id: number) => {
    setFavorites(prev => prev.filter(x => x.id !== id));
  };

  return (
    <View style={styles.screen}>
      <Header title="즐겨찾는 장소" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {/* 장소 추가 카드 */}
        <View style={[s.searchCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.text, { fontWeight: "800", marginBottom: 8 }]}>장소 추가</Text>

          {/* 장소명 */}
          <View style={[s.inputRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Icon name="location-outline" />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="장소명"
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

          {/* 액션 버튼 */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
            <Pressable onPress={() => router.push("/map-pick")} style={s.btnPaleBlue}>
              <Icon name="map-outline" color="#0f172a" />
              <Text style={s.btnPaleBlueText}>지도에서 선택</Text>
            </Pressable>

            <Pressable onPress={addFavorite} style={s.btnBlue}>
              <Icon name="add" color="#0f172a" />
              <Text style={s.btnBlueText}>즐겨찾기에 추가</Text>
            </Pressable>
          </View>
        </View>

        {/* 목록 */}
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
              onPress={() => router.push("/route-result")} // lat/lng가 있으면 여기서 활용 가능
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

            <Pressable onPress={() => removeFavorite(f.id)}>
              <Icon name="trash-outline" color="#b34a3a" />
            </Pressable>
          </View>
        ))}
      </ScrollView>
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
  btnPaleBlue: {
    flex: 1, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center",
    flexDirection: "row", gap: 6, backgroundColor: "#F6FAFF", borderWidth: 1, borderColor: "#CFEFFF",
  },
  btnPaleBlueText: { fontWeight: "800", color: "#0f172a" },
  btnBlue: {
    flex: 1, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center",
    flexDirection: "row", gap: 6, backgroundColor: "#CFEFFF", borderWidth: 1, borderColor: "#B7E3FF",
  },
  btnBlueText: { fontWeight: "800", color: "#0f172a" },
});
