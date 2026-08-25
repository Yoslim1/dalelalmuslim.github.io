import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { type PropsWithChildren, type ReactNode, useMemo } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useSakinahTheme } from "@/lib/ui/theme-provider";
import { motion, type Palette, shapes, spacing, typography } from "@/lib/ui/theme";

export function AppScreen({ children }: PropsWithChildren) {
  return <ScreenContainer>{children}</ScreenContainer>;
}

export function BackHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { palette } = useSakinahTheme();
  const styles = useUiStyles();
  return <View style={styles.header}><View style={styles.headerCopy}><Text style={styles.headerTitle}>{title}</Text>{subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}</View><Pressable accessibilityLabel="الرجوع" accessibilityRole="button" onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}><MaterialIcons color={palette.primary} name="arrow-forward" size={22} /></Pressable></View>;
}

export function Surface({ children, style, tone = "raised" }: PropsWithChildren<{ style?: StyleProp<ViewStyle>; tone?: "raised" | "tonal" }>) {
  const styles = useUiStyles();
  return <View style={[styles.surface, tone === "tonal" && styles.surfaceTonal, style]}>{children}</View>;
}

export function ScreenTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  const styles = useUiStyles();
  return <View style={styles.titleRow}><View style={styles.titleCopy}>{eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}<Text style={styles.screenTitle}>{title}</Text></View>{action}</View>;
}

export function AppButton({ label, icon, onPress, tone = "primary", disabled = false, accessibilityHint }: { label: string; icon?: keyof typeof MaterialIcons.glyphMap; onPress: () => void; tone?: "primary" | "soft" | "danger"; disabled?: boolean; accessibilityHint?: string }) {
  const { palette } = useSakinahTheme();
  const styles = useUiStyles();
  const isPrimary = tone === "primary";
  const isDanger = tone === "danger";
  return <Pressable accessibilityHint={accessibilityHint} accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, isPrimary && styles.buttonPrimary, tone === "soft" && styles.buttonSoft, isDanger && styles.buttonDanger, disabled && styles.buttonDisabled, pressed && !disabled && styles.pressed]}>{icon ? <MaterialIcons color={isPrimary ? palette.onPrimary : isDanger ? palette.danger : palette.primary} name={icon} size={19} /> : null}<Text style={[styles.buttonText, isPrimary && styles.buttonTextPrimary, isDanger && styles.buttonTextDanger]}>{label}</Text></Pressable>;
}

export function IconButton({ icon, label, onPress }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; onPress: () => void }) {
  const { palette } = useSakinahTheme();
  const styles = useUiStyles();
  return <Pressable accessibilityLabel={label} accessibilityRole="button" hitSlop={6} onPress={onPress} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}><MaterialIcons color={palette.primary} name={icon} size={21} /></Pressable>;
}

export function Metric({ label, value, accent = "primary" }: { label: string; value: string; accent?: "primary" | "gold" }) {
  const styles = useUiStyles();
  return <View style={[styles.metric, accent === "gold" && styles.metricGold]}><Text style={[styles.metricValue, accent === "gold" && styles.metricValueGold]}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>;
}

export function ListChevron() {
  const { palette } = useSakinahTheme();
  return <MaterialIcons color={palette.muted} name="chevron-left" size={24} />;
}

function createStyles(palette: Palette) {
  return StyleSheet.create({
    header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingBottom: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
    headerCopy: { alignItems: "flex-end", flex: 1, marginLeft: spacing.sm },
    headerTitle: { color: palette.ink, textAlign: "right", ...typography.title },
    headerSubtitle: { color: palette.muted, fontSize: 13, lineHeight: 18, marginTop: 3, textAlign: "right" },
    backButton: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.medium, height: 48, justifyContent: "center", width: 48 },
    surface: { backgroundColor: palette.surfaceRaised, borderRadius: shapes.large, elevation: 0 },
    surfaceTonal: { backgroundColor: palette.surfaceContainer },
    titleRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm },
    titleCopy: { alignItems: "flex-end", flex: 1 },
    eyebrow: { color: palette.gold, fontSize: 12, fontWeight: "800", textAlign: "right" },
    screenTitle: { color: palette.ink, marginTop: 2, textAlign: "right", ...typography.title },
    button: { alignItems: "center", borderRadius: shapes.full, flexDirection: "row", gap: spacing.xs, justifyContent: "center", minHeight: 48, paddingHorizontal: spacing.lg },
    buttonPrimary: { backgroundColor: palette.primary },
    buttonSoft: { backgroundColor: palette.primarySoft },
    buttonDanger: { backgroundColor: palette.dangerSoft },
    buttonDisabled: { opacity: 0.5 },
    buttonText: { color: palette.primary, fontSize: 14, fontWeight: "800" },
    buttonTextPrimary: { color: palette.onPrimary },
    buttonTextDanger: { color: palette.danger },
    iconButton: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.full, height: 48, justifyContent: "center", width: 48 },
    metric: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.medium, flex: 1, minHeight: 76, justifyContent: "center", padding: spacing.xs },
    metricGold: { backgroundColor: palette.goldSoft },
    metricValue: { color: palette.primary, fontSize: 22, fontWeight: "900" },
    metricValueGold: { color: palette.gold },
    metricLabel: { color: palette.muted, fontSize: 11, fontWeight: "700", marginTop: 3, textAlign: "center" },
    pressed: { opacity: motion.pressOpacity, transform: [{ scale: motion.pressScale }] },
  });
}

function useUiStyles() {
  const { palette } = useSakinahTheme();
  return useMemo(() => createStyles(palette), [palette]);
}
