import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

import { AppButton, AppScreen, BackHeader, Surface } from "@/components/dalil-ui";
import { useAppState } from "@/lib/state/app-state";
import { type Palette, shapes, spacing } from "@/lib/ui/theme";
import { useSakinahTheme } from "@/lib/ui/theme-provider";

const themeOptions = [
  { id: "system", label: "تلقائي", icon: "brightness-auto" },
  { id: "light", label: "فاتح", icon: "light-mode" },
  { id: "dark", label: "داكن", icon: "dark-mode" },
] as const;

export default function SettingsScreen() {
  const { state, resetAllProgress, updateSettings } = useAppState();
  const { palette, resolvedTheme } = useSakinahTheme();
  const styles = createStyles(palette);
  const confirmReset = () => Alert.alert("مسح التقدم المحلي", "سيُحذف التقدم والمهام والمفضلة من هذا الجهاز فقط. لا يمكن التراجع عن هذا الإجراء.", [{ text: "إلغاء", style: "cancel" }, { text: "مسح التقدم", style: "destructive", onPress: resetAllProgress }]);
  const selectedAudio = state.audio.selectedReciterId ? "قارئ مختار للتنزيلات" : "لم يُختر قارئ بعد";
  return <AppScreen><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><BackHeader subtitle="اختياراتك محفوظة على جهازك فقط" title="الإعدادات" /><SectionLabel label="المظهر" /><Surface style={styles.section}><Text style={styles.rowTitle}>سمة التطبيق</Text><Text style={styles.rowSubtitle}>المعروض الآن: {resolvedTheme === "dark" ? "داكن" : "فاتح"}</Text><View style={styles.themeOptions}>{themeOptions.map((option) => { const active = state.settings.theme === option.id; return <Pressable accessibilityLabel={`اختيار السمة ${option.label}`} accessibilityRole="radio" accessibilityState={{ selected: active }} key={option.id} onPress={() => updateSettings({ theme: option.id })} style={({ pressed }) => [styles.themeOption, active && styles.themeOptionActive, pressed && styles.pressed]}><MaterialIcons color={active ? palette.onPrimary : palette.primary} name={option.icon} size={18} /><Text style={[styles.themeLabel, active && styles.themeLabelActive]}>{option.label}</Text></Pressable>; })}</View></Surface><SectionLabel label="القراءة والذكر" /><Surface style={styles.section}><View style={styles.row}><View style={styles.rowCopy}><Text style={styles.rowTitle}>حجم نص القرآن</Text><Text style={styles.rowSubtitle}>مريح للقراءة دون اتصال</Text></View><View style={styles.stepper}><Pressable accessibilityLabel="تصغير نص القرآن" accessibilityRole="button" disabled={state.settings.quranTextSize <= 20} onPress={() => updateSettings({ quranTextSize: Math.max(20, state.settings.quranTextSize - 2) })} style={({ pressed }) => [styles.stepButton, state.settings.quranTextSize <= 20 && styles.disabled, pressed && styles.pressed]}><MaterialIcons color={palette.primary} name="remove" size={20} /></Pressable><Text style={styles.stepValue}>{state.settings.quranTextSize}</Text><Pressable accessibilityLabel="تكبير نص القرآن" accessibilityRole="button" disabled={state.settings.quranTextSize >= 30} onPress={() => updateSettings({ quranTextSize: Math.min(30, state.settings.quranTextSize + 2) })} style={({ pressed }) => [styles.stepButton, state.settings.quranTextSize >= 30 && styles.disabled, pressed && styles.pressed]}><MaterialIcons color={palette.primary} name="add" size={20} /></Pressable></View></View><View style={styles.divider} /><View style={styles.row}><View style={styles.rowCopy}><Text style={styles.rowTitle}>هدف التسبيح اليومي</Text><Text style={styles.rowSubtitle}>يمكنك تعديله بتدرج 25 تسبيحة</Text></View><View style={styles.stepper}><Pressable accessibilityLabel="خفض هدف التسبيح" accessibilityRole="button" disabled={state.settings.tasbeehTarget <= 25} onPress={() => updateSettings({ tasbeehTarget: Math.max(25, state.settings.tasbeehTarget - 25) })} style={({ pressed }) => [styles.stepButton, state.settings.tasbeehTarget <= 25 && styles.disabled, pressed && styles.pressed]}><MaterialIcons color={palette.primary} name="remove" size={20} /></Pressable><Text style={styles.stepValue}>{state.settings.tasbeehTarget}</Text><Pressable accessibilityLabel="رفع هدف التسبيح" accessibilityRole="button" onPress={() => updateSettings({ tasbeehTarget: state.settings.tasbeehTarget + 25 })} style={({ pressed }) => [styles.stepButton, pressed && styles.pressed]}><MaterialIcons color={palette.primary} name="add" size={20} /></Pressable></View></View><View style={styles.divider} /><View style={styles.row}><View style={styles.rowCopy}><Text style={styles.rowTitle}>الاهتزازات اللمسية</Text><Text style={styles.rowSubtitle}>تفاعل لطيف للمسبحة والإتمام</Text></View><Switch accessibilityLabel="تفعيل الاهتزازات اللمسية" onValueChange={(hapticsEnabled) => updateSettings({ hapticsEnabled })} thumbColor={palette.onPrimary} trackColor={{ false: palette.outlineVariant, true: palette.primary }} value={state.settings.hapticsEnabled} /></View></Surface><SectionLabel label="الصوت والتنزيلات" /><Pressable accessibilityLabel="فتح مكتبة التلاوات" accessibilityRole="button" onPress={() => router.push("/audio-library")} style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}><Surface style={styles.audioRow}><View style={styles.audioCopy}><Text style={styles.rowTitle}>مكتبة التلاوات</Text><Text style={styles.rowSubtitle}>{selectedAudio} · تنزيل اختياري</Text></View><View style={styles.actionIcon}><MaterialIcons color={palette.primary} name="library-music" size={22} /></View></Surface></Pressable><SectionLabel label="البيانات والخصوصية" /><Surface tone="tonal" style={styles.privacy}><MaterialIcons color={palette.success} name="verified-user" size={21} /><Text style={styles.privacyText}>لا نحتاج حسابًا ولا خادمًا لهذه الإعدادات أو تقدمك اليومي.</Text></Surface><AppButton icon="delete-outline" label="مسح التقدم المحلي" onPress={confirmReset} tone="danger" accessibilityHint="إجراء نهائي يحذف بياناتك المحفوظة على هذا الجهاز" /></ScrollView></AppScreen>;
}

