import { StyleSheet, Text, View } from "react-native";

import { AppScreen, BackHeader, Metric, Surface } from "@/components/dalil-ui";
import { useAppState } from "@/lib/state/app-state";
import { palette } from "@/lib/ui/theme";

export default function StatsScreen() {
  const { state } = useAppState();
  const doneTasks = state.tasks.filter((task) => task.completed).length;
  return <AppScreen><BackHeader subtitle="ملخصك من البيانات المحفوظة على جهازك" title="إحصائيات اليوم" /><View style={styles.content}><View style={styles.metrics}><Metric label="تسبيح" value={String(state.daily.tasbeehCount)} /><Metric accent="gold" label="أذكار مكتملة" value={String(state.daily.completedAzkarIds.length)} /><Metric label="مهام" value={`${doneTasks}/${state.tasks.length}`} /></View><Surface style={styles.card}><Text style={styles.title}>تقدمك اليومي</Text><Text style={styles.body}>كل تكرار في الأذكار، وكل تسبيحة، وكل مهمة مكتملة تُحفظ محليًا وتظهر هنا دون أي حساب أو اتصال بالشبكة.</Text></Surface></View></AppScreen>;
}

const styles = StyleSheet.create({ content: { gap: 18, padding: 20 }, metrics: { flexDirection: "row", gap: 8 }, card: { padding: 20 }, title: { color: palette.ink, fontSize: 18, fontWeight: "900", textAlign: "right" }, body: { color: palette.muted, fontSize: 15, lineHeight: 25, marginTop: 9, textAlign: "right" } });
