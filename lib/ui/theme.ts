export type ResolvedTheme = "light" | "dark";

export type Palette = {
  background: string;
  surface: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceRaised: string;
  ink: string;
  muted: string;
  primary: string;
  onPrimary: string;
  primarySoft: string;
  primaryContainer: string;
  gold: string;
  goldSoft: string;
  danger: string;
  dangerSoft: string;
  success: string;
  border: string;
  outlineVariant: string;
  shadow: string;
};

const light: Palette = {
  background: "#F8FAF8",
  surface: "#F8FAF8",
  surfaceContainerLow: "#F2F7F4",
  surfaceContainer: "#EEF5F1",
  surfaceRaised: "#FFFFFF",
  ink: "#132C25",
  muted: "#5A7068",
  primary: "#176B5B",
  onPrimary: "#FFFFFF",
  primarySoft: "#E1F3EC",
  primaryContainer: "#C7EBDD",
  gold: "#A97B25",
  goldSoft: "#FBF3DD",
  danger: "#B33E47",
  dangerSoft: "#FBE9EB",
  success: "#267A57",
  border: "#D8E3DD",
  outlineVariant: "#D8E3DD",
  shadow: "#113D341A",
};

const dark: Palette = {
  background: "#101614",
  surface: "#101614",
  surfaceContainerLow: "#141D19",
  surfaceContainer: "#18221E",
  surfaceRaised: "#202D27",
  ink: "#E7F2EC",
  muted: "#B5C9C0",
  primary: "#79D2BD",
  onPrimary: "#07372F",
  primarySoft: "#163D33",
  primaryContainer: "#285A4C",
  gold: "#E4BD67",
  goldSoft: "#403517",
  danger: "#FFB3B8",
  dangerSoft: "#5B2027",
  success: "#7ED7AE",
  border: "#3A4D45",
  outlineVariant: "#3A4D45",
  shadow: "#00000066",
};

export const colorSchemes = { light, dark } as const;

/**
 * توافق مؤقت للشاشات الحالية. تُمرر الشاشات المعاد بناؤها الألوان عبر ThemeProvider لاحقًا،
 * ولا ينبغي للمكونات الجديدة إضافة قيم لون حرة خارج هذه الرموز.
 */
export const palette = light;

export function getPalette(theme: ResolvedTheme): Palette {
  return colorSchemes[theme];
}

export function resolveThemePreference(preference: "system" | ResolvedTheme, systemTheme: ResolvedTheme | null | undefined): ResolvedTheme {
  return preference === "system" ? systemTheme === "dark" ? "dark" : "light" : preference;
}

export const spacing = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32 } as const;
export const shapes = { small: 12, medium: 16, large: 24, full: 999 } as const;
export const typography = {
  label: { fontSize: 13, lineHeight: 18, fontWeight: "700" as const },
  body: { fontSize: 16, lineHeight: 26, fontWeight: "400" as const },
  title: { fontSize: 21, lineHeight: 30, fontWeight: "800" as const },
  headline: { fontSize: 30, lineHeight: 40, fontWeight: "800" as const },
} as const;
export const motion = { pressScale: 0.98, pressOpacity: 0.76, shortMs: 80, standardMs: 220 } as const;
