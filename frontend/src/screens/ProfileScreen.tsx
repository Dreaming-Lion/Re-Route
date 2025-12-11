// src/screens/ProfileScreen.tsx
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FavoriteItem = {
  id: number | string;
  name: string;
  address: string;
  emoji?: string;
  lat?: number | null;
  lng?: number | null;
};

type Profile = {
  avatarUri: string | null;
  nickname: string;
  bio: string;
};

const GRAD = ["#cfefff", "#d7f7e9"];
const PROFILE_KEY = "@profile_v1";
const FAVORITES_KEY = "@favorites_v1";

export default function MyPageScreen() {
  const { styles: themeStyles, colors, radii } = useTheme();
  const router = useRouter();

  // 프로필
  const [profile, setProfile] = useState<Profile>({
    avatarUri: null,
    nickname: "충주시민",
    bio: "",
  });
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(PROFILE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Profile;
        setProfile({
          avatarUri: saved.avatarUri ?? null,
          nickname: saved.nickname ?? "충주시민",
          bio: saved.bio ?? "",
        });
      } else {
        setProfile({ avatarUri: null, nickname: "충주시민", bio: "" });
      }
    } catch {
      setProfile({ avatarUri: null, nickname: "충주시민", bio: "" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  // 즐겨찾기 (로컬 스토리지에서 불러오기)
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const loadFavorites = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(FAVORITES_KEY);
      const list = raw ? (JSON.parse(raw) as FavoriteItem[]) : [];
      if (Array.isArray(list)) setFavorites(list);
      else setFavorites([]);
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  return (
    <View style={themeStyles.screen}>
      <Header title="마이페이지" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {/* 프로필 카드 */}
        <View style={[s.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.cardOverlay} />

          {/* 아바타 */}
          <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.avatarRing}>
            <View style={s.avatarInner}>
              {profile.avatarUri ? (
                <Image source={{ uri: profile.avatarUri }} style={s.avatarImg} />
              ) : (
                <Ionicons name="person-outline" size={28} color="#0f172a" />
              )}
            </View>
          </LinearGradient>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.name}>{loading ? "불러오는 중..." : profile.nickname || "충주시민"}</Text>
            <Text style={s.caption} numberOfLines={1}>
              {loading ? " " : profile.bio || "자기소개를 추가해 보세요"}
            </Text>
          </View>

          {/* 개인정보 수정 버튼 */}
          <Pressable
            onPress={() => router.push("/edit-profile")}
            style={({ pressed }) => [s.editBtnShadow, pressed && { opacity: 0.95 }]}
          >
            <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.editBtnGrad}>
              <Ionicons name="create-outline" size={16} color="#0f172a" />
              <Text style={s.editBtnText}>개인정보 수정</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* 즐겨찾는 장소 (로컬 스토리지 기반) */}
        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: colors.text }]}>즐겨찾는 장소</Text>
          <Pressable onPress={() => router.push("/(tabs)/favorites")}>
            <Text style={[s.addLink, { color: "#3B82F6" }]}>관리</Text>
          </Pressable>
        </View>

        {favorites.length === 0 ? (
          <View
            style={[
              s.favItem,
              { backgroundColor: colors.card, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
            ]}
          >
            <Text style={{ color: colors.mutedText }}>저장된 즐겨찾기가 없습니다. 관리에서 추가해 보세요.</Text>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {favorites.map((f) => (
              <Pressable
                key={String(f.id)}
                onPress={() => {
                  // 필요하면 route-result로 좌표 전달 가능
                  // router.push({ pathname: "/route-result", params: { lat: f.lat ?? "", lng: f.lng ?? "" } });
                }}
                style={({ pressed }) => [
                  s.favItem,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  pressed && { opacity: 0.96 },
                ]}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#E8F7F4",
                    borderRadius: radii.lg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 4,
                  }}
                >
                  <Text style={{ fontSize: 18 }}>{f.emoji || "📍"}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[s.favTitle, { color: colors.text }]} numberOfLines={1}>
                    {f.name}
                  </Text>
                  <Text style={[s.favDesc, { color: colors.mutedText }]} numberOfLines={1}>
                    {f.address}
                  </Text>
                </View>

                <View style={s.chevBtn}>
                  <Ionicons name="chevron-forward" size={16} color="#60A5FA" />
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  profileCard: {
    borderRadius: 16,
    padding: 14,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
  },
  avatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  avatarInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },
  name: { fontSize: 18, fontWeight: "800", color: "#0f172a" },
  caption: { marginTop: 2, fontSize: 12, color: "#475569" },

  editBtnShadow: { borderRadius: 12, overflow: "hidden" },
  editBtnGrad: {
    height: 36,
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  editBtnText: { fontSize: 13, fontWeight: "800", color: "#0f172a" },

  sectionHeader: {
    marginTop: 6,
    marginBottom: 8,
    paddingHorizontal: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 15, fontWeight: "800" },
  addLink: { fontSize: 12, fontWeight: "700" },

  favItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  favTitle: { fontSize: 14, fontWeight: "700" },
  favDesc: { fontSize: 12, fontWeight: "500" },
  chevBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  logoutBtn: {
    marginTop: 18,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#EF4444",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  logoutText: { color: "white", fontSize: 15, fontWeight: "800" },
});
