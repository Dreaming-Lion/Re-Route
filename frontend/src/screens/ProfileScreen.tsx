// src/screens/ProfileScreen.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { Icon } from "../components/common/Icon";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { styles, colors } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <Header title="마이페이지" />
      <View style={{ padding: 16 }}>
        <View style={[styles.card, { flexDirection: "row", alignItems: "center", gap: 12 }]}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#E8F7F4", alignItems: "center", justifyContent: "center" }}>
            <Icon name="person-outline" size={26} />
          </View>
          <View>
            <Text style={[styles.text, { fontSize: 18, fontWeight: "700" }]}>충주시민</Text>
            <Text style={{ color: colors.mutedForeground }}>chungju_user</Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/edit-profile")}
          style={[styles.card, { marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Icon name="create-outline" />
            <Text style={[styles.text, { fontWeight: "600" }]}>개인정보 수정</Text>
          </View>
          <Icon name="chevron-forward" />
        </Pressable>
      </View>
    </View>
  );
}
