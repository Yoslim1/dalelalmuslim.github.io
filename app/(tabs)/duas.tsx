import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AppScreen, ListChevron, ScreenTitle, Surface } from "@/components/dalil-ui";
import { duaCategories } from "@/lib/content";
import { motion, palette, shapes, spacing } from "@/lib/ui/theme";

export default function DuasScreen() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim();
  const visible = useMemo(() => duaCategories.filter((item) => item.title.includes(normalizedQuery) || item.description?.includes(normalizedQuery)), [normalizedQuery]);
  return <AppScreen><FlatList contentContainerStyle={styles.content} data={visible} keyExtractor={(item) => item.slug} keyboardShouldPersistTaps="handled" ListHeaderComponent={<View style={styles.header}><ScreenTitle eyebrow="محتوى موثّق ومحفوظ" title="الأدعية" /><View style={styles.search}><MaterialIcons color={palette.muted} name="search" size={22} /><TextInput accessibilityLabel="البحث في تصنيفات الأدعية" clearButtonMode="while-editing" onChangeText={setQuery} placeholder="ابحث في التصنيفات" placeholderTextColor={palette.muted} style={styles.input} textAlign="right" value={query} /></View><Text style={styles.result}>{normalizedQuery ? `${visible.length} نتيجة` : "اختر بابًا يناسب حاجتك"}</Text></View>} ListEmptyComponent={<View style={styles.empty}><MaterialIcons color={palette.muted} name="search-off" size={28} /><Text style={styles.emptyTitle}>لا توجد فئة مطابقة</Text><Text style={styles.emptyText}>جرّب كلمة أخرى للبحث.</Text></View>} renderItem={({ item }) => <Pressable accessibilityHint={`${item.items.length} دعاء`} accessibilityLabel={item.title} accessibilityRole="button" onPress={() => router.push(`/duas/${item.slug}` as never)} style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}><Surface style={styles.card}><ListChevron /><View style={styles.copy}><Text style={styles.title}>{item.title}</Text><Text numberOfLines={1} style={styles.description}>{item.description || "أدعية مختارة للورد اليومي"}</Text><Text style={styles.count}>{item.items.length} دعاء</Text></View><View style={styles.icon}><MaterialIcons color={palette.gold} name="auto-stories" size={22} /></View></Surface></Pressable>} /></AppScreen>;
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm, paddingBottom: spacing.xxl, paddingHorizontal: spacing.lg },
  header: { gap: spacing.sm, paddingBottom: spacing.sm, paddingTop: spacing.sm },
  search: { alignItems: "center", backgroundColor: palette.surfaceContainer, borderRadius: shapes.large, flexDirection: "row", minHeight: 52, paddingHorizontal: spacing.md },
  input: { color: palette.ink, flex: 1, fontSize: 15, minHeight: 52, paddingHorizontal: spacing.xs },
  result: { color: palette.muted, fontSize: 12, fontWeight: "800", textAlign: "right" },
  pressable: { minHeight: 88 },
  card: { alignItems: "center", flexDirection: "row", minHeight: 88, padding: spacing.sm },
  copy: { alignItems: "flex-end", flex: 1, marginHorizontal: spacing.sm },
  title: { color: palette.ink, fontSize: 16, fontWeight: "800", textAlign: "right" },
  description: { color: palette.muted, fontSize: 12, marginTop: 3, textAlign: "right" },
  count: { color: palette.gold, fontSize: 11, fontWeight: "800", marginTop: spacing.xs, textAlign: "right" },
  icon: { alignItems: "center", backgroundColor: palette.goldSoft, borderRadius: shapes.small, height: 44, justifyContent: "center", width: 44 },
  empty: { alignItems: "center", backgroundColor: palette.surfaceContainer, borderRadius: shapes.large, gap: spacing.xs, marginTop: spacing.xl, padding: spacing.xl },
  emptyTitle: { color: palette.ink, fontSize: 16, fontWeight: "800" },
  emptyText: { color: palette.muted, fontSize: 13 },
  pressed: { opacity: motion.pressOpacity, transform: [{ scale: motion.pressScale }] },
});
