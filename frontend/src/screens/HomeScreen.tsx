import React, { useMemo, useState } from "react";
import {
  View, Text, Pressable, StyleSheet, Alert,
  ScrollView, KeyboardAvoidingView, Platform, Modal
} from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { Icon } from "../components/common/Icon";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { PLACES, type Place } from "../constants/stations";

const GRAD = ["#cfefff", "#d7f7e9"];

type ActionCardProps = {
  label: string;
  icon: string;
  onPress: () => void;
  colors: any;
};

function ActionCard({ label, icon, onPress, colors }: ActionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[s.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={s.actionIconCircle}>
        <Icon name={icon} />
      </View>
      <Text style={s.actionLabel}>{label}</Text>
    </Pressable>
  );
}

export default function SearchScreen() {
  const { styles, colors } = useTheme();
  const router = useRouter();

  const places = useMemo(() => (Array.isArray(PLACES) ? PLACES : []), []);

  const [origin, setOrigin] = useState<Place | null>(null);
  const [destination, setDestination] = useState<Place | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectType, setSelectType] = useState<"origin" | "destination">("origin");

  const openModal = (type: "origin" | "destination") => {
    setSelectType(type);
    setModalVisible(true);
  };

  const selectPlace = (place: Place) => {
    if (selectType === "origin") setOrigin(place);
    else setDestination(place);
    setModalVisible(false);
  };

  const swap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const goRouteResult = () => {
    if (!origin || !destination) {
      Alert.alert("입력 필요", "출발지와 목적지를 선택해 주세요.");
      return;
    }
    router.push({
      pathname: "/route-result",
      params: {
        originId: origin.id,
        originName: origin.label,
        destinationId: destination.id,
        destinationName: destination.label,
      },
    });
  };

  return (
    <View style={styles.screen}>
      <Header title="목적지 검색" />

      <View style={s.actionsRow}>
        <ActionCard label="즐겨찾기" icon="heart-outline" onPress={() => router.push("/favorites")} colors={colors} />
        <ActionCard label="사용 가이드" icon="flash-outline" onPress={() => router.push("/guide")} colors={colors} />
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>장소 선택</Text>

            {places.map((place) => (
              <Pressable
                key={place.id}
                onPress={() => selectPlace(place)}
                style={s.modalItem}
              >
                <Text style={s.modalItemText}>{place.label}</Text>
              </Pressable>
            ))}

            <Pressable onPress={() => setModalVisible(false)} style={s.modalCancel}>
              <Text style={{ fontSize: 16, color: "#555" }}>취소</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Pressable style={[s.inputRow, { borderColor: colors.border }]} onPress={() => openModal("origin")}>
              <Icon name="navigate-outline" />
              <Text style={s.inputText}>{origin?.label || "출발지 선택"}</Text>
            </Pressable>

            <Pressable onPress={swap} style={s.swapBtn}>
              <Icon name="swap-vertical" />
            </Pressable>

            <Pressable style={[s.inputRow, { borderColor: colors.border }]} onPress={() => openModal("destination")}>
              <Icon name="location-outline" />
              <Text style={s.inputText}>{destination?.label || "목적지 선택"}</Text>
            </Pressable>

            <Pressable onPress={goRouteResult} style={s.searchBtnShadow}>
              <LinearGradient colors={GRAD} style={s.searchBtn}>
                <Icon name="search" />
                <View style={{ width: 6 }} />
                <Text style={s.searchBtnText}>경로 검색</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  actionsRow: { flexDirection: "row", paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, justifyContent: "space-between", gap: 8 },
  actionCard: { flex: 1, borderWidth: 1, borderRadius: 16, paddingVertical: 10, paddingHorizontal: 8, alignItems: "center", justifyContent: "center" },
  actionIconCircle: { width: 32, height: 32, borderRadius: 999, backgroundColor: "#E8F7F4", alignItems: "center", justifyContent: "center", marginBottom: 4 },
  actionLabel: { fontSize: 12, fontWeight: "600", color: "#0f172a" },

  card: { borderWidth: 1, borderRadius: 16, padding: 16 },
  inputRow: { flexDirection: "row", alignItems: "center", height: 48, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, marginBottom: 12 },
  inputText: { marginLeft: 8, fontSize: 15, color: "#0f172a" },
  swapBtn: { alignSelf: "center", marginBottom: 12, borderRadius: 999, width: 40, height: 40, alignItems: "center", justifyContent: "center", backgroundColor: "#F1F5F9" },

  searchBtnShadow: { borderRadius: 12, overflow: "hidden", marginTop: 8 },
  searchBtn: { height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  searchBtnText: { fontSize: 16, fontWeight: "800", color: "#0f172a" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "80%", maxWidth: 340, backgroundColor: "#fff", padding: 20, borderRadius: 16 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  modalItem: { paddingVertical: 12, borderBottomWidth: 1, borderColor: "#eee" },
  modalItemText: { fontSize: 16 },
  modalCancel: { paddingTop: 12, alignItems: "center" },
});
