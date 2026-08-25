import * as Crypto from "expo-crypto";

import { getSurah } from "@/lib/content/quran";
import type { ChapterAudio } from "@/lib/audio/types";

export function normalizeQuranAudioText(text: string) {
  return text.normalize("NFC")
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06EDـ]/g, "")
    .replace(/[إأٱآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, "");
}

async function textSha256(text: string) {
  const result = await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, new TextEncoder().encode(normalizeQuranAudioText(text)));
  return Array.from(new Uint8Array(result)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function verifyChapterTextIntegrity(chapterAudio: ChapterAudio) {
  const localAyahs = getSurah(chapterAudio.chapter);
  if (localAyahs.length !== chapterAudio.ayahs.length) throw new Error("عدد الآيات في الفهرس لا يطابق النص المحلي.");

  for (const timing of chapterAudio.ayahs) {
    const localAyah = localAyahs[timing.ayah - 1];
    if (!localAyah) throw new Error("إحالة آية غير موجودة في النص المحلي.");
    if ((await textSha256(localAyah.text)).toLowerCase() !== timing.textSha256.toLowerCase()) {
      throw new Error(`بصمة نص الآية ${timing.ayah} لا تطابق فهرس التلاوة.`);
    }
  }
}
