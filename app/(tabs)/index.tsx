import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen, IconButton, Metric, ScreenTitle, Surface } from "@/components/dalil-ui";
import { useNavigationDrawer } from "@/components/navigation/app-navigation-drawer";
import { getDailyAyah, getDailyMessage } from "@/lib/content/daily";
import { homeTools } from "@/lib/navigation/product-navigation";
import { useAppState } from "@/lib/state/app-state";
import { motion, type Palette, shapes, spacing, typography } from "@/lib/ui/theme";
import { useSakinahTheme } from "@/lib/ui/theme-provider";

export default function HomeScreen() {
  const { state, hydrated } = useAppState();
  const { palette } = useSakinahTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const { openDrawer } = useNavigationDrawer();
  const ayah = getDailyAyah();
  const completedTasks = state.tasks.filter((task) => task.completed).length;
  const taskProgress = Math.round((completedTasks / Math.max(state.tasks.length, 1)) * 100);

  return (
    <AppScreen>
      <FlatList
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.content}
        data={homeTools}
        keyExtractor={(item) => item.title}
        ListFooterComponent={<Text style={styles.offlineNote}>محتواك وتقدمك محفوظان على جهازك</Text>}
        ListHeaderComponent={(
          <View style={styles.header}>
            <View style={styles.topLine}>
              <IconButton icon="menu" label="المزيد والإعدادات" onPress={openDrawer} />
              <View style={styles.greetingBlock}>
                <Text style={styles.greeting}>السلام عليك</Text>
                <Text style={styles.subGreeting}>{hydrated ? "رفيقك الهادئ لورد اليوم" : "جارٍ استعادة تقدمك المحلي…"}</Text>
              </View>
            </View>

            {state.quranBookmark ? (
              <Pressable accessibilityLabel="تابع قراءتك من موضع الحفظ" accessibilityRole="button" onPress={() => router.push(`/quran/${state.quranBookmark?.surah}` as never)} style={({ pressed }) => [styles.resumePressable, pressed && styles.pressed]}>
                <Surface tone="tonal" style={styles.resume}>
                  <View style={styles.resumeIcon}><MaterialIcons color={palette.primary} name="bookmark" size={22} /></View>
                  <View style={styles.resumeCopy}>
                    <Text style={styles.resumeEyebrow}>استئناف القراءة</Text>
                    <Text style={styles.resumeTitle}>السورة {state.quranBookmark.surah} · الآية {state.quranBookmark.ayah}</Text>
                  </View>
                  <MaterialIcons color={palette.muted} name="chevron-left" size={24} />
                </Surface>
              </Pressable>
            ) : (
              <Pressable accessibilityLabel="افتح القرآن الكريم" accessibilityRole="button" onPress={() => router.push("/(tabs)/quran")} style={({ pressed }) => [styles.resumePressable, pressed && styles.pressed]}>
                <Surface tone="tonal" style={styles.resume}>
                  <View style={styles.resumeIcon}><MaterialIcons color={palette.primary} name="menu-book" size={22} /></View>
                  <View style={styles.resumeCopy}>
                    <Text style={styles.resumeEyebrow}>وردك الآن</Text>
                    <Text style={styles.resumeTitle}>افتح القرآن وابدأ من حيث تحب</Text>
                  </View>
                  <MaterialIcons color={palette.muted} name="chevron-left" size={24} />
                </Surface>
              </Pressable>
            )}

            <Surface style={styles.ayahCard}>
              <View style={styles.ayahHeading}><View style={styles.ayahMark}><MaterialIcons color={palette.gold} name="auto-awesome" size={18} /></View><Text style={styles.ayahLabel}>آية اليوم</Text></View>
              <Text style={styles.ayahText}>{ayah?.text ?? "اذكر الله يطمئن قلبك"}</Text>
              <Text style={styles.ayahMeta}>{ayah ? `${ayah.surah} · آية ${ayah.verseNumber}` : ""}</Text>
            </Surface>

            <View style={styles.metrics}>
              <Metric label="التزام" value={`${taskProgress}%`} />
              <Metric accent="gold" label="تسبيح" value={String(state.daily.tasbeehCount)} />
              <Metric label="مهام" value={`${completedTasks}/${state.tasks.length}`} />
            </View>

            <View style={styles.message}><Text style={styles.messageLabel}>رسالة اليوم</Text><Text style={styles.messageText}>{getDailyMessage()}</Text></View>
            <ScreenTitle eyebrow="أدواتك" title="ما تحتاجه اليوم" />
          </View>
        )}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable accessibilityHint={item.subtitle} accessibilityLabel={item.title} accessibilityRole="button" onPress={() => router.push(item.href as never)} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
            <View style={styles.actionIcon}><MaterialIcons color={palette.primary} name={item.icon} size={22} /></View>
            <View style={styles.actionCopy}><Text style={styles.actionTitle}>{item.title}</Text><Text style={styles.actionSubtitle}>{item.subtitle}</Text></View>
          </Pressable>
        )}
      />
    </AppScreen>
  );
}

