import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import type { PropsWithChildren, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { palette } from "@/lib/ui/theme";

export function AppScreen({ children, scroll = false }: PropsWithChildren<{ scroll?: boolean }>) {
  return <ScreenContainer className={scroll ? "" : ""} containerClassName="">{children}</ScreenContainer>;
}

export function BackHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
      </View>
      <Pressable accessibilityLabel="الرجوع" onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
        <MaterialIcons color={palette.primary} name="arrow-forward" size={22} />
      </Pressable>
    </View>
  );
}

export function Surface({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

export function ScreenTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <View style={styles.titleRow}>
      <View style={styles.titleCopy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.screenTitle}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

export function AppButton({ label, icon, onPress, tone = "primary" }: { label: string; icon?: keyof typeof MaterialIcons.glyphMap; onPress: () => void; tone?: "primary" | "soft" | "danger" }) {
  const isPrimary = tone === "primary";
  const isDanger = tone === "danger";
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.button, isPrimary && styles.buttonPrimary, tone === "soft" && styles.buttonSoft, isDanger && styles.buttonDanger, pressed && styles.pressed]}>
      {icon ? <MaterialIcons color={isPrimary ? "#FFFFFF" : isDanger ? palette.danger : palette.primary} name={icon} size={19} /> : null}
      <Text style={[styles.buttonText, isPrimary && styles.buttonTextPrimary, isDanger && styles.buttonTextDanger]}>{label}</Text>
    </Pressable>
  );
}

export function Metric({ label, value, accent = "primary" }: { label: string; value: string; accent?: "primary" | "gold" }) {
  return (
    <View style={[styles.metric, accent === "gold" && styles.metricGold]}>
      <Text style={[styles.metricValue, accent === "gold" && styles.metricValueGold]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export function ListChevron() {
  return <MaterialIcons color={palette.muted} name="chevron-left" size={24} />;
}

const styles = StyleSheet.create({
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  headerCopy: { flex: 1, alignItems: "flex-end", marginLeft: 12 },
  headerTitle: { color: palette.ink, fontSize: 23, fontWeight: "800", textAlign: "right" },
  headerSubtitle: { color: palette.muted, fontSize: 13, marginTop: 3, textAlign: "right" },
  backButton: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: 16, height: 42, justifyContent: "center", width: 42 },
  surface: { backgroundColor: palette.surface, borderColor: palette.border, borderRadius: 22, borderWidth: 1, shadowColor: palette.shadow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.18, shadowRadius: 14, elevation: 2 },
  titleRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  titleCopy: { flex: 1, alignItems: "flex-end" },
  eyebrow: { color: palette.gold, fontSize: 12, fontWeight: "800", textAlign: "right" },
  screenTitle: { color: palette.ink, fontSize: 22, fontWeight: "800", marginTop: 2, textAlign: "right" },
  button: { alignItems: "center", borderRadius: 16, flexDirection: "row", gap: 8, justifyContent: "center", minHeight: 46, paddingHorizontal: 16 },
  buttonPrimary: { backgroundColor: palette.primary },
  buttonSoft: { backgroundColor: palette.primarySoft },
  buttonDanger: { backgroundColor: "#FCE9E9" },
  buttonText: { color: palette.primary, fontSize: 14, fontWeight: "800" },
  buttonTextPrimary: { color: "#FFFFFF" },
  buttonTextDanger: { color: palette.danger },
  metric: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: 18, flex: 1, minHeight: 76, justifyContent: "center", padding: 9 },
  metricGold: { backgroundColor: palette.goldSoft },
  metricValue: { color: palette.primary, fontSize: 22, fontWeight: "900" },
  metricValueGold: { color: palette.gold },
  metricLabel: { color: palette.muted, fontSize: 11, fontWeight: "700", marginTop: 3, textAlign: "center" },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});

export const uiStyles = styles;
