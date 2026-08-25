import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { Surface } from "@/components/dalil-ui";
import { deleteDownloadedAudio, downloadChapterAudio, getDownloadedAudioUri } from "@/lib/audio/downloads";
import { loadAudioLibrary, loadReciterManifest } from "@/lib/audio/library";
import { useQuranAudio } from "@/lib/audio/player";
import { verifyChapterTextIntegrity } from "@/lib/audio/text-integrity";
import type { AudioLibraryEntry, AudioLibraryManifest, ChapterAudio, ReciterManifest } from "@/lib/audio/types";
import { useAppState } from "@/lib/state/app-state";
import { palette } from "@/lib/ui/theme";

type Props = { chapter: number; chapterName: string };
const speeds = [0.75, 1, 1.25, 1.5] as const;

export function QuranAudioPanel({ chapter, chapterName }: Props) {
  const { playback, playTrack, seekBy, setSpeed, togglePlayback } = useQuranAudio();
  const { state, updateAudioSettings } = useAppState();
  const [library, setLibrary] = useState<AudioLibraryManifest | null>(null);
  const [reciter, setReciter] = useState<AudioLibraryEntry | null>(null);
  const [manifest, setManifest] = useState<ReciterManifest | null>(null);
  const [downloadedUri, setDownloadedUri] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const activeTrack = playback.track?.chapter === chapter ? playback.track : null;
  const chapterAudio: ChapterAudio | undefined = manifest?.chapters.find((item) => item.chapter === chapter);

  useEffect(() => { void loadAudioLibrary().then(setLibrary).catch(() => setMessage("تعذر قراءة فهرس التلاوات.")); }, []);
  useEffect(() => {
    if (!library) return;
    const selected = library.reciters.find((item) => item.id === state.audio.selectedReciterId && item.availableChapters?.includes(chapter))
      ?? library.reciters.find((item) => item.availableChapters?.includes(chapter))
      ?? null;
    setReciter(selected);
  }, [chapter, library, state.audio.selectedReciterId]);
  useEffect(() => {
    if (!reciter) { setManifest(null); setDownloadedUri(null); return; }
    setMessage(null);
    void loadReciterManifest(reciter.manifestUrl).then((next) => {
      setManifest(next);
      return getDownloadedAudioUri(reciter.id, chapter);
    }).then(setDownloadedUri).catch(() => setMessage("تعذر التحقق من فهرس القارئ."));
  }, [chapter, reciter]);

  const timeLabel = useMemo(() => `${formatTime(playback.positionMs)} / ${formatTime(playback.durationMs)}`, [playback.durationMs, playback.positionMs]);
  const selectReciter = (entry: AudioLibraryEntry) => { updateAudioSettings({ selectedReciterId: entry.id }); setReciter(entry); };
  const startDownloaded = async (uri: string) => {
    if (!chapterAudio || !manifest) return;
    await playTrack({ uri, reciterName: manifest.reciter.nameAr, chapter, chapterName, durationMs: chapterAudio.durationMs });
  };
  const download = async () => {
    if (!reciter || !chapterAudio) return;
    if (Platform.OS === "web") { setMessage("تنزيل التلاوة الدائم متاح في Android وiOS فقط."); return; }
    setBusy(true); setMessage("جارٍ التحقق من النص وتنزيل التلاوة…");
    try {
      await verifyChapterTextIntegrity(chapterAudio);
      const uri = await downloadChapterAudio({ reciterId: reciter.id, chapter, downloadUrl: chapterAudio.downloadUrl, sha256: chapterAudio.sha256 });
      setDownloadedUri(uri); setMessage("تم حفظ التلاوة والتحقق منها على جهازك.");
      await startDownloaded(uri);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "فشل تنزيل التلاوة أو التحقق منها.");
    } finally { setBusy(false); }
  };
  const remove = async () => {
    if (!reciter) return;
    await deleteDownloadedAudio(reciter.id, chapter); setDownloadedUri(null); setMessage("حُذفت التلاوة من جهازك.");
  };

  return <Surface style={styles.card}>
    <View style={styles.heading}><View style={styles.headingCopy}><Text style={styles.title}>التلاوة الصوتية</Text><Text style={styles.subtitle}>{activeTrack ? activeTrack.reciterName : reciter ? `القارئ: ${reciter.nameAr}` : "لا توجد تلاوة منشورة لهذه السورة"}</Text></View><View style={styles.iconWrap}><MaterialIcons color={palette.primary} name="headphones" size={22} /></View></View>
    {library?.reciters.length && library.reciters.filter((item) => item.availableChapters?.includes(chapter)).length > 1 ? <View style={styles.reciterChoices}>{library.reciters.filter((item) => item.availableChapters?.includes(chapter)).map((entry) => <Pressable key={entry.id} onPress={() => selectReciter(entry)} style={[styles.reciterChip, entry.id === reciter?.id && styles.reciterChipActive]}><Text style={[styles.reciterText, entry.id === reciter?.id && styles.reciterTextActive]}>{entry.nameAr}</Text></Pressable>)}</View> : null}
    {activeTrack ? <PlayerControls timeLabel={timeLabel} playback={playback} seekBy={seekBy} setSpeed={setSpeed} togglePlayback={togglePlayback} /> : downloadedUri ? <View style={styles.actionRow}><Pressable accessibilityLabel="تشغيل التلاوة المحفوظة" onPress={() => void startDownloaded(downloadedUri)} style={styles.primaryAction}><MaterialIcons color="#FFFFFF" name="play-arrow" size={23} /><Text style={styles.primaryActionText}>تشغيل التلاوة</Text></Pressable><Pressable accessibilityLabel="حذف التلاوة المحفوظة" onPress={() => void remove()} style={styles.iconAction}><MaterialIcons color={palette.danger} name="delete-outline" size={22} /></Pressable></View> : reciter && chapterAudio ? <Pressable accessibilityLabel="تنزيل تلاوة السورة" disabled={busy} onPress={() => void download()} style={({ pressed }) => [styles.downloadAction, (pressed || busy) && styles.pressed]}><MaterialIcons color="#FFFFFF" name="download" size={21} /><Text style={styles.primaryActionText}>{busy ? "جارٍ التنزيل…" : "تنزيل التلاوة"}</Text></Pressable> : <View style={styles.empty}><Text style={styles.emptyText}>{message ?? "لا ينشر التطبيق أي تلاوة إلا بعد تحقق الرخصة والتوافق آيةً بآية."}</Text></View>}
    {message && (activeTrack || downloadedUri || chapterAudio) ? <Text style={styles.status}>{message}</Text> : null}
    {reciter && <Text style={styles.attribution}>المصدر: {manifest?.reciter.license.attribution ?? "جارٍ التحقق"}</Text>}
  </Surface>;
}

