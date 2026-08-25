import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ChapterAudioAction } from "@/components/audio/chapter-audio-action";
import { ReciterDownloadCard } from "@/components/audio/reciter-download-card";
import { AppScreen, ListChevron, ScreenTitle, Surface } from "@/components/dalil-ui";
import { surahCatalog } from "@/lib/content/quran";
import { useAppState } from "@/lib/state/app-state";
import { palette } from "@/lib/ui/theme";

export default function QuranScreen() {
  const { state } = useAppState();
  const [query, setQuery] = useState("");
  const visible = useMemo(() => surahCatalog.filter((surah) => surah.name.includes(query.trim()) || String(surah.number) === query.trim()), [query]);
  return (
    <AppScreen>
      <FlatList
        contentContainerStyle={styles.content}
        data={visible}
        keyExtractor={(item) => String(item.number)}
        ListHeaderComponent={<View style={styles.header}><ScreenTitle eyebrow="القرآن الكريم" title="السور" />{state.quranBookmark ? <Pressable onPress={() => router.push(`/quran/${state.quranBookmark?.surah}` as never)}><Surface style={styles.resume}><MaterialIcons color={palette.gold} name="bookmark" size={22} /><View style={styles.resumeCopy}><Text style={styles.resumeTitle}>استئناف القراءة</Text><Text style={styles.resumeMeta}>السورة {state.quranBookmark.surah} · الآية {state.quranBookmark.ayah}</Text></View></Surface></Pressable> : null}<View style={styles.search}><MaterialIcons color={palette.muted} name="search" size={20} /><TextInput keyboardType="default" onChangeText={setQuery} placeholder="ابحث باسم السورة أو رقمها" placeholderTextColor={palette.muted} style={styles.input} textAlign="right" value={query} /></View><ReciterDownloadCard compact /></View>}
        renderItem={({ item }) => <Surface style={styles.card}><ChapterAudioAction chapter={item.number} chapterName={item.name} /><Pressable accessibilityLabel={`فتح سورة ${item.name}`} onPress={() => router.push(`/quran/${item.number}` as never)} style={({ pressed }) => [styles.openSurah, pressed && styles.pressed]}><ListChevron /><View style={styles.copy}><Text style={styles.title}>{item.name}</Text><Text style={styles.description}>{item.ayahCount} آية</Text></View><View style={styles.number}><Text style={styles.numberText}>{item.number}</Text></View></Pressable></Surface>}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 10, padding: 20 }, header: { gap: 14 }, resume: { alignItems: "center", backgroundColor: palette.goldSoft, flexDirection: "row", padding: 14 }, resumeCopy: { alignItems: "flex-end", flex: 1, marginRight: 10 }, resumeTitle: { color: palette.ink, fontSize: 14, fontWeight: "800" }, resumeMeta: { color: palette.muted, fontSize: 12, marginTop: 3 }, search: { alignItems: "center", backgroundColor: palette.surface, borderColor: palette.border, borderRadius: 16, borderWidth: 1, flexDirection: "row", paddingHorizontal: 13 }, input: { color: palette.ink, flex: 1, fontSize: 14, minHeight: 46, paddingHorizontal: 8 }, card: { alignItems: "center", flexDirection: "row", gap: 10, padding: 10 }, openSurah: { alignItems: "center", flex: 1, flexDirection: "row", minHeight: 52 }, copy: { alignItems: "flex-end", flex: 1, marginHorizontal: 12 }, title: { color: palette.ink, fontSize: 16, fontWeight: "800" }, description: { color: palette.muted, fontSize: 12, marginTop: 3 }, number: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: 15, height: 38, justifyContent: "center", width: 38 }, numberText: { color: palette.primary, fontSize: 13, fontWeight: "900" }, pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
});
