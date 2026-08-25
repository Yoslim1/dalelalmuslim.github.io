import { createContext, type PropsWithChildren, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";

import { useAppState } from "@/lib/state/app-state";
import { getPalette, resolveThemePreference, type Palette, type ResolvedTheme } from "@/lib/ui/theme";

type SakinahTheme = {
  palette: Palette;
  preference: "system" | "light" | "dark";
  resolvedTheme: ResolvedTheme;
};

const SakinahThemeContext = createContext<SakinahTheme | null>(null);

export function SakinahThemeProvider({ children }: PropsWithChildren) {
  const { state } = useAppState();
  const systemTheme = useColorScheme();
  const resolvedTheme: ResolvedTheme = resolveThemePreference(state.settings.theme, systemTheme);
  const value = useMemo(() => ({
    palette: getPalette(resolvedTheme),
    preference: state.settings.theme,
    resolvedTheme,
  }), [resolvedTheme, state.settings.theme]);
  return <SakinahThemeContext.Provider value={value}>{children}</SakinahThemeContext.Provider>;
}

export function useSakinahTheme(): SakinahTheme {
  const context = useContext(SakinahThemeContext);
  if (!context) throw new Error("useSakinahTheme must be used inside SakinahThemeProvider");
  return context;
}
