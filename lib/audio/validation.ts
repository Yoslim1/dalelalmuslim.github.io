import { getSurah } from "@/lib/content/quran";
import type { ReciterManifest } from "@/lib/audio/types";

export function validateReciterManifest(manifest: ReciterManifest): ReciterManifest {
  const seenChapters = new Set<number>();

  for (const chapter of manifest.chapters) {
    if (seenChapters.has(chapter.chapter)) throw new Error(`تكرار سورة ${chapter.chapter} في فهرس القارئ.`);
    seenChapters.add(chapter.chapter);
    const ayahs = getSurah(chapter.chapter);
    if (chapter.ayahs.length !== ayahs.length) {
      throw new Error(`سورة ${chapter.chapter}: عدد توقيتات الآيات لا يطابق النص المحلي.`);
    }
    let previousEnd = 0;
    chapter.ayahs.forEach((timing, index) => {
      const expectedAyah = index + 1;
      if (timing.ayah !== expectedAyah) throw new Error(`سورة ${chapter.chapter}: التوقيتات ليست مرتبة آيةً بآية.`);
      if (timing.startMs < previousEnd || timing.endMs <= timing.startMs || timing.endMs > chapter.durationMs) {
        throw new Error(`سورة ${chapter.chapter}، آية ${timing.ayah}: توقيت غير صالح.`);
      }
      previousEnd = timing.endMs;
    });
  }

  return manifest;
}
