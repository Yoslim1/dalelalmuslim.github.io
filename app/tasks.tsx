import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AppScreen, BackHeader, Metric, Surface } from "@/components/dalil-ui";
import { useAppState } from "@/lib/state/app-state";
import { motion, type Palette, shapes, spacing } from "@/lib/ui/theme";
import { useSakinahTheme } from "@/lib/ui/theme-provider";

export default function TasksScreen() {
  const { state, addTask, deleteTask, toggleTask } = useAppState();
  const { palette } = useSakinahTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const [draft, setDraft] = useState("");
  const completed = state.tasks.filter((task) => task.completed).length;
  const submit = () => { if (draft.trim()) { addTask(draft.trim()); setDraft(""); } };
  const confirmDelete = (id: string) => Alert.alert("حذف المهمة", "هل تريد حذف هذه المهمة من ورد اليوم؟", [{ text: "إلغاء", style: "cancel" }, { text: "حذف", style: "destructive", onPress: () => deleteTask(id) }]);
  return <AppScreen><FlatList contentContainerStyle={styles.content} data={state.tasks} keyExtractor={(item) => item.id} ListEmptyComponent={<View style={styles.empty}><MaterialIcons color={palette.primary} name="check-circle-outline" size={30} /><Text style={styles.emptyTitle}>وردك خفيف اليوم</Text><Text style={styles.emptyText}>أضف مهمة صغيرة تريد المواظبة عليها.</Text></View>} ListHeaderComponent={<View style={styles.header}><BackHeader subtitle="كل تغيير يُحفظ تلقائيًا على جهازك" title="مهام اليوم" /><View style={styles.metrics}><Metric label="مكتمل" value={`${completed}/${state.tasks.length}`} /><Metric accent="gold" label="المتبقي" value={String(Math.max(0, state.tasks.length - completed))} /></View><Surface tone="tonal" style={styles.create}><TextInput accessibilityLabel="نص المهمة الجديدة" onChangeText={setDraft} onSubmitEditing={submit} placeholder="أضف مهمة بسيطة لوردك" placeholderTextColor={palette.muted} returnKeyType="done" style={styles.input} textAlign="right" value={draft} /><Pressable accessibilityLabel="إضافة المهمة" accessibilityRole="button" disabled={!draft.trim()} onPress={submit} style={({ pressed }) => [styles.add, !draft.trim() && styles.addDisabled, pressed && draft.trim() && styles.pressed]}><MaterialIcons color={palette.onPrimary} name="add" size={23} /></Pressable></Surface><Text style={styles.listLabel}>قائمة اليوم</Text></View>} renderItem={({ item }) => <Surface style={styles.task}><Pressable accessibilityLabel="حذف المهمة" accessibilityRole="button" onPress={() => confirmDelete(item.id)} style={({ pressed }) => [styles.delete, pressed && styles.pressed]}><MaterialIcons color={palette.danger} name="delete-outline" size={21} /></Pressable><Pressable accessibilityLabel={`${item.completed ? "إلغاء إتمام" : "إتمام"} مهمة ${item.title}`} accessibilityRole="button" onPress={() => toggleTask(item.id)} style={({ pressed }) => [styles.taskCopy, pressed && styles.pressed]}><Text style={[styles.taskTitle, item.completed && styles.done]}>{item.title}</Text></Pressable><Pressable accessibilityLabel={item.completed ? "إلغاء إتمام المهمة" : "إتمام المهمة"} accessibilityRole="checkbox" accessibilityState={{ checked: item.completed }} onPress={() => toggleTask(item.id)} style={({ pressed }) => [styles.check, item.completed && styles.checked, pressed && styles.pressed]}>{item.completed ? <MaterialIcons color={palette.onPrimary} name="check" size={18} /> : null}</Pressable></Surface>} /></AppScreen>;
}

function createStyles(palette: Palette) {
  return StyleSheet.create({
  content: { gap: spacing.sm, paddingBottom: spacing.xxl },
  header: { gap: spacing.sm },
  metrics: { flexDirection: "row", gap: spacing.xs, marginHorizontal: spacing.lg },
  create: { alignItems: "center", flexDirection: "row", marginHorizontal: spacing.lg, padding: spacing.xs },
  input: { color: palette.ink, flex: 1, fontSize: 15, minHeight: 48, paddingHorizontal: spacing.sm },
  add: { alignItems: "center", backgroundColor: palette.primary, borderRadius: shapes.full, height: 48, justifyContent: "center", width: 48 },
  addDisabled: { opacity: 0.45 },
  listLabel: { color: palette.muted, fontSize: 12, fontWeight: "800", marginHorizontal: spacing.lg, textAlign: "right" },
  task: { alignItems: "center", flexDirection: "row", marginHorizontal: spacing.lg, minHeight: 68, padding: spacing.sm },
  taskCopy: { alignItems: "flex-end", flex: 1, marginHorizontal: spacing.sm, minHeight: 48, justifyContent: "center" },
  taskTitle: { color: palette.ink, fontSize: 16, fontWeight: "700", textAlign: "right" },
  done: { color: palette.muted, textDecorationLine: "line-through" },
  check: { alignItems: "center", borderColor: palette.muted, borderRadius: shapes.full, borderWidth: 1.5, height: 48, justifyContent: "center", width: 48 },
  checked: { backgroundColor: palette.success, borderColor: palette.success },
  delete: { alignItems: "center", backgroundColor: palette.dangerSoft, borderRadius: shapes.full, height: 48, justifyContent: "center", width: 48 },
  empty: { alignItems: "center", backgroundColor: palette.surfaceContainer, borderRadius: shapes.large, gap: spacing.xs, marginHorizontal: spacing.lg, padding: spacing.xl },
  emptyTitle: { color: palette.ink, fontSize: 16, fontWeight: "800" },
  emptyText: { color: palette.muted, fontSize: 13 },
  pressed: { opacity: motion.pressOpacity, transform: [{ scale: motion.pressScale }] },
  });
}
