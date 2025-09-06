// theme/ThemeProvider.tsx
import React, { createContext, useContext, useMemo } from "react";
import { StyleSheet, useColorScheme, Text, TextInput } from "react-native";
import { light, dark, radii, type Palette } from "./tokens";

type Ctx = {
  scheme: "light" | "dark";
  colors: Palette;
  radii: typeof radii;
  styles: ReturnType<typeof StyleSheet.create>;
};

const ThemeContext = createContext<Ctx | null>(null);

export function ThemeProvider({
  children,
  forceScheme,
  enableGlobalTextDefaults = true,
}: {
  children: React.ReactNode;
  forceScheme?: "light" | "dark";
  enableGlobalTextDefaults?: boolean;
}) {
  const system = useColorScheme(); // 'light' | 'dark' | null
  const scheme: "light" | "dark" = forceScheme ?? (system ?? "light");

  const colors = scheme === "dark" ? dark : light;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: { flex: 1, backgroundColor: colors.background },
        text: { color: colors.foreground },

        // UI 패턴들
        card: {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: radii.lg,
          padding: 16,
        },
        divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },

        button: {
          backgroundColor: colors.primary,
          borderRadius: radii.md,
          paddingVertical: 10,
          paddingHorizontal: 14,
        },
        buttonText: { color: colors.primaryForeground, fontWeight: "600" },

        input: {
          borderColor: colors.input,
          borderWidth: 1,
          borderRadius: radii.md,
          padding: 12,
          color: colors.foreground,
        },

        sidebar: {
          backgroundColor: colors.sidebar,
          borderRightWidth: 1,
          borderRightColor: colors.sidebarBorder,
        },

        // “ring” 유사 효과 (focus 시)
        focusRing: { borderColor: colors.ring, borderWidth: 2 },
      }),
    [scheme]
  );

  // (선택) Text/TextInput 전역 기본 스타일
  if (enableGlobalTextDefaults) {
    // RN 경고를 피하려면 조건부로만 덮어쓰기
    (Text as any).defaultProps ??= {};
    (Text as any).defaultProps.style = [
      (Text as any).defaultProps.style,
      { color: colors.foreground },
    ];

    (TextInput as any).defaultProps ??= {};
    (TextInput as any).defaultProps.placeholderTextColor ??= "#9e9e9e";
    (TextInput as any).defaultProps.style = [
      (TextInput as any).defaultProps.style,
      { color: colors.foreground },
    ];
  }

  return (
    <ThemeContext.Provider value={{ scheme, colors, radii, styles }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("Wrap your app with <ThemeProvider />");
  return ctx;
};
