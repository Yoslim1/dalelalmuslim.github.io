import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen, BackHeader, Surface } from "@/components/dalil-ui";
import { azkarCategories } from "@/lib/content";
import { useAppState } from "@/lib/state/app-state";
import { motion, palette, shapes, spacing } from "@/lib/ui/theme";

export default function AzkarSessionScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const category = azkarCategories.find((item) => item.slug === slug) ?? azkarCategories[0];
  const { state, setAzkarRepeat } = useAppState();
  if (!category) return null;
  return <AppScreen><FlatList contentContainerStyle={styles.content} data={category.azkar} keyExtractor={(item) => item.id} ListHeaderComponent={<BackHeader subtitle={`${category.azkar.length} أذكار محفوظة محليًا`} title={category.title} />} renderItem={({ item }) => {
    const count = state.azkarRepeats[item.id] ?? 0;
    const complete = count >= item.repeatTarget;
    const ratio = item.repeatTarget ? Math.min(100, (count / item.repeatTarget) * 100) : 0;
    return <Surface style={styles.card}><Text style={styles.dhikr}>{item.text}</Text>{item.reference ? <Text style={styles.reference}>{item.reference}</Text> : null}<View style={styles.progressTrack}><View style={[styles.progressValue, complete && styles.progressComplete, { width: `${ratio}%` }]} /></View><View style={styles.controlRow}><Pressable accessibilityLabel="إنقاص العدد" accessibilityRole="button" disabled={count === 0} onPress={() => setAzkarRepeat(item.id, Math.max(0, count - 1), item.repeatTarget)} style={({ pressed }) => [styles.smallControl, count === 0 && styles.disabled, pressed && count > 0 && styles.pressed]}><MaterialIcons color={palette.primary} name="remove" size={22} /></Pressable><View accessibilityLabel={`التكرار ${count} من ${item.repeatTarget}`} style={[styles.countControl, complete && styles.countComplete]}><Text style={[styles.countText, complete && styles.countTextComplete]}>{count}/{item.repeatTarget}</Text><Text style={[styles.countLabel, complete && styles.countTextComplete]}>{complete ? "اكتمل الذكر" : "التكرار"}</Text></View><Pressable accessibilityLabel="زيادة العدد" accessibilityRole="button" onPress={() => setAzkarRepeat(item.id, count + 1, item.repeatTarget)} style={({ pressed }) => [styles.smallControl, pressed && styles.pressed]}><MaterialIcons color={palette.primary} name="add" size={22} /></Pressable></View></Surface>;
  }} /></AppScreen>;
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  card: { marginHorizontal: spacing.lg, padding: spacing.lg },
  dhikr: { color: palette.ink, fontSize: 20, fontWeight: "600", lineHeight: 38, textAlign: "right" },
  reference: { color: palette.muted, fontSize: 12, lineHeight: 19, marginTop: spacing.sm, textAlign: "right" },
  progressTrack: { backgroundColor: palette.primarySoft, borderRadius: shapes.full, height: 6, marginTop: spacing.md, overflow: "hidden" },
  progressValue: { backgroundColor: palette.primary, borderRadius: shapes.full, height: "100%" },
  progressComplete: { backgroundColor: palette.success },
  controlRow: { alignItems: "center", flexDirection: "row", justifyContent: "center", marginTop: spacing.md },
  smallControl: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.full, height: 48, justifyContent: "center", width: 48 },
  disabled: { opacity: 0.45 },
  countControl: { alignItems: "center", backgroundColor: palette.goldSoft, borderRadius: shapes.medium, justifyContent: "center", marginHorizontal: spacing.sm, minHeight: 52, minWidth: 112, paddingHorizontal: spacing.md },
  countComplete: { backgroundColor: "#E1F3EC" },
  countText: { color: palette.gold, fontSize: 16, fontWeight: "900" },
  countLabel: { color: palette.gold, fontSize: 10, fontWeight: "800", marginTop: 1 },
  countTextComplete: { color: palette.success },
  pressed: { opacity: motion.pressOpacity, transform: [{ scale: motion.pressScale }] },
});
