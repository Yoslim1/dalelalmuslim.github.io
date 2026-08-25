import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

import { AppScreen, BackHeader, Surface } from "@/components/dalil-ui";
import { allahNames } from "@/lib/content";
import { type Palette, shapes, spacing } from "@/lib/ui/theme";
import { useSakinahTheme } from "@/lib/ui/theme-provider";

export default function NamesScreen() {
  const [query, setQuery] = useState("");
  const { palette } = useSakinahTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const normalizedQuery = query.trim();
  const visible = useMemo(() => allahNames.filter((item) => item.name.includes(normalizedQuery) || item.desc.includes(normalizedQuery)), [normalizedQuery]);
  return <AppScreen><FlatList contentContainerStyle={styles.content} data={visible} keyExtractor={(item) => item.name} keyboardShouldPersistTaps="handled" ListHeaderComponent={<View style={styles.header}><BackHeader subtitle="99 اسمًا محفوظة داخل التطبيق" title="أسماء الله الحسنى" /><Surface tone="tonal" style={styles.intro}><Text style={styles.introTitle}>تدبر الاسم والمعنى</Text><Text style={styles.introText}>اقرأ اسمًا في كل مرة، وخذ لحظة للتأمل في معناه.</Text></Surface><View style={styles.search}><MaterialIcons color={palette.muted} name="search" size={22} /><TextInput accessibilityLabel="البحث في أسماء الله الحسنى" clearButtonMode="while-editing" onChangeText={setQuery} placeholder="ابحث باسم أو معنى" placeholderTextColor={palette.muted} style={styles.input} textAlign="right" value={query} /></View><Text style={styles.result}>{normalizedQuery ? `${visible.length} نتيجة` : "جميع الأسماء"}</Text></View>} ListEmptyComponent={<View style={styles.empty}><MaterialIcons color={palette.muted} name="search-off" size={28} /><Text style={styles.emptyTitle}>لا يوجد اسم مطابق</Text><Text style={styles.emptyText}>جرّب اسمًا أو جزءًا من المعنى.</Text></View>} renderItem={({ item, index }) => <Surface style={styles.card}><View style={styles.order}><Text style={styles.orderText}>{index + 1}</Text></View><View style={styles.copy}><Text style={styles.name}>{item.name}</Text><Text style={styles.desc}>{item.desc}</Text></View></Surface>} /></AppScreen>;
}

function createStyles(palette: Palette) {
  return StyleSheet.create({
  content: { gap: spacing.sm, paddingBottom: spacing.xxl },
  header: { gap: spacing.sm },
  intro: { marginHorizontal: spacing.lg, padding: spacing.md },
  introTitle: { color: palette.ink, fontSize: 16, fontWeight: "800", textAlign: "right" },
  introText: { color: palette.muted, fontSize: 13, lineHeight: 20, marginTop: 3, textAlign: "right" },
  search: { alignItems: "center", backgroundColor: palette.surfaceContainer, borderRadius: shapes.large, flexDirection: "row", marginHorizontal: spacing.lg, minHeight: 52, paddingHorizontal: spacing.md },
  input: { color: palette.ink, flex: 1, fontSize: 15, minHeight: 52, paddingHorizontal: spacing.xs },
  result: { color: palette.muted, fontSize: 12, fontWeight: "800", marginHorizontal: spacing.lg, textAlign: "right" },
  card: { alignItems: "center", flexDirection: "row", marginHorizontal: spacing.lg, minHeight: 82, padding: spacing.md },
  order: { alignItems: "center", backgroundColor: palette.goldSoft, borderRadius: shapes.small, height: 40, justifyContent: "center", width: 40 },
  orderText: { color: palette.gold, fontSize: 12, fontWeight: "900" },
  copy: { alignItems: "flex-end", flex: 1, marginLeft: spacing.sm },
  name: { color: palette.primary, fontSize: 20, fontWeight: "900", textAlign: "right" },
  desc: { color: palette.muted, fontSize: 13, lineHeight: 21, marginTop: 3, textAlign: "right" },
  empty: { alignItems: "center", backgroundColor: palette.surfaceContainer, borderRadius: shapes.large, gap: spacing.xs, marginHorizontal: spacing.lg, marginTop: spacing.xl, padding: spacing.xl },
  emptyTitle: { color: palette.ink, fontSize: 16, fontWeight: "800" },
  emptyText: { color: palette.muted, fontSize: 13 },
  });
}
