import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { palette } from "@/lib/ui/theme";

const icons = { index: "home", azkar: "wb-sunny", duas: "auto-stories", quran: "menu-book", more: "more-horiz" } as const;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottom = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);
  return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: palette.primary, tabBarInactiveTintColor: palette.muted, tabBarLabelStyle: { fontSize: 11, fontWeight: "800" }, tabBarStyle: { backgroundColor: palette.surface, borderTopColor: palette.border, height: 58 + bottom, paddingBottom: bottom, paddingTop: 7 }, tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name={icons[route.name as keyof typeof icons]} size={size} /> })}><Tabs.Screen name="index" options={{ title: "الرئيسية" }} /><Tabs.Screen name="azkar" options={{ title: "الأذكار" }} /><Tabs.Screen name="duas" options={{ title: "الأدعية" }} /><Tabs.Screen name="quran" options={{ title: "القرآن" }} /><Tabs.Screen name="more" options={{ title: "المزيد" }} /></Tabs>;
}
