import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ChapterAudioAction } from "@/components/audio/chapter-audio-action";
import { MiniQuranPlayer } from "@/components/audio/mini-quran-player";
import { ReciterDownloadCard } from "@/components/audio/reciter-download-card";
import { AppScreen, ListChevron, ScreenTitle, Surface } from "@/components/dalil-ui";
import { surahCatalog } from "@/lib/content/quran";
import { useAppState } from "@/lib/state/app-state";
import { motion, palette, shapes, spacing } from "@/lib/ui/theme";

export default function QuranScreen() {
  const { state } = useAppState();
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim();
  const visible = useMemo(() => surahCatalog.filter((surah) => surah.name.includes(normalizedQuery) || String(surah.number) === normalizedQuery), [normalizedQuery]);

  return (
    <AppScreen>
      <FlatList
        contentContainerStyle={styles.content}
        data={visible}
        initialNumToRender={14}
        keyExtractor={(item) => String(item.number)}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<View style={styles.empty}><MaterialIcons color={palette.muted} name="search-off" size={28} /><Text style={styles.emptyTitle}>لا توجد سورة مطابقة</Text><Text style={styles.emptyText}>جرّب الاسم الكامل أو رقم السورة.</Text></View>}
        ListHeaderComponent={(
          <View style={styles.header}>
            <ScreenTitle eyebrow="القرآن الكريم" title="السور" />
            {state.quranBookmark ? <Pressable accessibilityLabel="استئناف القراءة" accessibilityRole="button" onPress={() => router.push(`/quran/${state.quranBookmark?.surah}` as never)} style={({ pressed }) => [styles.resumePressable, pressed && styles.pressed]}><Surface tone="tonal" style={styles.resume}><View style={styles.resumeIcon}><MaterialIcons color={palette.gold} name="bookmark" size={20} /></View><View style={styles.resumeCopy}><Text style={styles.resumeLabel}>استئناف القراءة</Text><Text style={styles.resumeTitle}>السورة {state.quranBookmark.surah} · الآية {state.quranBookmark.ayah}</Text></View><ListChevron /></Surface></Pressable> : null}
            <View style={styles.search}><MaterialIcons color={palette.muted} name="search" size={22} /><TextInput accessibilityLabel="البحث في السور" clearButtonMode="while-editing" onChangeText={setQuery} placeholder="ابحث باسم السورة أو رقمها" placeholderTextColor={palette.muted} style={styles.input} textAlign="right" value={query} /></View>
            <ReciterDownloadCard compact />
            <Text style={styles.listLabel}>{normalizedQuery ? `${visible.length} نتيجة` : "جميع السور"}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Surface style={styles.card}>
            <ChapterAudioAction chapter={item.number} chapterName={item.name} />
            <Pressable accessibilityLabel={`فتح سورة ${item.name}`} accessibilityRole="button" onPress={() => router.push(`/quran/${item.number}` as never)} style={({ pressed }) => [styles.openSurah, pressed && styles.pressed]}>
              <ListChevron />
              <View style={styles.copy}><Text style={styles.title}>{item.name}</Text><Text style={styles.description}>{item.ayahCount} آية</Text></View>
              <View style={styles.number}><Text style={styles.numberText}>{item.number}</Text></View>
            </Pressable>
          </Surface>
        )}
      />
      <MiniQuranPlayer />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.xs, paddingBottom: 108, paddingHorizontal: spacing.lg },
  header: { gap: spacing.sm, paddingBottom: spacing.sm, paddingTop: spacing.sm },
  resumePressable: { minHeight: 66 },
  resume: { alignItems: "center", flexDirection: "row", minHeight: 66, padding: spacing.sm },
  resumeIcon: { alignItems: "center", backgroundColor: palette.goldSoft, borderRadius: shapes.small, height: 42, justifyContent: "center", width: 42 },
  resumeCopy: { alignItems: "flex-end", flex: 1, marginHorizontal: spacing.sm },
  resumeLabel: { color: palette.gold, fontSize: 12, fontWeight: "800", textAlign: "right" },
  resumeTitle: { color: palette.ink, fontSize: 14, fontWeight: "800", marginTop: 2, textAlign: "right" },
  search: { alignItems: "center", backgroundColor: palette.surfaceContainer, borderRadius: shapes.large, flexDirection: "row", minHeight: 52, paddingHorizontal: spacing.md },
  input: { color: palette.ink, flex: 1, fontSize: 15, minHeight: 52, paddingHorizontal: spacing.xs },
  listLabel: { color: palette.muted, fontSize: 12, fontWeight: "800", textAlign: "right" },
  card: { alignItems: "center", flexDirection: "row", gap: spacing.sm, minHeight: 72, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  openSurah: { alignItems: "center", flex: 1, flexDirection: "row", minHeight: 52 },
  copy: { alignItems: "flex-end", flex: 1, marginHorizontal: spacing.sm },
  title: { color: palette.ink, fontSize: 16, fontWeight: "800", textAlign: "right" },
  description: { color: palette.muted, fontSize: 12, marginTop: 3, textAlign: "right" },
  number: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.small, height: 40, justifyContent: "center", width: 40 },
  numberText: { color: palette.primary, fontSize: 13, fontWeight: "900" },
  empty: { alignItems: "center", backgroundColor: palette.surfaceContainer, borderRadius: shapes.large, gap: spacing.xs, marginTop: spacing.xl, padding: spacing.xl },
  emptyTitle: { color: palette.ink, fontSize: 16, fontWeight: "800" },
  emptyText: { color: palette.muted, fontSize: 13 },
  pressed: { opacity: motion.pressOpacity, transform: [{ scale: motion.pressScale }] },
});
