import { afterEach, describe, expect, it, vi } from "vitest";

import { loadAudioLibrary } from "@/lib/audio/library";
import { validateReciterManifest } from "@/lib/audio/validation";
import type { ReciterManifest } from "@/lib/audio/types";

const digest = "a".repeat(64);

function alFatihaManifest(): ReciterManifest {
  return {
    format: "dalil-audio-reciter/v1",
    version: "1.0.0",
    reciter: { id: "test-reciter", nameAr: "قارئ اختبار", license: { name: "Test", url: "https://example.com/license", attribution: "Test attribution" } },
    chapters: [{
      chapter: 1,
      downloadUrl: "https://example.com/001.mp3",
      sha256: digest,
      durationMs: 7000,
      ayahs: Array.from({ length: 7 }, (_, index) => ({ ayah: index + 1, startMs: index * 1000, endMs: (index + 1) * 1000, textSha256: digest })),
    }],
  };
}

describe("audio manifest validation", () => {
  it("accepts contiguous timings that cover every ayah in a local surah", () => {
    expect(validateReciterManifest(alFatihaManifest()).chapters[0].ayahs).toHaveLength(7);
  });

  it("rejects a missing ayah timing", () => {
    const manifest = alFatihaManifest();
    manifest.chapters[0].ayahs.pop();
    expect(() => validateReciterManifest(manifest)).toThrow("عدد توقيتات الآيات");
  });

  it("rejects overlapping or reversed ayah timings", () => {
    const manifest = alFatihaManifest();
    manifest.chapters[0].ayahs[1].startMs = 500;
    expect(() => validateReciterManifest(manifest)).toThrow("توقيت غير صالح");
  });
});

describe("audio library index", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("accepts a published reciter with an explicit list of available chapters", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      format: "dalil-audio-library/v1",
      version: "0.1.0",
      reciters: [{
        id: "test-reciter",
        nameAr: "قارئ اختبار",
        manifestUrl: "https://example.com/manifest.json",
        coverage: "verified-ayah-timings",
        status: "published",
        availableChapters: [1],
      }],
    }), { status: 200 })));

    await expect(loadAudioLibrary()).resolves.toMatchObject({ reciters: [{ id: "test-reciter", availableChapters: [1] }] });
  });
});
