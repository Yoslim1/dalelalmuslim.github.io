import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { loadAudioLibrary, loadReciterManifest } from "@/lib/audio/library";
import { normalizeAvailableChapters } from "@/lib/audio/reciter-download-state";
import { useAppState } from "@/lib/state/app-state";
import type { AudioLibraryEntry, AudioLibraryManifest, ChapterAudio, ReciterManifest } from "@/lib/audio/types";

export type ReciterLibraryStatus = "loading" | "ready" | "empty" | "error";

type ReciterLibraryApi = {
  status: ReciterLibraryStatus;
  error: string | null;
  library: AudioLibraryManifest | null;
  reciters: AudioLibraryEntry[];
  selectedReciter: AudioLibraryEntry | null;
  reciterManifest: ReciterManifest | null;
  availableChapters: number[];
  downloadRevision: number;
  selectReciter: (id: string) => void;
  getChapterAudio: (chapter: number) => ChapterAudio | null;
  refreshDownloadedChapters: () => void;
};

const ReciterLibraryContext = createContext<ReciterLibraryApi | null>(null);

export function ReciterLibraryProvider({ children }: PropsWithChildren) {
  const { state, updateAudioSettings } = useAppState();
  const [library, setLibrary] = useState<AudioLibraryManifest | null>(null);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [manifest, setManifest] = useState<ReciterManifest | null>(null);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [downloadRevision, setDownloadRevision] = useState(0);

  useEffect(() => {
    let active = true;
    void loadAudioLibrary()
      .then((next) => { if (active) setLibrary(next); })
      .catch(() => { if (active) setLibraryError("تعذر قراءة فهرس التلاوات."); });
    return () => { active = false; };
  }, []);

  const reciters = useMemo(() => library?.reciters.filter((entry) => entry.status === "published") ?? [], [library]);
  const selectedReciter = useMemo(() => reciters.find((entry) => entry.id === state.audio.selectedReciterId) ?? reciters[0] ?? null, [reciters, state.audio.selectedReciterId]);

  useEffect(() => {
    if (selectedReciter && selectedReciter.id !== state.audio.selectedReciterId) {
      updateAudioSettings({ selectedReciterId: selectedReciter.id });
    }
  }, [selectedReciter, state.audio.selectedReciterId, updateAudioSettings]);

  useEffect(() => {
    let active = true;
    if (!selectedReciter) {
      setManifest(null);
      setManifestError(null);
      return () => { active = false; };
    }
    setManifest(null);
    setManifestError(null);
    void loadReciterManifest(selectedReciter.manifestUrl)
      .then((next) => { if (active) setManifest(next); })
      .catch(() => { if (active) setManifestError("تعذر التحقق من فهرس القارئ."); });
    return () => { active = false; };
  }, [selectedReciter?.id, selectedReciter?.manifestUrl]);

  const reciterManifest = manifest?.reciter.id === selectedReciter?.id ? manifest : null;
  const availableChapters = useMemo(() => {
    const declared = selectedReciter?.availableChapters ?? [];
    const indexed = reciterManifest?.chapters.map((chapter) => chapter.chapter) ?? [];
    if (!reciterManifest) return normalizeAvailableChapters(declared);
    if (declared.length === 0) return normalizeAvailableChapters(indexed);
    const declaredSet = new Set(declared);
    return normalizeAvailableChapters(indexed.filter((chapter) => declaredSet.has(chapter)));
  }, [reciterManifest, selectedReciter?.availableChapters]);

  const status: ReciterLibraryStatus = libraryError || manifestError ? "error" : !library ? "loading" : reciters.length === 0 ? "empty" : "ready";
  const error = libraryError ?? manifestError;
  const selectReciter = useCallback((id: string) => {
    if (reciters.some((entry) => entry.id === id)) updateAudioSettings({ selectedReciterId: id });
  }, [reciters, updateAudioSettings]);
  const getChapterAudio = useCallback((chapter: number) => reciterManifest?.chapters.find((item) => item.chapter === chapter) ?? null, [reciterManifest]);
  const refreshDownloadedChapters = useCallback(() => setDownloadRevision((value) => value + 1), []);

  const api = useMemo<ReciterLibraryApi>(() => ({
    status, error, library, reciters, selectedReciter, reciterManifest, availableChapters, downloadRevision, selectReciter, getChapterAudio, refreshDownloadedChapters,
  }), [availableChapters, downloadRevision, error, getChapterAudio, library, reciterManifest, reciters, refreshDownloadedChapters, selectReciter, selectedReciter, status]);

  return <ReciterLibraryContext.Provider value={api}>{children}</ReciterLibraryContext.Provider>;
}

export function useReciterLibrary() {
  const context = useContext(ReciterLibraryContext);
  if (!context) throw new Error("useReciterLibrary must be used within ReciterLibraryProvider");
  return context;
}
