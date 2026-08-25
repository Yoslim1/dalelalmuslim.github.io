import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const appRoot = process.cwd();
const audioRoot = "/home/ubuntu/dalil-almuslim-audio";
const releaseUrl = "https://github.com/Yoslim1/dalil-almuslim-audio/releases/download/v0.1.0-pilot/aaqib-azeez-001.mp3";
const audioSha256 = "a819a37b86473f01d8f8ed477035bd737bde8530e6efc9486fe9448084bf0bdf";
const timings = [
  [1, 400, 7800], [2, 7800, 17700], [3, 17700, 24900], [4, 24900, 29900],
  [5, 29900, 40400], [6, 40400, 49900], [7, 49900, 73400],
];

function normalizeAyah(text) {
  return text.normalize("NFC")
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06EDـ]/g, "")
    .replace(/[إأٱآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, "");
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

const source = JSON.parse(await readFile(path.join(appRoot, "lib/content/raw/quran/surahs/001.json"), "utf8"));
const ayahs = timings.map(([ayah, startMs, endMs]) => ({
  ayah,
  startMs,
  endMs,
  textSha256: sha256(normalizeAyah(source[ayah - 1].text)),
}));

const manifest = {
  format: "dalil-audio-reciter/v1",
  version: "0.1.0-pilot",
  reciter: {
    id: "aaqib-azeez",
    nameAr: "عاقب عزيز",
    nameEn: "Aaqib Azeez",
    license: {
      name: "CC BY-SA 4.0",
      url: "https://creativecommons.org/licenses/by-sa/4.0/",
      attribution: "Aaqib Azeez, Chapter 1 Al-Fatiha (Mujawwad), Wikimedia Commons, CC BY-SA 4.0",
    },
  },
  chapters: [{ chapter: 1, downloadUrl: releaseUrl, sha256: audioSha256, durationMs: 76968, ayahs }],
};

await mkdir(path.join(audioRoot, "reciters", "aaqib-azeez"), { recursive: true });
await writeFile(path.join(audioRoot, "reciters", "aaqib-azeez", "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log("Generated Aaqib Azeez Al-Fatiha pilot manifest with 7 ayah timings.");
