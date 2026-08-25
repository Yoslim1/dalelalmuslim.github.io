import * as Crypto from "expo-crypto";
import { Directory, File, Paths } from "expo-file-system";

import { hashFileBytes } from "@/lib/audio/file-digest";

type DownloadSpec = {
  reciterId: string;
  chapter: number;
  downloadUrl: string;
  sha256: string;
};

export type DownloadedAudioFile = {
  uri: string;
  size: number;
};

function filename(chapter: number) {
  return `${String(chapter).padStart(3, "0")}.mp3`;
}

async function sha256(file: { bytes: () => Promise<Uint8Array<ArrayBuffer>> }) {
  return hashFileBytes(file, (bytes) => Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, bytes));
}

function audioDirectory(reciterId: string) {
  return new Directory(Paths.document, "dalil-audio", reciterId);
}

export async function getDownloadedAudioUri(reciterId: string, chapter: number): Promise<string | null> {
  const file = await getDownloadedAudioFile(reciterId, chapter);
  return file?.uri ?? null;
}

export async function getDownloadedAudioFile(reciterId: string, chapter: number): Promise<DownloadedAudioFile | null> {
  const file = new File(audioDirectory(reciterId), filename(chapter));
  return file.exists ? { uri: file.uri, size: file.size } : null;
}

export async function downloadChapterAudio(spec: DownloadSpec, onProgress?: (progress: number) => void): Promise<string> {
  const directory = audioDirectory(spec.reciterId);
  directory.create({ idempotent: true, intermediates: true });
  const finalFile = new File(directory, filename(spec.chapter));
  const temporaryFile = new File(directory, `${filename(spec.chapter)}.partial`);
  if (temporaryFile.exists) temporaryFile.delete();
  if (finalFile.exists) finalFile.delete();
  onProgress?.(0);

  try {
    await File.downloadFileAsync(spec.downloadUrl, temporaryFile, { idempotent: true });
    onProgress?.(0.9);
    const digest = await sha256(temporaryFile);
    if (digest.toLowerCase() !== spec.sha256.toLowerCase()) {
      temporaryFile.delete();
      throw new Error("checksum_mismatch");
    }
    temporaryFile.move(finalFile);
    onProgress?.(1);
    return finalFile.uri;
  } catch (error) {
    if (temporaryFile.exists) temporaryFile.delete();
    throw error;
  }
}

export async function deleteDownloadedAudio(reciterId: string, chapter: number): Promise<void> {
  const file = new File(audioDirectory(reciterId), filename(chapter));
  if (file.exists) file.delete();
}
