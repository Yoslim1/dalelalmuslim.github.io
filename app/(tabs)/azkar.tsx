import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen, ListChevron, Metric, ScreenTitle, Surface } from "@/components/dalil-ui";
import { azkarCategories } from "@/lib/content";
import { useAppState } from "@/lib/state/app-state";
import { motion, palette, shapes, spacing } from "@/lib/ui/theme";

export default function AzkarScreen() {
  const { state } = useAppState();
  const completed = azkarCategories.reduce((total, category) => total + category.azkar.filter((dhikr) => state.daily.completedAzkarIds.includes(dhikr.id)).length, 0);
  const total = azkarCategories.reduce((sum, category) => sum + category.azkar.length, 0);
  return (
    <AppScreen>
      <FlatList
        contentContainerStyle={styles.content}
        data={azkarCategories}
        keyExtractor={(item) => item.slug}
        ListHeaderComponent={<View style={styles.header}><ScreenTitle eyebrow="وردك اليومي" title="الأذكار" /><Surface tone="tonal" style={styles.summary}><View style={styles.summaryCopy}><Text style={styles.summaryTitle}>اذكر الله في يومك بهدوء</Text><Text style={styles.summaryText}>اختر وردًا وأكمل منه ما تيسر لك.</Text></View><View style={styles.summaryMark}><MaterialIcons color={palette.gold} name="wb-sunny" size={24} /></View></Surface><View style={styles.metrics}><Metric label="مكتمل" value={`${completed}/${total}`} /><Metric accent="gold" label="الفئات" value={String(azkarCategories.length)} /></View><Text style={styles.listLabel}>الأوراد المتاحة</Text></View>}
        renderItem={({ item }) => {
          const done = item.azkar.filter((dhikr) => state.daily.completedAzkarIds.includes(dhikr.id)).length;
          const percent = item.azkar.length ? (done / item.azkar.length) * 100 : 0;
          return <Pressable accessibilityHint={`${done} من ${item.azkar.length} مكتمل`} accessibilityLabel={item.title} accessibilityRole="button" onPress={() => router.push(`/azkar/${item.slug}` as never)} style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}><Surface style={styles.card}><ListChevron /><View style={styles.copy}><Text style={styles.title}>{item.title}</Text><Text numberOfLines={1} style={styles.description}>{item.description}</Text><View style={styles.progressRow}><Text style={styles.progressLabel}>{done}/{item.azkar.length} مكتمل</Text><View style={styles.progressTrack}><View style={[styles.progressValue, { width: `${percent}%` }]} /></View></View></View><View style={styles.icon}><MaterialIcons color={palette.primary} name="wb-sunny" size={22} /></View></Surface></Pressable>;
        }}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm, paddingBottom: spacing.xxl, paddingHorizontal: spacing.lg },
  header: { gap: spacing.sm, paddingBottom: spacing.sm, paddingTop: spacing.sm },
  summary: { alignItems: "center", flexDirection: "row", minHeight: 86, padding: spacing.md },
  summaryCopy: { alignItems: "flex-end", flex: 1, marginLeft: spacing.sm },
  summaryTitle: { color: palette.ink, fontSize: 16, fontWeight: "800", textAlign: "right" },
  summaryText: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 3, textAlign: "right" },
  summaryMark: { alignItems: "center", backgroundColor: palette.goldSoft, borderRadius: shapes.medium, height: 50, justifyContent: "center", width: 50 },
  metrics: { flexDirection: "row", gap: spacing.xs },
  listLabel: { color: palette.muted, fontSize: 12, fontWeight: "800", marginTop: spacing.xs, textAlign: "right" },
  pressable: { minHeight: 92 },
  card: { alignItems: "center", flexDirection: "row", minHeight: 92, padding: spacing.sm },
  copy: { alignItems: "flex-end", flex: 1, marginHorizontal: spacing.sm },
  title: { color: palette.ink, fontSize: 16, fontWeight: "800", textAlign: "right" },
  description: { color: palette.muted, fontSize: 12, marginTop: 3, textAlign: "right" },
  progressRow: { alignItems: "center", flexDirection: "row", gap: spacing.xs, marginTop: spacing.sm, width: "100%" },
  progressLabel: { color: palette.success, fontSize: 11, fontWeight: "800", writingDirection: "rtl" },
  progressTrack: { backgroundColor: palette.primarySoft, borderRadius: shapes.full, flex: 1, height: 5, overflow: "hidden" },
  progressValue: { backgroundColor: palette.success, borderRadius: shapes.full, height: "100%" },
  icon: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.small, height: 44, justifyContent: "center", width: 44 },
  pressed: { opacity: motion.pressOpacity, transform: [{ scale: motion.pressScale }] },
});
