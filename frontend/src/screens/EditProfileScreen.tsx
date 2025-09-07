// src/screens/EditProfileScreen.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";

const GRAD = ["#cfefff", "#d7f7e9"]; // 팔레트 유지
const BIO_MAX = 200;

export default function EditProfileScreen() {
  const { styles: themeStyles, colors } = useTheme();
  const router = useRouter();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [nickname, setNickname] = useState("충주시민");
  const [username] = useState("chungju_user");
  const [bio, setBio] = useState("");

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 필요", "앨범 접근 권한이 필요합니다.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const dirty = useMemo(
    () => nickname !== "충주시민" || !!avatarUri || bio.trim() !== "",
    [nickname, avatarUri, bio]
  );

  const handleSave = async () => {
    // TODO: 실제 저장 API 연동
    // await api.updateProfile({ nickname, avatarUri, bio })
    Alert.alert("저장 완료", "프로필이 업데이트되었습니다.");
    router.back();
  };

  return (
    <View style={themeStyles.screen}>
      <Header
        title="개인정보 수정"
        onBack={() => router.back()}
        right={{
          icon: "save-outline",
          onPress: dirty ? handleSave : undefined,
        }}
      />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {/* 카드 1: 기본 정보 (사진 + 닉네임 + 자기소개) */}
        <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={s.cardTitle}>기본 정보</Text>

          {/* 아바타 영역 */}
          <View style={s.avatarRow}>
            <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.avatarRing}>
              <View style={s.avatarInner}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={s.avatarImg} />
                ) : (
                  <Ionicons name="person-outline" size={36} color="#0f172a" />
                )}
              </View>
            </LinearGradient>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.label}>프로필 사진</Text>
              <Text style={s.helper}>정사각형 이미지를 권장합니다.</Text>
            </View>

            <Pressable onPress={pickAvatar} style={s.smallBtnShadow}>
              <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.smallBtn}>
                <Ionicons name="image-outline" size={16} color="#0f172a" />
                <Text style={s.smallBtnText}>사진 변경</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* 닉네임 */}
          <Text style={[s.label, { marginTop: 8 }]}>닉네임</Text>
          <TextInput
            style={s.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임"
            placeholderTextColor="#9CA3AF"
          />

          {/* 자기소개 */}
          <View style={{ marginTop: 12 }}>
            <View style={s.rowBetween}>
              <Text style={s.label}>자기소개</Text>
              <Text style={s.counter}>
                {bio.length}/{BIO_MAX}
              </Text>
            </View>
            <TextInput
              style={s.textarea}
              value={bio}
              onChangeText={(t) => t.length <= BIO_MAX && setBio(t)}
              placeholder="간단한 소개를 입력하세요 (최대 200자)"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* 저장 버튼 */}
          <Pressable
            onPress={handleSave}
            disabled={!dirty}
            style={({ pressed }) => [
              s.primaryShadow,
              !dirty && { opacity: 0.6 },
              pressed && { opacity: 0.9 },
            ]}
          >
            <LinearGradient colors={GRAD} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.primaryBtn}>
              <Ionicons name="save-outline" size={18} color="#0f172a" />
              <Text style={s.primaryBtnText}>저장하기</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* 카드 2: 계정 정보 (아이디만 표시/수정 불가) */}
        <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={s.cardTitle}>계정 정보</Text>

          <Text style={s.label}>아이디 (변경 불가)</Text>
          <TextInput style={[s.input, s.inputDisabled]} value={username} editable={false} />
          <Text style={s.helper}>아이디는 변경할 수 없습니다.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  // 안내 카드
  hero: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
    overflow: "hidden",
    alignItems:"center",
  },
  heroOverlay: { ...StyleSheet.absoluteFillObject, opacity: 0.22 },
  heroTitle: { fontSize: 22, fontWeight: "800", color: "#0f172a", textAlign:"center", },
  heroSub: { marginTop: 4, fontSize: 13, fontWeight: "500", textAlign:"center",},

  // 공통 카드
  card: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", marginBottom: 12, color: "#0f172a" },

  // 아바타
  avatarRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatarRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },

  // 레이블/헬퍼
  label: { fontSize: 13, fontWeight: "700", color: "#0f172a" },
  helper: { marginTop: 2, fontSize: 11, color: "#64748B" },

  // 입력들
  input: {
    marginTop: 6,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#0f172a",
  },
  textarea: {
    marginTop: 6,
    minHeight: 96,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#0f172a",
  },
  inputDisabled: { backgroundColor: "#F3F4F6", color: "#6B7280" },

  // 버튼들
  primaryShadow: { borderRadius: 12, overflow: "hidden", marginTop: 14 },
  primaryBtn: {
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryBtnText: { fontSize: 15, fontWeight: "800", color: "#0f172a" },

  smallBtnShadow: { borderRadius: 10, overflow: "hidden" },
  smallBtn: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  smallBtnText: { fontSize: 12, fontWeight: "800", color: "#0f172a" },

  // 보조
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  counter: { fontSize: 11, color: "#64748B" },
});
