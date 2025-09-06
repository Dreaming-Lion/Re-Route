// theme/tokens.ts
export type Palette = {
  background: string; foreground: string;
  card: string; cardForeground: string;
  popover: string; popoverForeground: string;
  primary: string; primaryForeground: string;
  secondary: string; secondaryForeground: string;
  muted: string; mutedForeground: string;
  accent: string; accentForeground: string;
  destructive: string; destructiveForeground: string;
  border: string; input: string; ring: string;
  chart1: string; chart2: string; chart3: string; chart4: string; chart5: string;
  sidebar: string; sidebarForeground: string;
  sidebarPrimary: string; sidebarPrimaryForeground: string;
  sidebarAccent: string; sidebarAccentForeground: string;
  sidebarBorder: string; sidebarRing: string;
};

export const radii = { sm: 6, md: 8, lg: 10, xl: 14 }; // --radius 기반 환산

export const light: Palette = {
  background: "#ffffff", foreground: "#0a0a0a",
  card: "#ffffff", cardForeground: "#0a0a0a",
  popover: "#ffffff", popoverForeground: "#0a0a0a",
  primary: "#2b2b2b", primaryForeground: "#fbfbfb",
  secondary: "#f7f7f7", secondaryForeground: "#2b2b2b",
  muted: "#f7f7f7", mutedForeground: "#8e8e8e",
  accent: "#f7f7f7", accentForeground: "#2b2b2b",
  destructive: "#b34a3a", destructiveForeground: "#b34a3a",
  border: "#ececec", input: "#ececec", ring: "#b3b3b3",
  chart1: "#9766e0", chart2: "#4aa2cc", chart3: "#4b5bb3", chart4: "#dfe56d", chart5: "#c7d85f",
  sidebar: "#fbfbfb", sidebarForeground: "#0a0a0a",
  sidebarPrimary: "#2b2b2b", sidebarPrimaryForeground: "#fbfbfb",
  sidebarAccent: "#f7f7f7", sidebarAccentForeground: "#2b2b2b",
  sidebarBorder: "#ececec", sidebarRing: "#b3b3b3",
};

export const dark: Palette = {
  background: "#0a0a0a", foreground: "#fbfbfb",
  card: "#0a0a0a", cardForeground: "#fbfbfb",
  popover: "#0a0a0a", popoverForeground: "#fbfbfb",
  primary: "#fbfbfb", primaryForeground: "#2b2b2b",
  secondary: "#444444", secondaryForeground: "#fbfbfb",
  muted: "#444444", mutedForeground: "#707070",
  accent: "#444444", accentForeground: "#fbfbfb",
  destructive: "#6a3c2f", destructiveForeground: "#a34b3e",
  border: "#444444", input: "#444444", ring: "#707070",
  chart1: "#5d7fe0", chart2: "#87d7b0", chart3: "#c2d44a", chart4: "#a06ae6", chart5: "#b38f3a",
  sidebar: "#222222", sidebarForeground: "#fbfbfb",
  sidebarPrimary: "#5d7fe0", sidebarPrimaryForeground: "#fbfbfb",
  sidebarAccent: "#444444", sidebarAccentForeground: "#fbfbfb",
  sidebarBorder: "#444444", sidebarRing: "#707070",
};
