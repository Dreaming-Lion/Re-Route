import React, { useState } from "react";
import { View, TextInput, Text } from "react-native";
import Header from "../components/layout/Header";
import { useTheme } from "../theme/ThemeProvider";
import { useRouter } from "expo-router";

export default function EditProfileScreen() {
  const { styles } = useTheme();
  const router = useRouter();

  const [nickname, setN] = useState("충주시민");
  const [username] = useState("chungju_user");

  return (
    <View style={styles.screen}>
      <Header
        title="개인정보 수정"
        onBack={() => router.back()}
        right={{ icon: "save-outline", onPress: () => router.back() }}
      />
      <View style={{ padding: 16 }}>
        <Text>닉네임</Text>
        <TextInput style={styles.input} value={nickname} onChangeText={setN} />
        <Text style={{ marginTop: 12 }}>아이디 (수정 불가)</Text>
        <TextInput style={[styles.input, { backgroundColor: "#f3f3f3" }]} value={username} editable={false} />
      </View>
    </View>
  );
}