function SectionLabel({ label }: { label: string }) {
  const { palette } = useSakinahTheme();
  return <Text style={{ color: palette.muted, fontSize: 12, fontWeight: "800", textAlign: "right" }}>{label}</Text>;
}

function createStyles(palette: Palette) {
  return StyleSheet.create({
    content: { gap: spacing.sm, paddingBottom: spacing.xxl, paddingHorizontal: spacing.lg },
    section: { padding: spacing.md },
    row: { alignItems: "center", flexDirection: "row", minHeight: 56 },
    rowCopy: { alignItems: "flex-end", flex: 1, marginLeft: spacing.sm },
    rowTitle: { color: palette.ink, fontSize: 15, fontWeight: "800", textAlign: "right" },
    rowSubtitle: { color: palette.muted, fontSize: 12, lineHeight: 19, marginTop: 3, textAlign: "right" },
    themeOptions: { flexDirection: "row", gap: spacing.xs, marginTop: spacing.md },
    themeOption: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.full, flex: 1, flexDirection: "row", gap: 4, justifyContent: "center", minHeight: 48, paddingHorizontal: spacing.xs },
    themeOptionActive: { backgroundColor: palette.primary },
    themeLabel: { color: palette.primary, fontSize: 12, fontWeight: "800" },
    themeLabelActive: { color: palette.onPrimary },
    divider: { backgroundColor: palette.outlineVariant, height: StyleSheet.hairlineWidth, marginVertical: spacing.xs },
    stepper: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
    stepButton: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.full, height: 48, justifyContent: "center", width: 48 },
    stepValue: { color: palette.primary, fontSize: 15, fontWeight: "900", minWidth: 32, textAlign: "center" },
    disabled: { opacity: 0.4 },
    pressable: { borderRadius: shapes.large },
    audioRow: { alignItems: "center", flexDirection: "row", minHeight: 78, padding: spacing.md },
    audioCopy: { alignItems: "flex-end", flex: 1, marginLeft: spacing.sm },
    actionIcon: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.medium, height: 48, justifyContent: "center", width: 48 },
    privacy: { alignItems: "center", flexDirection: "row", gap: spacing.sm, padding: spacing.md },
    privacyText: { color: palette.muted, flex: 1, fontSize: 12, lineHeight: 19, textAlign: "right" },
    pressed: { opacity: 0.76, transform: [{ scale: 0.98 }] },
  });
}
