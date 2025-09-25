// app/_layout.tsx
import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { ThemeProvider } from "../src/theme/ThemeProvider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="splash">
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
