export type ChapterActionState = "unavailable" | "download" | "downloading" | "play" | "error";

export type ChapterActionInput = {
  available: boolean;
  downloadedUri: string | null;
  downloading: boolean;
  failed: boolean;
};

const TOTAL_QURAN_CHAPTERS = 114;

export function normalizeAvailableChapters(chapters: readonly number[]) {
  return [...new Set(chapters.filter((chapter) => Number.isInteger(chapter) && chapter >= 1 && chapter <= TOTAL_QURAN_CHAPTERS))].sort((a, b) => a - b);
}

export function isCompleteQuranCoverage(chapters: readonly number[]) {
  return normalizeAvailableChapters(chapters).length === TOTAL_QURAN_CHAPTERS;
}

export function getReciterCoverageLabel(chapters: readonly number[]) {
  return `السور المتاحة: ${normalizeAvailableChapters(chapters).length} من ${TOTAL_QURAN_CHAPTERS}`;
}

export function getReciterDownloadLabel(chapters: readonly number[]) {
  const count = normalizeAvailableChapters(chapters).length;
  return isCompleteQuranCoverage(chapters) ? "تنزيل القرآن كله (114 سورة)" : `تنزيل السور المتاحة (${count})`;
}

export function getChapterActionState({ available, downloadedUri, downloading, failed }: ChapterActionInput): ChapterActionState {
  if (!available) return "unavailable";
  if (downloading) return "downloading";
  if (downloadedUri) return "play";
  if (failed) return "error";
  return "download";
}
