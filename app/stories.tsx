import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen, BackHeader, Surface } from "@/components/dalil-ui";
import { stories } from "@/lib/content";
import { useAppState } from "@/lib/state/app-state";
import { motion, type Palette, shapes, spacing } from "@/lib/ui/theme";
import { useSakinahTheme } from "@/lib/ui/theme-provider";

export default function StoriesScreen() {
  const { state, markStoryRead } = useAppState();
  const { palette } = useSakinahTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const readCount = state.readStoryIds.length;
  return <AppScreen><FlatList contentContainerStyle={styles.content} data={stories} keyExtractor={(item) => String(item.id)} ListHeaderComponent={<View style={styles.header}><BackHeader subtitle="قصص ومواعظ مضمّنة داخل التطبيق" title="قصص وعبر" /><Surface tone="tonal" style={styles.intro}><View style={styles.introCopy}><Text style={styles.introTitle}>قراءة هادئة، وعبرة عملية</Text><Text style={styles.introText}>أنهيت {readCount} من القصص المحفوظة.</Text></View><View style={styles.introMark}><MaterialIcons color={palette.gold} name="menu-book" size={24} /></View></Surface></View>} renderItem={({ item }) => { const read = state.readStoryIds.includes(String(item.id)); return <Pressable accessibilityLabel={`${read ? "قراءة" : "فتح"} قصة ${item.title}`} accessibilityRole="button" onPress={() => markStoryRead(item.id)} style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}><Surface style={[styles.card, read && styles.read]}><View style={styles.cardHeading}><View style={[styles.statusMark, read && styles.statusMarkRead]}><MaterialIcons color={read ? palette.success : palette.gold} name={read ? "check" : "auto-stories"} size={20} /></View><Text style={styles.title}>{item.title}</Text></View><Text numberOfLines={read ? undefined : 3} style={styles.body}>{item.story || item.content || item.excerpt || "اضغط لقراءة القصة وتسجيلها ضمن المقروءات."}</Text>{read && item.lesson ? <Text style={styles.lesson}>العبرة: {item.lesson}</Text> : null}<Text style={[styles.status, read && styles.statusRead]}>{read ? "تمت القراءة" : "اضغط للقراءة"}</Text></Surface></Pressable>; }} /></AppScreen>;
}

function createStyles(palette: Palette) {
  return StyleSheet.create({
  content: { gap: spacing.sm, paddingBottom: spacing.xxl },
  header: { gap: spacing.sm },
  intro: { alignItems: "center", flexDirection: "row", marginHorizontal: spacing.lg, padding: spacing.md },
  introCopy: { alignItems: "flex-end", flex: 1, marginLeft: spacing.sm },
  introTitle: { color: palette.ink, fontSize: 16, fontWeight: "800", textAlign: "right" },
  introText: { color: palette.muted, fontSize: 12, marginTop: 3, textAlign: "right" },
  introMark: { alignItems: "center", backgroundColor: palette.goldSoft, borderRadius: shapes.medium, height: 50, justifyContent: "center", width: 50 },
  pressable: { minHeight: 132 },
  card: { marginHorizontal: spacing.lg, padding: spacing.lg },
  read: { backgroundColor: palette.surfaceContainerLow },
  cardHeading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  statusMark: { alignItems: "center", backgroundColor: palette.goldSoft, borderRadius: shapes.full, height: 40, justifyContent: "center", width: 40 },
  statusMarkRead: { backgroundColor: palette.primarySoft },
  title: { color: palette.ink, flex: 1, fontSize: 17, fontWeight: "900", marginLeft: spacing.sm, textAlign: "right" },
  body: { color: palette.muted, fontSize: 14, lineHeight: 25, marginTop: spacing.sm, textAlign: "right" },
  lesson: { color: palette.primary, fontSize: 13, fontWeight: "800", lineHeight: 22, marginTop: spacing.sm, textAlign: "right" },
  status: { color: palette.gold, fontSize: 12, fontWeight: "800", marginTop: spacing.sm, textAlign: "right" },
  statusRead: { color: palette.success },
  pressed: { opacity: motion.pressOpacity, transform: [{ scale: motion.pressScale }] },
  });
}
