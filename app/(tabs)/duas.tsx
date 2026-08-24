import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AppScreen, ListChevron, ScreenTitle, Surface } from "@/components/dalil-ui";
import { duaCategories } from "@/lib/content";
import { palette } from "@/lib/ui/theme";

export default function DuasScreen() {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => duaCategories.filter((item) => item.title.includes(query.trim()) || item.description?.includes(query.trim())), [query]);
  return (
    <AppScreen>
      <FlatList
        contentContainerStyle={styles.content}
        data={visible}
        keyExtractor={(item) => item.slug}
        ListHeaderComponent={<View style={styles.header}><ScreenTitle eyebrow="محتوى مضمّن" title="الأدعية" /><View style={styles.search}><MaterialIcons color={palette.muted} name="search" size={20} /><TextInput onChangeText={setQuery} placeholder="ابحث في التصنيفات" placeholderTextColor={palette.muted} style={styles.input} textAlign="right" value={query} /></View></View>}
        ListEmptyComponent={<Text style={styles.empty}>لا توجد فئة مطابقة للبحث.</Text>}
        renderItem={({ item }) => <Pressable onPress={() => router.push(`/duas/${item.slug}` as never)} style={({ pressed }) => [pressed && styles.pressed]}><Surface style={styles.card}><ListChevron /><View style={styles.copy}><Text style={styles.title}>{item.title}</Text><Text numberOfLines={1} style={styles.description}>{item.description || "أدعية مختارة للورد اليومي"}</Text><Text style={styles.count}>{item.items.length} دعاء</Text></View><View style={styles.icon}><MaterialIcons color={palette.gold} name="auto-stories" size={23} /></View></Surface></Pressable>}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 12, padding: 20 }, header: { gap: 14 }, search: { alignItems: "center", backgroundColor: palette.surface, borderColor: palette.border, borderRadius: 16, borderWidth: 1, flexDirection: "row", paddingHorizontal: 13 }, input: { color: palette.ink, flex: 1, fontSize: 14, minHeight: 46, paddingHorizontal: 8 }, card: { alignItems: "center", flexDirection: "row", padding: 16 }, copy: { alignItems: "flex-end", flex: 1, marginHorizontal: 12 }, title: { color: palette.ink, fontSize: 17, fontWeight: "800", textAlign: "right" }, description: { color: palette.muted, fontSize: 13, marginTop: 3, textAlign: "right" }, count: { color: palette.gold, fontSize: 12, fontWeight: "800", marginTop: 7 }, icon: { alignItems: "center", backgroundColor: palette.goldSoft, borderRadius: 16, height: 46, justifyContent: "center", width: 46 }, empty: { color: palette.muted, padding: 24, textAlign: "center" }, pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
});
