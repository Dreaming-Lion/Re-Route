// src/components/layout/TabBar.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Icon } from "../common/Icon";
import { useTheme } from "../../theme/ThemeProvider";

const ACTIVE_BG = "#d7f7e9";   // 개인정보 수정 버튼의 솔리드 배경
const ACTIVE_BORDER = "#cfefff";
const ACTIVE_TINT = "#0f172a";

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name as never);
        };
        const label =
          descriptors[route.key].options.tabBarLabel ??
          descriptors[route.key].options.title ??
          route.name;

        const iconName =
          route.name === "Home" ? "location-outline" :
          route.name === "Search" ? "search" :
          route.name === "Favorites" ? "time-outline" :
          "person-circle-outline";

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.item}>
            {({ pressed }) => {
              const active = focused || pressed;
              const tint = active ? ACTIVE_TINT : colors.foreground;
              return (
                <View
                  style={[
                    styles.itemInner,
                    active && {
                      backgroundColor: ACTIVE_BG,
                      borderColor: ACTIVE_BORDER,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Icon name={iconName} size={20} color={tint} />
                  <Text style={[styles.txt, { color: tint }]}>{label as string}</Text>
                </View>
              );
            }}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", borderTopWidth: 1, paddingVertical: 6, paddingHorizontal: 8 },
  item: { flex: 1, paddingVertical: 4, paddingHorizontal: 6 },
  itemInner: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 6,
  },
  txt: { fontSize: 12, fontWeight: "600" },
});
