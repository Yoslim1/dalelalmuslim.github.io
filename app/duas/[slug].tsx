import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen, BackHeader, Surface } from "@/components/dalil-ui";
import { duaCategories } from "@/lib/content";
import { useAppState } from "@/lib/state/app-state";
import { copyText, shareText } from "@/lib/text-actions";
import { palette } from "@/lib/ui/theme";

export default function DuaListScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const category = duaCategories.find((item) => item.slug === slug) ?? duaCategories[0];
  const { state, toggleFavoriteDua } = useAppState();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  if (!category) return null;
  return <AppScreen><FlatList contentContainerStyle={styles.content} data={category.items} keyExtractor={(item, index) => String(item.id ?? index)} ListHeaderComponent={<BackHeader subtitle={`${category.items.length} دعاء متاح دون اتصال`} title={category.title} />} renderItem={({ item, index }) => { const id = String(item.id ?? index); const favorite = state.favoriteDuaIds.includes(id); const payload = [item.text, item.referenceText, item.sourceLabel].filter(Boolean).join("\n\n"); return <Surface style={styles.card}><View style={styles.topActions}><Pressable accessibilityLabel={favorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"} onPress={() => toggleFavoriteDua(id)} style={styles.favorite}><MaterialIcons color={favorite ? palette.gold : palette.muted} name={favorite ? "star" : "star-border"} size={24} /></Pressable><View style={styles.utilityActions}><Pressable accessibilityLabel="مشاركة الدعاء" onPress={() => void shareText(payload, category.title)} style={styles.utility}><MaterialIcons color={palette.primary} name="share" size={20} /></Pressable><Pressable accessibilityLabel="نسخ الدعاء" onPress={() => void copyText(payload).then(() => setCopiedId(id))} style={styles.utility}><MaterialIcons color={palette.primary} name={copiedId === id ? "check" : "content-copy"} size={20} /></Pressable></View></View><Text style={styles.dua}>{item.text}</Text>{item.referenceText ? <Text style={styles.reference}>{item.referenceText}</Text> : null}{item.sourceLabel ? <Text style={styles.source}>{item.sourceLabel}</Text> : null}</Surface>; }} /></AppScreen>;
}

const styles = StyleSheet.create({ content: { gap: 14, paddingBottom: 28 }, card: { marginHorizontal: 20, padding: 18 }, topActions: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }, favorite: { backgroundColor: palette.goldSoft, borderRadius: 15, padding: 8 }, utilityActions: { flexDirection: "row", gap: 8 }, utility: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: 14, height: 40, justifyContent: "center", width: 40 }, dua: { color: palette.ink, fontSize: 19, fontWeight: "600", lineHeight: 36, marginTop: 10, textAlign: "right" }, reference: { color: palette.muted, fontSize: 12, marginTop: 12, textAlign: "right" }, source: { color: palette.primary, fontSize: 11, fontWeight: "800", marginTop: 7, textAlign: "right" } });
