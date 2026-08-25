import { AZKAR_CATEGORY as afterPrayer } from "@/lib/content/raw/azkar/after-prayer";
import { AZKAR_CATEGORY as evening } from "@/lib/content/raw/azkar/evening";
import { AZKAR_CATEGORY as morning } from "@/lib/content/raw/azkar/morning";
import { DUAS_JSON } from "@/lib/content/raw/duas/data";
import { ALLAH_NAMES } from "@/lib/content/raw/names/data";
import { STORIES_JSON } from "@/lib/content/raw/stories/data";

import type {
  AllahName,
  AzkarCategory,
  DuaCategory,
  Story,
} from "@/lib/content/types";

export { dailyAyahList, dailyMessages, getDailyAyah, getDailyIndex, getDailyMessage } from "@/lib/content/daily";
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
type RawDua = { id?: string | number; dua?: string; reference?: unknown; source?: string };
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
    sourceLabel: item.source ? `المصدر المسجل: ${item.source}` : undefined,
    categorySlug: `dua-category-${categoryIndex + 1}`,
    categoryTitle: title,
  })),
}));
export const stories = ((STORIES_JSON as unknown as { categories?: Array<{ stories?: Story[] }> }).categories ?? [])
  .flatMap((category) => category.stories ?? []);
export const allahNames = (ALLAH_NAMES.ar ?? []) as AllahName[];
