// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import TabBar from "../../src/components/layout/TabBar";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(p) => <TabBar {...p} />}>
      <Tabs.Screen name="home" options={{ tabBarLabel: "홈" }} />
      {/* <Tabs.Screen name="search" options={{ tabBarLabel: "커뮤니티" }} /> */}
      <Tabs.Screen name="favorites" options={{ tabBarLabel: "즐겨찾기" }} />
      <Tabs.Screen name="profile" options={{ tabBarLabel: "마이페이지" }} />
    </Tabs>
  );
}
