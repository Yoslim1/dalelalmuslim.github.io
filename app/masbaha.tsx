import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppButton, AppScreen, BackHeader, Surface } from "@/components/dalil-ui";
import { lightHaptic, successHaptic } from "@/lib/haptics";
import { useAppState } from "@/lib/state/app-state";
import { palette } from "@/lib/ui/theme";

export default function MasbahaScreen() {
  const { state, incrementTasbeeh, resetTasbeeh } = useAppState();
  const target = state.settings.tasbeehTarget;
  const complete = state.daily.tasbeehCount >= target;
  const handleCount = () => {
    incrementTasbeeh();
    if (state.daily.tasbeehCount + 1 === target) successHaptic(); else lightHaptic();
  };
  return <AppScreen><BackHeader subtitle="يُحفظ العداد تلقائيًا على جهازك" title="المسبحة الذكية" /><View style={styles.content}><Surface style={styles.intro}><Text style={styles.eyebrow}>الذكر الحالي</Text><Text style={styles.dhikr}>سُبْحَانَ اللَّهِ وَبِحَمْدِهِ</Text><Text style={styles.meta}>الهدف اليومي: {target} تسبيحة</Text></Surface><Pressable accessibilityLabel="زيادة عداد المسبحة" onPress={handleCount} style={({ pressed }) => [styles.counter, complete && styles.counterComplete, pressed && styles.pressed]}><Text style={[styles.count, complete && styles.countComplete]}>{state.daily.tasbeehCount}</Text><Text style={styles.counterLabel}>{complete ? "أحسنت، اكتمل الهدف" : "اضغط للتسبيح"}</Text><MaterialIcons color={complete ? palette.success : palette.primary} name={complete ? "check-circle" : "touch-app"} size={28} /></Pressable><View style={styles.actions}><AppButton icon="restart-alt" label="إعادة الضبط" onPress={resetTasbeeh} tone="soft" /></View></View></AppScreen>;
}

const styles = StyleSheet.create({ content: { alignItems: "center", flex: 1, gap: 22, padding: 20 }, intro: { alignSelf: "stretch", padding: 20 }, eyebrow: { color: palette.gold, fontSize: 12, fontWeight: "900", textAlign: "right" }, dhikr: { color: palette.ink, fontSize: 22, fontWeight: "800", lineHeight: 38, marginTop: 8, textAlign: "right" }, meta: { color: palette.muted, fontSize: 13, marginTop: 9, textAlign: "right" }, counter: { alignItems: "center", backgroundColor: palette.primarySoft, borderColor: palette.primary, borderRadius: 150, borderWidth: 8, height: 260, justifyContent: "center", width: 260 }, counterComplete: { backgroundColor: "#E4F4EB", borderColor: palette.success }, count: { color: palette.primary, fontSize: 72, fontWeight: "900" }, countComplete: { color: palette.success }, counterLabel: { color: palette.muted, fontSize: 14, fontWeight: "800", marginVertical: 8 }, actions: { alignSelf: "stretch" }, pressed: { opacity: 0.8, transform: [{ scale: 0.975 }] } });
