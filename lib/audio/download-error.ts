export type AudioDownloadErrorCode = "network" | "storage" | "integrity" | "unsupported" | "unknown";

export type AudioDownloadUiError = {
  code: AudioDownloadErrorCode;
  message: string;
};

const messages: Record<AudioDownloadErrorCode, string> = {
  network: "تعذر تنزيل التلاوة الآن. تحقق من اتصالك ثم أعد المحاولة.",
  storage: "لا توجد مساحة كافية لحفظ التلاوة. حرر مساحة ثم أعد المحاولة.",
  integrity: "تعذر التحقق من سلامة التلاوة. احذف التنزيل وأعد المحاولة.",
  unsupported: "حفظ التلاوة للتشغيل دون اتصال متاح في Android وiOS فقط.",
  unknown: "تعذر تنزيل التلاوة. أعد المحاولة لاحقًا.",
};

export function mapAudioDownloadError(error: unknown): AudioDownloadUiError {
  const source = error instanceof Error ? error.message.toLowerCase() : "";
  let code: AudioDownloadErrorCode = "unknown";

  if (source.includes("cannot convert") || source.includes("digest") || source.includes("checksum") || source.includes("integrity")) {
    code = "integrity";
  } else if (source.includes("space") || source.includes("storage") || source.includes("disk")) {
    code = "storage";
  } else if (source.includes("unabletodownload") || source.includes("network") || source.includes("timeout") || /\b[45]\d\d\b/.test(source)) {
    code = "network";
  } else if (source.includes("android") || source.includes("ios") || source.includes("unsupported")) {
    code = "unsupported";
  }

  return { code, message: messages[code] };
}
