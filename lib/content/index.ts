import { AZKAR_CATEGORY as afterPrayer } from "@/lib/content/raw/azkar/after-prayer";
import { AZKAR_CATEGORY as evening } from "@/lib/content/raw/azkar/evening";
import { AZKAR_CATEGORY as morning } from "@/lib/content/raw/azkar/morning";
import { DUAS_JSON } from "@/lib/content/raw/duas/data";
import dailyAyahs from "@/lib/content/raw/home/ayahs.json";
import { DAILY_MESSAGES } from "@/lib/content/raw/home/messages";
import { ALLAH_NAMES } from "@/lib/content/raw/names/data";
import { STORIES_JSON } from "@/lib/content/raw/stories/data";

import { getSurah, quranSurahs, surahCatalog } from "@/lib/content/quran";
import type {
  AllahName,
  AzkarCategory,
  DailyAyah,
  DuaCategory,
  Story,
} from "@/lib/content/types";

export { getSurah, quranSurahs, surahCatalog };
export type * from "@/lib/content/types";

const rawAzkarCategories = [morning, evening, afterPrayer] as Array<{
  slug: string;
  title: string;
  preview?: string;
  items?: AzkarCategory["azkar"];
}>;

export const azkarCategories: AzkarCategory[] = rawAzkarCategories.map((category) => ({
  slug: category.slug,
  title: category.title,
  description: category.preview ?? "ورد محفوظ محليًا",
  icon: "wb-sunny",
  period: category.title,
  azkar: category.items ?? [],
}));
type RawDua = { id?: string | number; dua?: string; reference?: unknown };
const rawDuaCategories = (DUAS_JSON as unknown as { categories?: Record<string, RawDua[]> }).categories ?? {};

function formatDuaReference(reference: unknown): string | undefined {
  if (typeof reference === "string") return reference;
  if (!reference || typeof reference !== "object") return undefined;
  const value = reference as { surah?: { name?: string }; ayah?: number | string; text?: string };
  if (value.surah?.name) return `سورة ${value.surah.name}${value.ayah ? ` · آية ${value.ayah}` : ""}`;
  return value.text;
}

export const duaCategories: DuaCategory[] = Object.entries(rawDuaCategories).map(([title, rawItems], categoryIndex) => ({
  slug: `dua-category-${categoryIndex + 1}`,
  title,
  description: `${rawItems.length} دعاء محفوظ محليًا`,
  icon: "auto-stories",
  items: rawItems.map((item, itemIndex) => ({
    id: item.id ?? `${categoryIndex + 1}-${itemIndex + 1}`,
    text: item.dua ?? "",
    referenceText: formatDuaReference(item.reference),
    categorySlug: `dua-category-${categoryIndex + 1}`,
    categoryTitle: title,
  })),
}));
export const stories = ((STORIES_JSON as unknown as { categories?: Array<{ stories?: Story[] }> }).categories ?? [])
  .flatMap((category) => category.stories ?? []);
export const allahNames = (ALLAH_NAMES.ar ?? []) as AllahName[];
export const dailyMessages = DAILY_MESSAGES.map((item) => item.message);
export const dailyAyahList = dailyAyahs as DailyAyah[];

export function getDailyIndex(length: number, date = new Date()): number {
  if (!length) return 0;
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return Math.abs(day) % length;
}

export function getDailyMessage(date = new Date()): string {
  return dailyMessages[getDailyIndex(dailyMessages.length, date)] ?? "اذكر الله يطمئن قلبك.";
}

export function getDailyAyah(date = new Date()): DailyAyah | null {
  return dailyAyahList[getDailyIndex(dailyAyahList.length, date)] ?? null;
}
