import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { AppButton, Surface } from "@/components/dalil-ui";
import { mapAudioDownloadError } from "@/lib/audio/download-error";
import { downloadVerifiedChapters } from "@/lib/audio/reciter-downloads";
import { getReciterCoverageLabel, getReciterDownloadLabel } from "@/lib/audio/reciter-download-state";
import { useReciterLibrary } from "@/lib/audio/reciter-library";
import { palette } from "@/lib/ui/theme";

export function ReciterDownloadCard({ compact = false }: { compact?: boolean }) {
  const { status, error, reciters, selectedReciter, reciterManifest, availableChapters, selectReciter, refreshDownloadedChapters } = useReciterLibrary();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  if (status === "loading") return <Surface style={styles.loading}><ActivityIndicator color={palette.primary} /><Text style={styles.note}>جارٍ قراءة مكتبة التلاوات…</Text></Surface>;
  if (status === "error") return <Surface style={styles.message}><MaterialIcons color={palette.danger} name="error-outline" size={23} /><Text style={styles.messageText}>{error}</Text></Surface>;
  if (status === "empty" || !selectedReciter) return <Surface style={styles.message}><MaterialIcons color={palette.primary} name="verified-user" size={23} /><Text style={styles.messageText}>لا توجد تلاوة منشورة بعد.</Text></Surface>;
  const downloadAvailable = async () => {
    if (!reciterManifest || busy) return;
    if (Platform.OS === "web") { setProgress("التنزيل الدائم متاح في Android وiOS فقط."); return; }
    const allowed = new Set(availableChapters);
    const chapters = reciterManifest.chapters.filter((chapter) => allowed.has(chapter.chapter));
    setBusy(true);
    setProgress(`جارٍ تجهيز ${chapters.length} سورة…`);
    try {
      await downloadVerifiedChapters(selectedReciter.id, chapters, (completed, total) => setProgress(`اكتمل تنزيل ${completed} من ${total}`));
      setProgress(`تم حفظ ${chapters.length} سورة محليًا.`);
      refreshDownloadedChapters();
    } catch (downloadError) {
      setProgress(mapAudioDownloadError(downloadError).message);
    } finally { setBusy(false); }
  };
  return <Surface style={[styles.card, compact && styles.compact]}>
    <View style={styles.topRow}><View style={styles.copy}><Text style={styles.eyebrow}>القارئ المختار</Text><Text style={styles.name}>{selectedReciter.nameAr}</Text><Text style={styles.coverage}>{getReciterCoverageLabel(availableChapters)}</Text></View><View style={styles.icon}><MaterialIcons color={palette.primary} name="record-voice-over" size={24} /></View></View>
    {reciters.length > 1 ? <View style={styles.chips}>{reciters.map((reciter) => <Pressable key={reciter.id} onPress={() => selectReciter(reciter.id)} style={[styles.chip, reciter.id === selectedReciter.id && styles.chipActive]}><Text style={[styles.chipText, reciter.id === selectedReciter.id && styles.chipTextActive]}>{reciter.nameAr}</Text></Pressable>)}</View> : null}
    {!reciterManifest ? <View style={styles.manifestLoading}><ActivityIndicator color={palette.primary} size="small" /><Text style={styles.note}>جارٍ فحص فهرس القارئ…</Text></View> : <AppButton icon={busy ? undefined : "download"} label={busy ? (progress ?? "جارٍ التنزيل…") : getReciterDownloadLabel(availableChapters)} onPress={() => void downloadAvailable()} tone="primary" />}
    {!compact && <Text style={styles.attribution}>المصدر: {reciterManifest?.reciter.license.attribution ?? "جارٍ التحقق"}</Text>}
    {progress && !busy ? <Text style={styles.progress}>{progress}</Text> : null}
  </Surface>;
}

const styles = StyleSheet.create({
  card: { gap: 14, marginHorizontal: 20, padding: 18 }, compact: { marginHorizontal: 0 }, loading: { alignItems: "center", flexDirection: "row", gap: 10, justifyContent: "center", marginHorizontal: 20, padding: 18 }, message: { alignItems: "center", flexDirection: "row", gap: 10, marginHorizontal: 20, padding: 16 }, messageText: { color: palette.ink, flex: 1, fontSize: 13, lineHeight: 20, textAlign: "right" }, note: { color: palette.muted, fontSize: 13 }, manifestLoading: { alignItems: "center", flexDirection: "row", gap: 10, justifyContent: "center", minHeight: 48 }, topRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }, copy: { alignItems: "flex-end", flex: 1, marginLeft: 12 }, eyebrow: { color: palette.gold, fontSize: 11, fontWeight: "900", textAlign: "right" }, name: { color: palette.ink, fontSize: 18, fontWeight: "900", marginTop: 2, textAlign: "right" }, coverage: { color: palette.muted, fontSize: 12, marginTop: 4, textAlign: "right" }, icon: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: 18, height: 50, justifyContent: "center", width: 50 }, chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "flex-end" }, chip: { backgroundColor: palette.primarySoft, borderRadius: 18, minHeight: 44, paddingHorizontal: 14, paddingVertical: 11 }, chipActive: { backgroundColor: palette.primary }, chipText: { color: palette.primary, fontSize: 12, fontWeight: "900" }, chipTextActive: { color: "#FFFFFF" }, attribution: { color: palette.muted, fontSize: 10, lineHeight: 16, textAlign: "right" }, progress: { color: palette.muted, fontSize: 12, lineHeight: 18, textAlign: "right" },
});
