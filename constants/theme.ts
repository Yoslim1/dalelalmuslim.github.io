export type ColorScheme = "light" | "dark";

export type ThemeColorPalette = {
  primary: string;
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  tint: string;
  text: string;
};

export const SchemeColors: Record<ColorScheme, ThemeColorPalette> = {
  light: {
    primary: "#125B50",
    background: "#F7FAF8",
    surface: "#FFFFFF",
    foreground: "#173B34",
    muted: "#657A74",
    border: "#DCE8E3",
    success: "#2D8A62",
    warning: "#C79A3B",
    error: "#B54242",
    tint: "#125B50",
    text: "#173B34",
  },
  dark: {
    primary: "#55B9A8",
    background: "#0E1816",
    surface: "#152421",
    foreground: "#E7F4F0",
    muted: "#A9BBB6",
    border: "#2B413C",
    success: "#66C49A",
    warning: "#E7BD65",
    error: "#F08B8B",
    tint: "#55B9A8",
    text: "#E7F4F0",
  },
};

export const Colors = SchemeColors;
export const ThemeColors = SchemeColors;
export const Fonts = { regular: undefined, medium: undefined, bold: undefined };
