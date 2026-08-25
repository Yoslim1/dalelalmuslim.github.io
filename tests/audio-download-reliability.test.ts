import { describe, expect, it, vi } from "vitest";

import { hashFileBytes } from "@/lib/audio/file-digest";
import { mapAudioDownloadError } from "@/lib/audio/download-error";
import { hasPlaybackStarted, validateLocalAudioSource } from "@/lib/audio/playback-guard";

describe("audio download reliability", () => {
  it("passes a Uint8Array from File.bytes to the native digest adapter instead of a raw ArrayBuffer", async () => {
    const file = { bytes: vi.fn().mockResolvedValue(new Uint8Array([0, 15, 255])) };
    const digest = vi.fn().mockResolvedValue(new Uint8Array([171, 205]).buffer);

    await expect(hashFileBytes(file, digest)).resolves.toBe("abcd");
    expect(digest).toHaveBeenCalledWith(expect.any(Uint8Array));
    expect(digest).toHaveBeenCalledWith(new Uint8Array([0, 15, 255]));
  });

  it("never exposes a Kotlin or Crypto bridge exception to the worshipper", () => {
    expect(mapAudioDownloadError(new Error("[digest] Cannot convert '[object ArrayBuffer]' to a Kotlin type"))).toEqual({
      code: "integrity",
      message: "تعذر التحقق من سلامة التلاوة. احذف التنزيل وأعد المحاولة.",
    });
  });

  it("gives a constructive recovery message for a download failure", () => {
    expect(mapAudioDownloadError(new Error("UnableToDownload: 503"))).toEqual({
      code: "network",
      message: "تعذر تنزيل التلاوة الآن. تحقق من اتصالك ثم أعد المحاولة.",
    });
  });

  it("rejects an empty or unreadable local audio file before creating a player", () => {
    expect(validateLocalAudioSource({ uri: "file:///data/user/0/app/files/001.mp3", size: 0 })).toEqual({
      ok: false,
      message: "ملف التلاوة غير مكتمل. احذفه ثم أعد تنزيله.",
    });
    expect(validateLocalAudioSource({ uri: "content://unreadable/001.mp3", size: 1024 })).toEqual({
      ok: false,
      message: "تعذر قراءة ملف التلاوة. احذفه ثم أعد تنزيله.",
    });
  });

  it("requires a loaded player with an observable playing signal before confirming playback", () => {
    expect(hasPlaybackStarted({ isLoaded: true, playing: false, currentTime: 0 })).toBe(false);
    expect(hasPlaybackStarted({ isLoaded: true, playing: true, currentTime: 0 })).toBe(true);
    expect(hasPlaybackStarted({ isLoaded: true, playing: false, currentTime: 0.25 })).toBe(true);
  });
});
