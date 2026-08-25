import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { AppButton, AppScreen, BackHeader, Surface } from "@/components/dalil-ui";
import { lightHaptic, successHaptic } from "@/lib/haptics";
import { useAppState } from "@/lib/state/app-state";
import { motion, type Palette, spacing } from "@/lib/ui/theme";
import { useSakinahTheme } from "@/lib/ui/theme-provider";

export default function MasbahaScreen() {
  const { state, incrementTasbeeh, resetTasbeeh } = useAppState();
  const { palette } = useSakinahTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const target = state.settings.tasbeehTarget;
  const complete = state.daily.tasbeehCount >= target;
  const handleCount = () => { incrementTasbeeh(); if (state.daily.tasbeehCount + 1 === target) successHaptic(state.settings.hapticsEnabled); else lightHaptic(state.settings.hapticsEnabled); };
  const confirmReset = () => Alert.alert("إعادة العداد", "هل تريد إعادة عداد اليوم إلى الصفر؟", [{ text: "إلغاء", style: "cancel" }, { text: "إعادة الضبط", style: "destructive", onPress: resetTasbeeh }]);
  return <AppScreen><BackHeader subtitle="يُحفظ العداد تلقائيًا على جهازك" title="المسبحة" /><View style={styles.content}><Surface tone="tonal" style={styles.intro}><Text style={styles.eyebrow}>الذكر الحالي</Text><Text style={styles.dhikr}>سُبْحَانَ اللَّهِ وَبِحَمْدِهِ</Text><Text style={styles.meta}>هدف اليوم: {target} تسبيحة</Text></Surface><Pressable accessibilityHint="يزيد العداد بمقدار واحد" accessibilityLabel={`عداد المسبحة، ${state.daily.tasbeehCount} من ${target}`} accessibilityRole="button" onPress={handleCount} style={({ pressed }) => [styles.counter, complete && styles.counterComplete, pressed && styles.pressed]}><Text style={[styles.count, complete && styles.countComplete]}>{state.daily.tasbeehCount}</Text><Text style={styles.counterLabel}>{complete ? "أحسنت، اكتمل هدفك" : `المتبقي ${Math.max(0, target - state.daily.tasbeehCount)}`}</Text><MaterialIcons color={complete ? palette.success : palette.primary} name={complete ? "check-circle" : "touch-app"} size={28} /></Pressable><View style={styles.actions}><AppButton icon="restart-alt" label="إعادة ضبط العداد" onPress={confirmReset} tone="soft" /></View><Text style={styles.hint}>اضغط داخل الدائرة للتسبيح</Text></View></AppScreen>;
}

function createStyles(palette: Palette) {
  return StyleSheet.create({
  content: { alignItems: "center", flex: 1, gap: spacing.lg, padding: spacing.lg },
  intro: { alignSelf: "stretch", padding: spacing.lg },
  eyebrow: { color: palette.gold, fontSize: 12, fontWeight: "800", textAlign: "right" },
  dhikr: { color: palette.ink, fontSize: 22, fontWeight: "800", lineHeight: 38, marginTop: spacing.xs, textAlign: "right" },
  meta: { color: palette.muted, fontSize: 13, marginTop: spacing.xs, textAlign: "right" },
  counter: { alignItems: "center", backgroundColor: palette.primarySoft, borderColor: palette.primary, borderRadius: 160, borderWidth: 6, height: 276, justifyContent: "center", width: 276 },
  counterComplete: { backgroundColor: palette.primarySoft, borderColor: palette.success },
  count: { color: palette.primary, fontSize: 72, fontWeight: "900" },
  countComplete: { color: palette.success },
  counterLabel: { color: palette.muted, fontSize: 14, fontWeight: "800", marginVertical: spacing.xs },
  actions: { alignSelf: "stretch" },
  hint: { color: palette.muted, fontSize: 12 },
  pressed: { opacity: motion.pressOpacity, transform: [{ scale: motion.pressScale }] },
  });
}
