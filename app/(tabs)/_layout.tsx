import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { primaryTabs } from "@/lib/navigation/product-navigation";
import { shapes, spacing } from "@/lib/ui/theme";
import { useSakinahTheme } from "@/lib/ui/theme-provider";

export default function TabLayout() {
  const { palette } = useSakinahTheme();
  const insets = useSafeAreaInsets();
  const bottom = Platform.OS === "web" ? spacing.sm : Math.max(insets.bottom, spacing.xs);
  return (
    <Tabs screenOptions={({ route }) => {
      const tab = primaryTabs.find((item) => item.route === route.name);
      return {
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.muted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "800", marginTop: 2 },
        tabBarItemStyle: { borderRadius: shapes.medium, marginHorizontal: 2, minHeight: 48 },
        tabBarStyle: { backgroundColor: palette.surfaceRaised, borderTopColor: palette.outlineVariant, height: 64 + bottom, paddingBottom: bottom, paddingHorizontal: spacing.xs, paddingTop: spacing.xs },
        tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name={tab?.icon ?? "home"} size={size} />,
      };
    }}>
      <Tabs.Screen name="quran" options={{ title: "القرآن" }} />
      <Tabs.Screen name="duas" options={{ title: "الأدعية" }} />
      <Tabs.Screen name="azkar" options={{ title: "الأذكار" }} />
      <Tabs.Screen name="more" options={{ href: null }} />
      <Tabs.Screen name="index" options={{ title: "الرئيسية" }} />
    </Tabs>
  );
}
