import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppScreen, BackHeader, Metric, Surface } from "@/components/dalil-ui";
import { useAppState } from "@/lib/state/app-state";
import { type Palette, shapes, spacing } from "@/lib/ui/theme";
import { useSakinahTheme } from "@/lib/ui/theme-provider";

export default function StatsScreen() {
  const { state } = useAppState();
  const { palette } = useSakinahTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const doneTasks = state.tasks.filter((task) => task.completed).length;
  const azkarCount = state.daily.completedAzkarIds.length;
  const taskPercent = Math.round((doneTasks / Math.max(state.tasks.length, 1)) * 100);
  return <AppScreen><BackHeader subtitle="ملخص من بياناتك المحفوظة محليًا" title="تقدمك اليوم" /><View style={styles.content}><Surface tone="tonal" style={styles.intro}><View style={styles.introCopy}><Text style={styles.introTitle}>التقدم ليس سباقًا</Text><Text style={styles.introText}>كل ما يظهر هنا محفوظ على جهازك لمساعدتك على الاستمرار بلطف.</Text></View><View style={styles.introIcon}><MaterialIcons color={palette.primary} name="insights" size={24} /></View></Surface><View style={styles.metrics}><Metric label="تسبيح" value={String(state.daily.tasbeehCount)} /><Metric accent="gold" label="أذكار" value={String(azkarCount)} /><Metric label="مهام" value={`${doneTasks}/${state.tasks.length}`} /></View><Surface style={styles.card}><Text style={styles.title}>ورد المهام</Text><View style={styles.progressTrack}><View style={[styles.progressValue, { width: `${taskPercent}%` }]} /></View><Text style={styles.body}>{taskPercent === 100 ? "أحسنت، أتممت ما خططت له اليوم." : `أنجزت ${taskPercent}% من ورد المهام. اختر خطوة صغيرة مناسبة لتكملها.`}</Text></Surface><Surface style={styles.privacy}><MaterialIcons color={palette.success} name="verified-user" size={21} /><Text style={styles.privacyText}>لا تُرسل هذه الإحصاءات إلى خادم أو حساب؛ هي خاصة بجهازك.</Text></Surface></View></AppScreen>;
}

function createStyles(palette: Palette) {
  return StyleSheet.create({
  content: { gap: spacing.md, padding: spacing.lg },
  intro: { alignItems: "center", flexDirection: "row", padding: spacing.md },
  introCopy: { alignItems: "flex-end", flex: 1, marginLeft: spacing.sm },
  introTitle: { color: palette.ink, fontSize: 16, fontWeight: "800", textAlign: "right" },
  introText: { color: palette.muted, fontSize: 12, lineHeight: 19, marginTop: 3, textAlign: "right" },
  introIcon: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.medium, height: 50, justifyContent: "center", width: 50 },
  metrics: { flexDirection: "row", gap: spacing.xs },
  card: { padding: spacing.lg },
  title: { color: palette.ink, fontSize: 17, fontWeight: "800", textAlign: "right" },
  progressTrack: { backgroundColor: palette.primarySoft, borderRadius: shapes.full, height: 8, marginTop: spacing.md, overflow: "hidden" },
  progressValue: { backgroundColor: palette.primary, borderRadius: shapes.full, height: "100%" },
  body: { color: palette.muted, fontSize: 14, lineHeight: 23, marginTop: spacing.md, textAlign: "right" },
  privacy: { alignItems: "center", backgroundColor: palette.surfaceContainerLow, flexDirection: "row", gap: spacing.sm, padding: spacing.md },
  privacyText: { color: palette.muted, flex: 1, fontSize: 12, lineHeight: 19, textAlign: "right" },
  });
}
