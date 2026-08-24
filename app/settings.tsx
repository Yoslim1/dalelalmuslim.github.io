import { Alert, StyleSheet, Text, View } from "react-native";

import { AppButton, AppScreen, BackHeader, Surface } from "@/components/dalil-ui";
import { useAppState } from "@/lib/state/app-state";
import { palette } from "@/lib/ui/theme";

export default function SettingsScreen() {
  const { state, resetAllProgress, updateSettings } = useAppState();
  return <AppScreen><BackHeader subtitle="لا نستخدم حسابات أو خوادم في هذا الإصدار" title="الإعدادات" /><View style={styles.content}><Surface style={styles.row}><View style={styles.target}><Text style={styles.targetNumber}>{state.settings.tasbeehTarget}</Text></View><View style={styles.copy}><Text style={styles.title}>هدف التسبيح اليومي</Text><Text style={styles.subtitle}>يمكنك تعديله بتدرج 25 تسبيحة</Text></View></Surface><View style={styles.buttons}><AppButton icon="remove" label="خفض الهدف" onPress={() => updateSettings({ tasbeehTarget: Math.max(25, state.settings.tasbeehTarget - 25) })} tone="soft" /><AppButton icon="add" label="رفع الهدف" onPress={() => updateSettings({ tasbeehTarget: state.settings.tasbeehTarget + 25 })} tone="soft" /></View><AppButton icon="delete-outline" label="مسح التقدم المحلي" onPress={() => Alert.alert("مسح التقدم", "سيُحذف التقدم والمهام والمفضلة من هذا الجهاز فقط.", [{ text: "إلغاء", style: "cancel" }, { text: "مسح", style: "destructive", onPress: resetAllProgress }])} tone="danger" /></View></AppScreen>;
}

const styles = StyleSheet.create({ content: { gap: 14, padding: 20 }, row: { alignItems: "center", flexDirection: "row", padding: 16 }, copy: { alignItems: "flex-end", flex: 1, marginLeft: 12 }, title: { color: palette.ink, fontSize: 16, fontWeight: "900", textAlign: "right" }, subtitle: { color: palette.muted, fontSize: 12, marginTop: 4, textAlign: "right" }, target: { alignItems: "center", backgroundColor: palette.goldSoft, borderRadius: 14, height: 42, justifyContent: "center", width: 54 }, targetNumber: { color: palette.gold, fontSize: 17, fontWeight: "900" }, buttons: { flexDirection: "row", gap: 10 } });
