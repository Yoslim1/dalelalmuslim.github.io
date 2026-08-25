export type AudioLicense = {
  name: string;
  url: string;
  attribution: string;
};

export type AyahTiming = {
  ayah: number;
  startMs: number;
  endMs: number;
  textSha256: string;
};

export type ChapterAudio = {
  chapter: number;
  downloadUrl: string;
  sha256: string;
  durationMs: number;
  ayahs: AyahTiming[];
};

export type ReciterManifest = {
  format: "dalil-audio-reciter/v1";
  version: string;
  reciter: {
    id: string;
    nameAr: string;
    nameEn?: string;
    license: AudioLicense;
  };
  chapters: ChapterAudio[];
};

export type AudioLibraryEntry = {
  id: string;
  nameAr: string;
  manifestUrl: string;
  coverage: "verified-ayah-timings";
  status: "published" | "pending-license" | "disabled";
  availableChapters?: number[];
};

export type AudioLibraryManifest = {
  format: "dalil-audio-library/v1";
  version: string;
  reciters: AudioLibraryEntry[];
};
