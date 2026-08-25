import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen, ListChevron, ScreenTitle, Surface } from "@/components/dalil-ui";
import { palette } from "@/lib/ui/theme";

const entries = [
  { href: "/audio-library", icon: "headphones" as const, title: "مكتبة التلاوات", subtitle: "قراء وتنزيلاتك الاختيارية" },
  { href: "/masbaha", icon: "touch-app" as const, title: "المسبحة الذكية", subtitle: "عداد وتسبيح يومي" },
  { href: "/tasks", icon: "check-circle-outline" as const, title: "المهام اليومية", subtitle: "وردك وقائمة إنجازك" },
  { href: "/stats", icon: "insights" as const, title: "الإحصائيات", subtitle: "تقدمك المحفوظ محليًا" },
  { href: "/names", icon: "spa" as const, title: "أسماء الله الحسنى", subtitle: "معانٍ وتدبر" },
  { href: "/stories", icon: "menu-book" as const, title: "قصص وعبر", subtitle: "حكمة وموعظة" },
  { href: "/settings", icon: "settings" as const, title: "الإعدادات", subtitle: "المظهر والتخزين المحلي" },
];

export default function MoreScreen() {
  return <AppScreen><FlatList contentContainerStyle={styles.content} data={entries} keyExtractor={(item) => item.href} ListHeaderComponent={<ScreenTitle eyebrow="أدواتك" title="المزيد" />} renderItem={({ item }) => <Pressable onPress={() => router.push(item.href as never)} style={({ pressed }) => [pressed && styles.pressed]}><Surface style={styles.card}><ListChevron /><View style={styles.copy}><Text style={styles.title}>{item.title}</Text><Text style={styles.subtitle}>{item.subtitle}</Text></View><View style={styles.icon}><MaterialIcons color={palette.primary} name={item.icon} size={23} /></View></Surface></Pressable>} /></AppScreen>;
}

const styles = StyleSheet.create({ content: { gap: 12, padding: 20 }, card: { alignItems: "center", flexDirection: "row", padding: 16 }, copy: { alignItems: "flex-end", flex: 1, marginHorizontal: 12 }, title: { color: palette.ink, fontSize: 17, fontWeight: "800" }, subtitle: { color: palette.muted, fontSize: 13, marginTop: 3 }, icon: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: 16, height: 46, justifyContent: "center", width: 46 }, pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] } });
