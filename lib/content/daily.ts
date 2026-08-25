import dailyAyahs from "@/lib/content/raw/home/ayahs.json";
import { DAILY_MESSAGES } from "@/lib/content/raw/home/messages";
import type { DailyAyah } from "@/lib/content/types";

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
