import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { createContext, type PropsWithChildren, useContext, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { drawerTools } from "@/lib/navigation/product-navigation";
import { type Palette, motion, shapes, spacing } from "@/lib/ui/theme";
import { useSakinahTheme } from "@/lib/ui/theme-provider";

type NavigationDrawerApi = { openDrawer: () => void; closeDrawer: () => void };
const NavigationDrawerContext = createContext<NavigationDrawerApi | null>(null);

export function AppNavigationDrawer({ children }: PropsWithChildren) {
  const [visible, setVisible] = useState(false);
  const { palette } = useSakinahTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const api = useMemo(() => ({ openDrawer: () => setVisible(true), closeDrawer: () => setVisible(false) }), []);
  return <NavigationDrawerContext.Provider value={api}>{children}<Modal animationType="fade" onRequestClose={api.closeDrawer} transparent visible={visible}><View style={styles.overlay}><Pressable accessibilityLabel="إغلاق قائمة المزيد" accessibilityRole="button" onPress={api.closeDrawer} style={styles.backdrop} /><SafeAreaView edges={["top", "bottom"]} style={styles.panel}><View style={styles.handle} /><View style={styles.heading}><Pressable accessibilityLabel="إغلاق قائمة المزيد" accessibilityRole="button" onPress={api.closeDrawer} style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}><MaterialIcons color={palette.primary} name="close" size={22} /></Pressable><View style={styles.headingCopy}><Text style={styles.eyebrow}>دليل المسلم</Text><Text style={styles.title}>المزيد</Text></View></View><ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>{drawerTools.map((item) => <Pressable accessibilityHint={item.subtitle} accessibilityLabel={item.title} accessibilityRole="button" key={item.href} onPress={() => { api.closeDrawer(); router.push(item.href as never); }} style={({ pressed }) => [styles.row, pressed && styles.pressed]}><View style={styles.icon}><MaterialIcons color={palette.primary} name={item.icon} size={22} /></View><View style={styles.copy}><Text style={styles.rowTitle}>{item.title}</Text><Text style={styles.rowSubtitle}>{item.subtitle}</Text></View><MaterialIcons color={palette.muted} name="chevron-left" size={22} /></Pressable>)}</ScrollView></SafeAreaView></View></Modal></NavigationDrawerContext.Provider>;
}

export function useNavigationDrawer(): NavigationDrawerApi {
  const value = useContext(NavigationDrawerContext);
  if (!value) throw new Error("useNavigationDrawer must be used inside AppNavigationDrawer");
  return value;
}

function createStyles(palette: Palette) {
  return StyleSheet.create({
    overlay: { backgroundColor: "#00000066", flex: 1, justifyContent: "flex-end" },
    backdrop: { ...StyleSheet.absoluteFillObject },
    panel: { backgroundColor: palette.background, borderTopLeftRadius: shapes.large, borderTopRightRadius: shapes.large, maxHeight: "82%", minHeight: 420, paddingHorizontal: spacing.lg },
    handle: { alignSelf: "center", backgroundColor: palette.outlineVariant, borderRadius: shapes.full, height: 4, marginTop: spacing.sm, width: 40 },
    heading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingBottom: spacing.md, paddingTop: spacing.lg },
    headingCopy: { alignItems: "flex-end", flex: 1, marginLeft: spacing.sm },
    eyebrow: { color: palette.gold, fontSize: 12, fontWeight: "800", textAlign: "right" },
    title: { color: palette.ink, fontSize: 24, fontWeight: "900", textAlign: "right" },
    closeButton: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.full, height: 48, justifyContent: "center", width: 48 },
    list: { gap: spacing.xs, paddingBottom: spacing.xl },
    row: { alignItems: "center", backgroundColor: palette.surfaceRaised, borderRadius: shapes.medium, flexDirection: "row", minHeight: 72, padding: spacing.sm },
    icon: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.medium, height: 48, justifyContent: "center", width: 48 },
    copy: { alignItems: "flex-end", flex: 1, marginHorizontal: spacing.sm },
    rowTitle: { color: palette.ink, fontSize: 16, fontWeight: "800", textAlign: "right" },
    rowSubtitle: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 2, textAlign: "right" },
    pressed: { opacity: motion.pressOpacity, transform: [{ scale: motion.pressScale }] },
  });
}
