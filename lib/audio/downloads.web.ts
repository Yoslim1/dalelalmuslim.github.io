type DownloadSpec = {
  reciterId: string;
  chapter: number;
  downloadUrl: string;
  sha256: string;
};

export async function getDownloadedAudioUri(): Promise<string | null> {
  return null;
}

export async function getDownloadedAudioFile(): Promise<{ uri: string; size: number } | null> {
  return null;
}

export async function downloadChapterAudio(_spec: DownloadSpec, _onProgress?: (progress: number) => void): Promise<string> {
  throw new Error("تنزيل التلاوات الدائم متاح في تطبيق Android وiOS فقط.");
}

export async function deleteDownloadedAudio(): Promise<void> {
  return undefined;
}
