import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput } from "react-native";

import { AppScreen, BackHeader, Surface } from "@/components/dalil-ui";
import { useAppState } from "@/lib/state/app-state";
import { palette } from "@/lib/ui/theme";

export default function TasksScreen() {
  const { state, addTask, deleteTask, toggleTask } = useAppState();
  const [draft, setDraft] = useState("");
  const submit = () => { if (draft.trim()) { addTask(draft); setDraft(""); } };
  return <AppScreen><FlatList contentContainerStyle={styles.content} data={state.tasks} keyExtractor={(item) => item.id} ListHeaderComponent={<><BackHeader subtitle="كل تغيير يُحفظ تلقائيًا" title="المهام اليومية" /><Surface style={styles.create}><TextInput onChangeText={setDraft} onSubmitEditing={submit} placeholder="أضف مهمة جديدة" placeholderTextColor={palette.muted} returnKeyType="done" style={styles.input} textAlign="right" value={draft} /><Pressable accessibilityLabel="إضافة المهمة" onPress={submit} style={styles.add}><MaterialIcons color="#FFFFFF" name="add" size={23} /></Pressable></Surface></>} renderItem={({ item }) => <Surface style={styles.task}><Pressable accessibilityLabel="حذف المهمة" onPress={() => deleteTask(item.id)} style={styles.delete}><MaterialIcons color={palette.danger} name="delete-outline" size={21} /></Pressable><Pressable onPress={() => toggleTask(item.id)} style={styles.taskCopy}><Text style={[styles.taskTitle, item.completed && styles.done]}>{item.title}</Text></Pressable><Pressable accessibilityLabel="تبديل حالة المهمة" onPress={() => toggleTask(item.id)} style={[styles.check, item.completed && styles.checked]}>{item.completed ? <MaterialIcons color="#FFFFFF" name="check" size={18} /> : null}</Pressable></Surface>} /></AppScreen>;
}

const styles = StyleSheet.create({ content: { gap: 12, paddingBottom: 28 }, create: { alignItems: "center", flexDirection: "row", margin: 20, marginTop: 0, padding: 8 }, input: { color: palette.ink, flex: 1, fontSize: 15, minHeight: 44, paddingHorizontal: 10 }, add: { alignItems: "center", backgroundColor: palette.primary, borderRadius: 14, height: 42, justifyContent: "center", width: 42 }, task: { alignItems: "center", flexDirection: "row", marginHorizontal: 20, padding: 13 }, taskCopy: { alignItems: "flex-end", flex: 1, marginHorizontal: 12 }, taskTitle: { color: palette.ink, fontSize: 16, fontWeight: "700", textAlign: "right" }, done: { color: palette.muted, textDecorationLine: "line-through" }, check: { alignItems: "center", borderColor: palette.muted, borderRadius: 13, borderWidth: 1.5, height: 26, justifyContent: "center", width: 26 }, checked: { backgroundColor: palette.success, borderColor: palette.success }, delete: { padding: 5 } });
