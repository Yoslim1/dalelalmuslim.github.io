import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import { deleteDownloadedAudio, getDownloadedAudioUri } from "@/lib/audio/downloads";
import { useQuranAudio } from "@/lib/audio/player";
import { getChapterActionState } from "@/lib/audio/reciter-download-state";
import { downloadVerifiedChapter } from "@/lib/audio/reciter-downloads";
import { useReciterLibrary } from "@/lib/audio/reciter-library";

export function useChapterAudioAction(chapter: number, chapterName: string) {
  const { selectedReciter, getChapterAudio, availableChapters, downloadRevision, refreshDownloadedChapters } = useReciterLibrary();
  const { playTrack } = useQuranAudio();
  const [downloadedUri, setDownloadedUri] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const chapterAudio = getChapterAudio(chapter);
  const available = Boolean(selectedReciter && chapterAudio && availableChapters.includes(chapter));

  useEffect(() => {
    let active = true;
    if (!selectedReciter || !available) {
      setDownloadedUri(null);
      setDownloading(false);
      setFailed(false);
      return () => { active = false; };
    }
    void getDownloadedAudioUri(selectedReciter.id, chapter)
      .then((uri) => { if (active) setDownloadedUri(uri); })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [available, chapter, downloadRevision, selectedReciter]);

  const play = useCallback(async () => {
    if (!downloadedUri || !chapterAudio || !selectedReciter) return;
    await playTrack({ uri: downloadedUri, chapter, chapterName, reciterName: selectedReciter.nameAr, durationMs: chapterAudio.durationMs });
  }, [chapter, chapterAudio, chapterName, downloadedUri, playTrack, selectedReciter]);

  const download = useCallback(async () => {
    if (!selectedReciter || !chapterAudio) return;
    if (Platform.OS === "web") {
      setMessage("حفظ التلاوة للتشغيل دون اتصال متاح في Android وiOS فقط.");
      return;
    }
    setDownloading(true);
    setFailed(false);
    setMessage("جارٍ التحقق من النص وتنزيل التلاوة…");
    try {
      const uri = await downloadVerifiedChapter(selectedReciter.id, chapterAudio);
      setDownloadedUri(uri);
      setMessage("حُفظت التلاوة محليًا.");
      refreshDownloadedChapters();
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "فشل تنزيل التلاوة أو التحقق منها.");
    } finally {
      setDownloading(false);
    }
  }, [chapterAudio, refreshDownloadedChapters, selectedReciter]);

  const remove = useCallback(async () => {
    if (!selectedReciter) return;
    await deleteDownloadedAudio(selectedReciter.id, chapter);
    setDownloadedUri(null);
    setMessage("حُذفت التلاوة من الجهاز.");
    refreshDownloadedChapters();
  }, [chapter, refreshDownloadedChapters, selectedReciter]);

  const actionState = useMemo(() => getChapterActionState({ available, downloadedUri, downloading, failed }), [available, downloadedUri, downloading, failed]);
  return { actionState, available, chapterAudio, downloadedUri, message, download, play, remove };
}
