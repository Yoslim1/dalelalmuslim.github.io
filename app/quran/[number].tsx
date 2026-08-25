import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen, BackHeader, Surface } from "@/components/dalil-ui";
import { QuranAudioPanel } from "@/components/quran-audio-panel";
import { getSurah, surahCatalog } from "@/lib/content/quran";
import { useAppState } from "@/lib/state/app-state";
import { copyText, shareText } from "@/lib/text-actions";
import { type Palette, shapes, spacing } from "@/lib/ui/theme";
import { useSakinahTheme } from "@/lib/ui/theme-provider";

export default function QuranReaderScreen() {
  const { number } = useLocalSearchParams<{ number: string }>();
  const surahNumber = Number(number);
  const ayahs = getSurah(surahNumber);
  const meta = surahCatalog.find((item) => item.number === surahNumber);
  const { state, saveBookmark } = useAppState();
  const { palette } = useSakinahTheme();
  const styles = useMemo(() => createStyles(palette, state.settings.quranTextSize), [palette, state.settings.quranTextSize]);
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);
  if (!meta || !Array.isArray(ayahs)) {
    return <AppScreen><BackHeader subtitle="اختر سورة من الفهرس للمتابعة" title="سورة غير متاحة" /><Surface style={styles.empty}><Text style={styles.emptyTitle}>تعذر فتح هذه السورة</Text><Text style={styles.emptyText}>رقم السورة يجب أن يكون بين 1 و114.</Text></Surface></AppScreen>;
  }
  const chapterName = meta?.name ?? "";
  return <AppScreen><FlatList contentContainerStyle={styles.content} data={ayahs} keyExtractor={(item) => String(item.verse)} ListHeaderComponent={<><BackHeader subtitle={`${meta?.ayahCount ?? ayahs.length} آية · قراءة دون اتصال`} title={`سورة ${chapterName}`} /><QuranAudioPanel chapter={surahNumber} chapterName={chapterName} /></>} renderItem={({ item }) => { const bookmarked = state.quranBookmark?.surah === item.chapter && state.quranBookmark?.ayah === item.verse; const payload = `${item.text}\n\nسورة ${chapterName} · الآية ${item.verse}`; return <Surface style={[styles.ayahCard, bookmarked && styles.bookmarked]}><Pressable onPress={() => saveBookmark(item.chapter, item.verse)} style={styles.ayahCopy}><Text style={styles.ayahText}>{item.text}</Text></Pressable><View style={styles.controls}><View style={styles.ayahNumber}><Text style={styles.ayahNumberText}>{item.verse}</Text></View><View style={styles.utilityActions}><Pressable accessibilityLabel="مشاركة الآية" onPress={() => void shareText(payload, `سورة ${chapterName}`)} style={styles.utility}><MaterialIcons color={palette.primary} name="share" size={19} /></Pressable><Pressable accessibilityLabel="نسخ الآية" onPress={() => void copyText(payload).then(() => setCopiedVerse(item.verse))} style={styles.utility}><MaterialIcons color={palette.primary} name={copiedVerse === item.verse ? "check" : "content-copy"} size={19} /></Pressable></View></View></Surface>; }} /></AppScreen>;
}

function createStyles(palette: Palette, quranTextSize: number) {
  return StyleSheet.create({ content: { gap: spacing.sm, paddingBottom: spacing.xxl }, ayahCard: { marginHorizontal: spacing.lg, padding: spacing.md }, bookmarked: { borderColor: palette.gold, borderWidth: 1.5 }, ayahCopy: { width: "100%" }, ayahText: { color: palette.ink, fontSize: quranTextSize, fontWeight: "600", lineHeight: quranTextSize * 1.9, textAlign: "right" }, controls: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: spacing.sm }, ayahNumber: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.small, height: 36, justifyContent: "center", width: 36 }, ayahNumberText: { color: palette.primary, fontSize: 12, fontWeight: "900" }, utilityActions: { flexDirection: "row", gap: spacing.xs }, utility: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.small, height: 44, justifyContent: "center", width: 44 }, empty: { alignItems: "flex-end", margin: spacing.lg, padding: spacing.lg }, emptyTitle: { color: palette.ink, fontSize: 18, fontWeight: "900", textAlign: "right" }, emptyText: { color: palette.muted, fontSize: 13, marginTop: 6, textAlign: "right" } });
}
