import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const surahDirectory = path.join(projectRoot, "lib/content/raw/quran/surahs");
const referencePath = process.argv[2];
const outputPath = path.join(projectRoot, "docs/generated/quran-content-audit.json");
const basmalah = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

function normalizeForRasmComparison(value) {
  return value
    .normalize("NFC")
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/[\u200B-\u200F\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeForSkeletonComparison(value) {
  return normalizeForRasmComparison(value.replace(/ىٰ/g, ""))
    .replace(/ـ/g, "")
    .replace(/[إأٱآ]/g, "ا")
    .replace(/ء/g, "")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, "");
}

function referenceTextForComparison(surahNumber, ayahNumber, text) {
  if (surahNumber !== 1 && surahNumber !== 9 && ayahNumber === 1) {
    const normalizedPrefix = normalizeForRasmComparison(basmalah);
    const normalizedText = normalizeForRasmComparison(text);
    if (normalizedText.startsWith(normalizedPrefix)) {
      return normalizedText.slice(normalizedPrefix.length).trim();
    }
  }

  return normalizeForRasmComparison(text);
}

async function loadLocalSurahs() {
  const entries = (await readdir(surahDirectory)).filter((entry) => /^\d{3}\.json$/.test(entry)).sort();
  const surahs = [];

  for (const entry of entries) {
    const contents = await readFile(path.join(surahDirectory, entry), "utf8");
    surahs.push(JSON.parse(contents));
  }

  return surahs;
}

function validateLocalStructure(surahs) {
  const issues = [];
  if (surahs.length !== 114) issues.push(`expected 114 local surahs, received ${surahs.length}`);

  let ayahCount = 0;
  surahs.forEach((ayahs, index) => {
    const expectedSurah = index + 1;
    ayahs.forEach((ayah, ayahIndex) => {
      ayahCount += 1;
      if (ayah.chapter !== expectedSurah) issues.push(`surah ${expectedSurah}: invalid chapter at ayah index ${ayahIndex}`);
      if (ayah.verse !== ayahIndex + 1) issues.push(`surah ${expectedSurah}: non-contiguous ayah number at index ${ayahIndex}`);
      if (typeof ayah.text !== "string" || ayah.text.trim().length === 0) issues.push(`surah ${expectedSurah}: empty ayah ${ayahIndex + 1}`);
    });
  });

  if (ayahCount !== 6236) issues.push(`expected 6236 local ayahs, received ${ayahCount}`);
  return { ayahCount, issues };
}

function validateReferenceStructure(surahs) {
  const issues = [];
  if (surahs.length !== 114) issues.push(`expected 114 reference surahs, received ${surahs.length}`);

  let ayahCount = 0;
  surahs.forEach((surah, index) => {
    if (surah.number !== index + 1) issues.push(`reference surah index ${index}: unexpected number ${surah.number}`);
    ayahCount += surah.ayahs.length;
  });

  if (ayahCount !== 6236) issues.push(`expected 6236 reference ayahs, received ${ayahCount}`);
  return { ayahCount, issues };
}

async function main() {
  if (!referencePath) throw new Error("Usage: node scripts/audit-quran-content.mjs /path/to/reference.json");

  const [localSurahs, rawReference] = await Promise.all([
    loadLocalSurahs(),
    readFile(referencePath, "utf8"),
  ]);
  const reference = JSON.parse(rawReference);
  const referenceSurahs = reference?.data?.surahs;
  if (!Array.isArray(referenceSurahs)) throw new Error("Reference does not contain data.surahs");

  const local = validateLocalStructure(localSurahs);
  const referenceAudit = validateReferenceStructure(referenceSurahs);
  const rasmMismatches = [];
  const skeletonMismatches = [];

  for (let surahIndex = 0; surahIndex < Math.min(localSurahs.length, referenceSurahs.length); surahIndex += 1) {
    const localAyahs = localSurahs[surahIndex];
    const referenceAyahs = referenceSurahs[surahIndex].ayahs;
    if (localAyahs.length !== referenceAyahs.length) {
      skeletonMismatches.push({ surah: surahIndex + 1, type: "ayah_count", local: localAyahs.length, reference: referenceAyahs.length });
      continue;
    }

    localAyahs.forEach((localAyah, ayahIndex) => {
      const referenceAyah = referenceAyahs[ayahIndex];
      const localText = normalizeForRasmComparison(localAyah.text);
      const referenceText = referenceTextForComparison(surahIndex + 1, ayahIndex + 1, referenceAyah.text);
      if (localText !== referenceText) {
        rasmMismatches.push({
          surah: surahIndex + 1,
          ayah: ayahIndex + 1,
          type: "rasm_difference",
          local: localText,
          reference: referenceText,
        });
      }

      if (normalizeForSkeletonComparison(localText) !== normalizeForSkeletonComparison(referenceText)) {
        skeletonMismatches.push({
          surah: surahIndex + 1,
          ayah: ayahIndex + 1,
          type: "word_skeleton_difference",
          local: normalizeForSkeletonComparison(localText),
          reference: normalizeForSkeletonComparison(referenceText),
        });
      }
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    reference: "AlQuran Cloud quran-uthmani (retrieved for audit only)",
    localSurahCount: localSurahs.length,
    localAyahCount: local.ayahCount,
    referenceSurahCount: referenceSurahs.length,
    referenceAyahCount: referenceAudit.ayahCount,
    localStructureIssues: local.issues,
    referenceStructureIssues: referenceAudit.issues,
    rasmMismatchCount: rasmMismatches.length,
    rasmMismatchSamples: rasmMismatches.slice(0, 20),
    wordSkeletonMismatchCount: skeletonMismatches.length,
    wordSkeletonMismatchSamples: skeletonMismatches.slice(0, 20),
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(report, null, 2));

  if (local.issues.length || referenceAudit.issues.length || skeletonMismatches.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
