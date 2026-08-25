import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppStateProvider } from "@/lib/state/app-state";
import { QuranAudioProvider } from "@/lib/audio/player";
import { ReciterLibraryProvider } from "@/lib/audio/reciter-library";
import { SakinahThemeProvider, useSakinahTheme } from "@/lib/ui/theme-provider";
export default function RootLayout() {
  return <AppStateProvider><SakinahThemeProvider><ReciterLibraryProvider><QuranAudioProvider><AppShell /></QuranAudioProvider></ReciterLibraryProvider></SakinahThemeProvider></AppStateProvider>;
}

function AppShell() {
  const { resolvedTheme } = useSakinahTheme();
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return <><StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} /><Stack screenOptions={{ headerShown: false, animation: "fade" }}><Stack.Screen name="(tabs)" /><Stack.Screen name="audio-library" /><Stack.Screen name="azkar/[slug]" /><Stack.Screen name="duas/[slug]" /><Stack.Screen name="quran/[number]" /><Stack.Screen name="masbaha" /><Stack.Screen name="tasks" /><Stack.Screen name="stats" /><Stack.Screen name="stories" /><Stack.Screen name="settings" /></Stack></>;
}
