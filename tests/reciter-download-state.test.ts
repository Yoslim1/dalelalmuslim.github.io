import { describe, expect, it } from "vitest";

import {
  getChapterActionState,
  getReciterCoverageLabel,
  getReciterDownloadLabel,
  isCompleteQuranCoverage,
} from "@/lib/audio/reciter-download-state";

describe("reciter download state", () => {
  it("labels partial coverage accurately and never calls it a full Quran download", () => {
    expect(getReciterCoverageLabel([1])).toBe("السور المتاحة: 1 من 114");
    expect(getReciterDownloadLabel([1])).toBe("تنزيل السور المتاحة (1)");
    expect(isCompleteQuranCoverage([1])).toBe(false);
  });

  it("only calls the bulk action a full Quran download when all 114 chapters are available", () => {
    const allChapters = Array.from({ length: 114 }, (_, index) => index + 1);
    expect(isCompleteQuranCoverage(allChapters)).toBe(true);
    expect(getReciterDownloadLabel(allChapters)).toBe("تنزيل القرآن كله (114 سورة)");
  });

  it("selects one explicit action state per chapter", () => {
    expect(getChapterActionState({ available: false, downloadedUri: null, downloading: false, failed: false })).toBe("unavailable");
    expect(getChapterActionState({ available: true, downloadedUri: null, downloading: true, failed: false })).toBe("downloading");
    expect(getChapterActionState({ available: true, downloadedUri: null, downloading: false, failed: true })).toBe("error");
    expect(getChapterActionState({ available: true, downloadedUri: null, downloading: false, failed: false })).toBe("download");
    expect(getChapterActionState({ available: true, downloadedUri: "file://001.mp3", downloading: false, failed: false })).toBe("play");
  });
});
