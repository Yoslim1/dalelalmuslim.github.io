import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppStateProvider } from "@/lib/state/app-state";
import { QuranAudioProvider } from "@/lib/audio/player";
export default function RootLayout() {
  return <AppStateProvider><QuranAudioProvider><AppShell /></QuranAudioProvider></AppStateProvider>;
}

function AppShell() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return <><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, animation: "fade" }}><Stack.Screen name="(tabs)" /><Stack.Screen name="audio-library" /><Stack.Screen name="azkar/[slug]" /><Stack.Screen name="duas/[slug]" /><Stack.Screen name="quran/[number]" /><Stack.Screen name="masbaha" /><Stack.Screen name="tasks" /><Stack.Screen name="stats" /><Stack.Screen name="stories" /><Stack.Screen name="settings" /></Stack></>;
}