function createStyles(palette: Palette) {
  return StyleSheet.create({
  content: { paddingBottom: spacing.xxl, paddingHorizontal: spacing.lg },
  header: { gap: spacing.md, paddingTop: spacing.sm },
  topLine: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  greetingBlock: { alignItems: "flex-end", flex: 1, marginLeft: spacing.md },
  greeting: { color: palette.ink, textAlign: "right", ...typography.headline },
  subGreeting: { color: palette.muted, fontSize: 14, lineHeight: 20, marginTop: 2, textAlign: "right" },
  resumePressable: { minHeight: 72 },
  resume: { alignItems: "center", flexDirection: "row", gap: spacing.sm, minHeight: 76, padding: spacing.sm },
  resumeIcon: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.medium, height: 48, justifyContent: "center", width: 48 },
  resumeCopy: { alignItems: "flex-end", flex: 1 },
  resumeEyebrow: { color: palette.gold, fontSize: 12, fontWeight: "800", textAlign: "right" },
  resumeTitle: { color: palette.ink, fontSize: 15, fontWeight: "800", lineHeight: 22, marginTop: 2, textAlign: "right" },
  ayahCard: { backgroundColor: palette.surfaceContainerLow, padding: spacing.lg },
  ayahHeading: { alignItems: "center", flexDirection: "row", justifyContent: "flex-end", gap: spacing.xs },
  ayahMark: { alignItems: "center", backgroundColor: palette.goldSoft, borderRadius: shapes.full, height: 32, justifyContent: "center", width: 32 },
  ayahLabel: { color: palette.gold, fontSize: 13, fontWeight: "800", textAlign: "right" },
  ayahText: { color: palette.ink, fontSize: 19, fontWeight: "700", lineHeight: 35, marginTop: spacing.sm, textAlign: "right" },
  ayahMeta: { color: palette.muted, fontSize: 12, marginTop: spacing.sm, textAlign: "right" },
  metrics: { flexDirection: "row", gap: spacing.xs },
  message: { borderRightColor: palette.gold, borderRightWidth: 3, paddingRight: spacing.sm },
  messageLabel: { color: palette.gold, fontSize: 12, fontWeight: "800", textAlign: "right" },
  messageText: { color: palette.ink, fontSize: 15, lineHeight: 25, marginTop: 3, textAlign: "right" },
  gridRow: { gap: spacing.sm },
  action: { alignItems: "center", backgroundColor: palette.surfaceRaised, borderRadius: shapes.medium, flex: 1, flexDirection: "row", gap: spacing.sm, marginBottom: spacing.sm, minHeight: 88, padding: spacing.sm },
  actionIcon: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.small, height: 44, justifyContent: "center", width: 44 },
  actionCopy: { alignItems: "flex-end", flex: 1 },
  actionTitle: { color: palette.ink, fontSize: 14, fontWeight: "800", textAlign: "right" },
  actionSubtitle: { color: palette.muted, fontSize: 11, lineHeight: 16, marginTop: 2, textAlign: "right" },
  offlineNote: { color: palette.muted, fontSize: 12, marginTop: spacing.sm, textAlign: "center" },
  pressed: { opacity: motion.pressOpacity, transform: [{ scale: motion.pressScale }] },
  });
}
