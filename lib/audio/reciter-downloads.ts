import { downloadChapterAudio } from "@/lib/audio/downloads";
import { verifyChapterTextIntegrity } from "@/lib/audio/text-integrity";
import type { ChapterAudio } from "@/lib/audio/types";

export async function downloadVerifiedChapter(reciterId: string, chapterAudio: ChapterAudio, onProgress?: (progress: number) => void) {
  await verifyChapterTextIntegrity(chapterAudio);
  return downloadChapterAudio({
    reciterId,
    chapter: chapterAudio.chapter,
    downloadUrl: chapterAudio.downloadUrl,
    sha256: chapterAudio.sha256,
  }, onProgress);
}

export async function downloadVerifiedChapters(
  reciterId: string,
  chapters: readonly ChapterAudio[],
  onChapterComplete?: (completed: number, total: number) => void,
) {
  let completed = 0;
  for (const chapter of chapters) {
    await downloadVerifiedChapter(reciterId, chapter);
    completed += 1;
    onChapterComplete?.(completed, chapters.length);
  }
  return completed;
}
