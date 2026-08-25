import { z } from "zod";

import type { AudioLibraryManifest, ReciterManifest } from "@/lib/audio/types";
import { validateReciterManifest } from "@/lib/audio/validation";

const RECITER_MANIFEST_URL = "https://raw.githubusercontent.com/Yoslim1/dalil-almuslim-audio/main/library-manifest.json";

const audioLibrarySchema = z.object({
  format: z.literal("dalil-audio-library/v1"),
  version: z.string().min(1),
  reciters: z.array(z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    nameAr: z.string().min(1),
    manifestUrl: z.string().url(),
    coverage: z.literal("verified-ayah-timings"),
    status: z.literal("published"),
    availableChapters: z.array(z.number().int().min(1).max(114)).optional(),
  })),
});

const reciterSchema = z.object({
  format: z.literal("dalil-audio-reciter/v1"),
  version: z.string().min(1),
  reciter: z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    nameAr: z.string().min(1),
    nameEn: z.string().optional(),
    license: z.object({ name: z.string().min(1), url: z.string().url(), attribution: z.string().min(1) }),
  }),
  chapters: z.array(z.object({
    chapter: z.number().int().min(1).max(114),
    downloadUrl: z.string().url(),
    sha256: z.string().regex(/^[a-f0-9]{64}$/i),
    durationMs: z.number().int().positive(),
    ayahs: z.array(z.object({
      ayah: z.number().int().positive(),
      startMs: z.number().int().nonnegative(),
      endMs: z.number().int().positive(),
      textSha256: z.string().regex(/^[a-f0-9]{64}$/i),
    })).min(1),
  })).min(1),
});

export const emptyAudioLibrary: AudioLibraryManifest = {
  format: "dalil-audio-library/v1",
  version: "0.1.0",
  reciters: [],
};

export async function loadAudioLibrary(): Promise<AudioLibraryManifest> {
  if (!RECITER_MANIFEST_URL) return emptyAudioLibrary;
  const response = await fetch(RECITER_MANIFEST_URL, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("تعذر تحميل فهرس التلاوات.");
  return audioLibrarySchema.parse(await response.json()) as AudioLibraryManifest;
}

export async function loadReciterManifest(url: string): Promise<ReciterManifest> {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("تعذر تحميل فهرس القارئ.");
  return validateReciterManifest(reciterSchema.parse(await response.json()) as ReciterManifest);
}
