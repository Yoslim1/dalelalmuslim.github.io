import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

import { AppScreen, BackHeader, Surface } from "@/components/dalil-ui";
import { allahNames } from "@/lib/content";
import { palette } from "@/lib/ui/theme";

export default function NamesScreen() {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => allahNames.filter((item) => item.name.includes(query.trim()) || item.desc.includes(query.trim())), [query]);
  return <AppScreen><FlatList contentContainerStyle={styles.content} data={visible} keyExtractor={(item) => item.name} ListHeaderComponent={<><BackHeader subtitle="99 اسمًا محفوظة داخل التطبيق" title="أسماء الله الحسنى" /><View style={styles.search}><MaterialIcons color={palette.muted} name="search" size={20} /><TextInput onChangeText={setQuery} placeholder="ابحث باسم أو معنى" placeholderTextColor={palette.muted} style={styles.input} textAlign="right" value={query} /></View></>} renderItem={({ item }) => <Surface style={styles.card}><Text style={styles.name}>{item.name}</Text><Text style={styles.desc}>{item.desc}</Text></Surface>} /></AppScreen>;
}

const styles = StyleSheet.create({ content: { gap: 12, paddingBottom: 28 }, search: { alignItems: "center", backgroundColor: palette.surface, borderColor: palette.border, borderRadius: 16, borderWidth: 1, flexDirection: "row", marginHorizontal: 20, marginBottom: 18, paddingHorizontal: 13 }, input: { color: palette.ink, flex: 1, fontSize: 14, minHeight: 46, paddingHorizontal: 8 }, card: { marginHorizontal: 20, padding: 17 }, name: { color: palette.primary, fontSize: 20, fontWeight: "900", textAlign: "right" }, desc: { color: palette.muted, fontSize: 14, lineHeight: 24, marginTop: 7, textAlign: "right" } });
