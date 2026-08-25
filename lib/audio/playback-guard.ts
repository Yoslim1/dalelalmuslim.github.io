export type LocalAudioSource = {
  uri: string | null;
  size: number;
};

export type PlaybackSignal = {
  isLoaded: boolean;
  playing: boolean;
  currentTime: number;
};

export type LocalAudioSourceValidation =
  | { ok: true; uri: string }
  | { ok: false; message: string };

export function validateLocalAudioSource(source: LocalAudioSource): LocalAudioSourceValidation {
  if (!source.uri || source.size <= 0) {
    return { ok: false, message: "ملف التلاوة غير مكتمل. احذفه ثم أعد تنزيله." };
  }
  if (!source.uri.startsWith("file://")) {
    return { ok: false, message: "تعذر قراءة ملف التلاوة. احذفه ثم أعد تنزيله." };
  }
  return { ok: true, uri: source.uri };
}

/** لا تؤكد الواجهة التشغيل حتى يصبح الملف محملًا ويظهر دليل تشغيل فعلي. */
export function hasPlaybackStarted(status: PlaybackSignal): boolean {
  return status.isLoaded && (status.playing || status.currentTime > 0);
}
