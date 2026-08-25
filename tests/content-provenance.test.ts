import { describe, expect, it } from "vitest";

import { getSurah } from "@/lib/content/quran";
import { DUAS_JSON } from "@/lib/content/raw/duas/data";

type QuranReference = { surah?: { number?: number }; ayah?: number | { from?: number; to?: number } };
type RawDua = { dua?: string; source?: string; reference?: unknown };

function isValidQuranReference(reference: unknown) {
  const references = Array.isArray(reference) ? reference : [reference];
  return references.every((entry) => {
    const value = entry as QuranReference;
    const chapter = value?.surah?.number;
    if (!chapter || chapter < 1 || chapter > 114) return false;
    const maxAyah = getSurah(chapter).length;
    if (typeof value.ayah === "number") return value.ayah >= 1 && value.ayah <= maxAyah;
    return Boolean(value.ayah && value.ayah.from && value.ayah.to && value.ayah.from >= 1 && value.ayah.to >= value.ayah.from && value.ayah.to <= maxAyah);
  });
}

describe("شفافية مصدر الأدعية", () => {
  const categories = (DUAS_JSON as unknown as { categories: Record<string, RawDua[]> }).categories;
  const items = Object.values(categories).flat();

  it("يبقي نصوص الأدعية ومصادرها المسجلة مع كل عنصر", () => {
    expect(items).toHaveLength(600);
    expect(items.every((item) => Boolean(item.dua?.trim() && item.source))).toBe(true);
  });

  it("يتحقق بنيويًا من إحالات الأدعية القرآنية إلى السورة والآية المحليتين", () => {
    const quranItems = items.filter((item) => item.source === "Quran");
    expect(quranItems.length).toBeGreaterThan(0);
    expect(quranItems.every((item) => isValidQuranReference(item.reference))).toBe(true);
  });
});
