import { FlatList, Pressable, StyleSheet, Text } from "react-native";

import { AppScreen, BackHeader, Surface } from "@/components/dalil-ui";
import { stories } from "@/lib/content";
import { useAppState } from "@/lib/state/app-state";
import { palette } from "@/lib/ui/theme";

export default function StoriesScreen() {
  const { state, markStoryRead } = useAppState();
  return <AppScreen><FlatList contentContainerStyle={styles.content} data={stories} keyExtractor={(item) => String(item.id)} ListHeaderComponent={<BackHeader subtitle="قصص ومواعظ مضمّنة داخل التطبيق" title="قصص وعبر" />} renderItem={({ item }) => { const read = state.readStoryIds.includes(String(item.id)); return <Pressable onPress={() => markStoryRead(item.id)}><Surface style={[styles.card, read && styles.read]}><Text style={styles.title}>{item.title}</Text><Text numberOfLines={read ? undefined : 3} style={styles.body}>{item.story || item.content || item.excerpt || "اضغط لقراءة القصة وتسجيلها ضمن المقروءات."}</Text>{read && item.lesson ? <Text style={styles.lesson}>العبرة: {item.lesson}</Text> : null}<Text style={styles.status}>{read ? "تمت القراءة" : "اضغط للقراءة"}</Text></Surface></Pressable>; }} /></AppScreen>;
}

const styles = StyleSheet.create({ content: { gap: 12, paddingBottom: 28 }, card: { marginHorizontal: 20, padding: 18 }, read: { backgroundColor: "#F4FBF7", borderColor: "#BCE6CE" }, title: { color: palette.ink, fontSize: 18, fontWeight: "900", textAlign: "right" }, body: { color: palette.muted, fontSize: 14, lineHeight: 25, marginTop: 8, textAlign: "right" }, lesson: { color: palette.primary, fontSize: 13, fontWeight: "800", lineHeight: 22, marginTop: 10, textAlign: "right" }, status: { color: palette.success, fontSize: 12, fontWeight: "800", marginTop: 12, textAlign: "right" } });
