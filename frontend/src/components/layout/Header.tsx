// src/components/layout/Header.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "../common/Icon";
import { useTheme } from "../../theme/ThemeProvider";

type Props = {
  title: string;
  onBack?: () => void;
  right?: { icon: any; onPress: () => void } | null;
  gradient?: boolean;
};
export default function Header({ title, onBack, right, gradient = true }: Props) {
  const { colors } = useTheme();
  const Content = (
    <View style={styles.row}>
      <View style={styles.left}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={8} style={styles.iconBtn}>
            <Icon name="chevron-back" size={22} color={colors.foreground} />
          </Pressable>
        ) : <View style={styles.iconBtn} />}
      </View>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <View style={styles.right}>
        {right ? (
          <Pressable onPress={right.onPress} hitSlop={8} style={styles.iconBtn}>
            <Icon name={right.icon} size={20} color={colors.foreground} />
          </Pressable>
        ) : <View style={styles.iconBtn} />}
      </View>
    </View>
  );
  return gradient ? (
    <LinearGradient colors={["#cfefff", "#d7f7e9"]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.wrap}>
      {Content}
    </LinearGradient>
  ) : <View style={[styles.wrap, { backgroundColor: colors.secondary }]}>{Content}</View>;
}
const styles = StyleSheet.create({
  wrap: { paddingTop: 48, paddingHorizontal: 12, paddingBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  left: { width: 40, alignItems: "flex-start" },
  right: { width: 40, alignItems: "flex-end" },
  iconBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "600" },
});
