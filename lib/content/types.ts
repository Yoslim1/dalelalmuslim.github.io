export type QuranAyah = {
  chapter: number;
  verse: number;
  text: string;
};

export type SurahMeta = {
  number: number;
  name: string;
  ayahCount: number;
};

export type AzkarItem = {
  id: string;
  text: string;
  reference?: string;
  repeatTarget: number;
};

export type AzkarCategory = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  period: string;
  azkar: AzkarItem[];
};

export type DuaItem = {
  id: number | string;
  text: string;
  referenceText?: string;
  sourceLabel?: string;
  categorySlug?: string;
  categoryTitle?: string;
};

export type DuaCategory = {
  slug: string;
  title: string;
  description?: string;
  icon?: string;
  items: DuaItem[];
};

export type AllahName = {
  name: string;
  desc: string;
};

export type Story = {
  id: string | number;
  title: string;
  story?: string;
  lesson?: string;
  content?: string;
  excerpt?: string;
  categorySlug?: string;
};

export type DailyAyah = {
  id?: number;
  surah: string;
  verseNumber: number;
  text: string;
};