function PlayerControls({ playback, timeLabel, seekBy, setSpeed, togglePlayback }: { playback: ReturnType<typeof useQuranAudio>["playback"]; timeLabel: string; seekBy: (value: number) => Promise<void>; setSpeed: (value: number) => void; togglePlayback: () => void }) {
  return <><View style={styles.progressTrack}><View style={[styles.progressValue, { width: `${Math.min(100, playback.durationMs ? (playback.positionMs / playback.durationMs) * 100 : 0)}%` }]} /></View><Text style={styles.time}>{timeLabel}</Text><View style={styles.playerControls}><Pressable accessibilityLabel="تأخير 10 ثوان" onPress={() => void seekBy(-10000)} style={styles.iconButton}><MaterialIcons color={palette.primary} name="replay-10" size={24} /></Pressable><Pressable accessibilityLabel={playback.playing ? "إيقاف مؤقت" : "تشغيل"} onPress={togglePlayback} style={styles.playButton}><MaterialIcons color="#FFFFFF" name={playback.playing ? "pause" : "play-arrow"} size={30} /></Pressable><Pressable accessibilityLabel="تقديم 10 ثوان" onPress={() => void seekBy(10000)} style={styles.iconButton}><MaterialIcons color={palette.primary} name="forward-10" size={24} /></Pressable></View><View style={styles.speedRow}><Text style={styles.speedLabel}>السرعة</Text><View style={styles.speedChoices}>{speeds.map((speed) => <Pressable key={speed} onPress={() => setSpeed(speed)} style={[styles.speedChip, playback.speed === speed && styles.speedChipActive]}><Text style={[styles.speedText, playback.speed === speed && styles.speedTextActive]}>{speed}×</Text></Pressable>)}</View></View></>;
}
function formatTime(milliseconds: number) { const total = Math.max(0, Math.floor(milliseconds / 1000)); return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`; }
const styles = StyleSheet.create({ card: { marginHorizontal: 20, padding: 18 }, heading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }, headingCopy: { alignItems: "flex-end", flex: 1, marginLeft: 12 }, title: { color: palette.ink, fontSize: 17, fontWeight: "900", textAlign: "right" }, subtitle: { color: palette.muted, fontSize: 12, lineHeight: 19, marginTop: 3, textAlign: "right" }, iconWrap: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: 16, height: 44, justifyContent: "center", width: 44 }, reciterChoices: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "flex-end", marginTop: 14 }, reciterChip: { backgroundColor: palette.primarySoft, borderRadius: 16, minHeight: 38, paddingHorizontal: 14, paddingVertical: 9 }, reciterChipActive: { backgroundColor: palette.primary }, reciterText: { color: palette.primary, fontSize: 12, fontWeight: "900" }, reciterTextActive: { color: "#FFFFFF" }, empty: { alignItems: "flex-end", backgroundColor: palette.background, borderRadius: 16, marginTop: 16, padding: 14 }, emptyText: { color: palette.ink, fontSize: 13, fontWeight: "700", lineHeight: 22, textAlign: "right" }, downloadAction: { alignItems: "center", backgroundColor: palette.primary, borderRadius: 24, flexDirection: "row", gap: 8, justifyContent: "center", marginTop: 16, minHeight: 48, paddingHorizontal: 20 }, actionRow: { alignItems: "center", flexDirection: "row", gap: 10, marginTop: 16 }, primaryAction: { alignItems: "center", backgroundColor: palette.primary, borderRadius: 24, flex: 1, flexDirection: "row", gap: 8, justifyContent: "center", minHeight: 48 }, primaryActionText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" }, iconAction: { alignItems: "center", backgroundColor: "#FCE9E9", borderRadius: 24, height: 48, justifyContent: "center", width: 48 }, status: { color: palette.muted, fontSize: 12, lineHeight: 19, marginTop: 11, textAlign: "right" }, attribution: { color: palette.muted, fontSize: 10, lineHeight: 16, marginTop: 10, textAlign: "right" }, progressTrack: { backgroundColor: palette.primarySoft, borderRadius: 999, height: 6, marginTop: 18, overflow: "hidden", width: "100%" }, progressValue: { backgroundColor: palette.primary, borderRadius: 999, height: "100%" }, time: { color: palette.muted, fontSize: 12, marginTop: 7, textAlign: "center", writingDirection: "ltr" }, playerControls: { alignItems: "center", flexDirection: "row", gap: 28, justifyContent: "center", marginTop: 12, writingDirection: "ltr" }, iconButton: { alignItems: "center", borderRadius: 24, height: 48, justifyContent: "center", width: 48 }, playButton: { alignItems: "center", backgroundColor: palette.primary, borderRadius: 28, height: 56, justifyContent: "center", width: 56 }, speedRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 14 }, speedLabel: { color: palette.muted, fontSize: 12, fontWeight: "800", textAlign: "right" }, speedChoices: { flexDirection: "row", gap: 6, writingDirection: "ltr" }, speedChip: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: 12, justifyContent: "center", minHeight: 38, minWidth: 45, paddingHorizontal: 8 }, speedChipActive: { backgroundColor: palette.primary }, speedText: { color: palette.primary, fontSize: 12, fontWeight: "900" }, speedTextActive: { color: "#FFFFFF" }, pressed: { opacity: 0.75, transform: [{ scale: 0.97 }] } });
