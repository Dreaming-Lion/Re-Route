// src/components/layout/TabBar.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Icon } from "../common/Icon";
import { useTheme } from "../../theme/ThemeProvider";

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {state.routes.map((route: { key: React.Key | null | undefined; name: string; }, index: any) => {
        const focused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name as never);
        };
        const label = descriptors[route.key].options.tabBarLabel ?? descriptors[route.key].options.title ?? route.name;

        const iconName =
          route.name === "Home" ? "location-outline" :
          route.name === "Search" ? "search" :
          route.name === "Favorites" ? "time-outline" :
          "person-circle-outline";

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.item}>
            <Icon name={iconName} size={20} color={focused ? colors.accent : colors.foreground} />
            <Text style={[styles.txt, { color: focused ? colors.accent : colors.foreground }]}>{label as string}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { flexDirection: "row", borderTopWidth: 1, paddingVertical: 6 },
  item: { flex: 1, alignItems: "center", justifyContent: "center", gap: 2, paddingVertical: 4 },
  txt: { fontSize: 12, fontWeight: "500" },
});
