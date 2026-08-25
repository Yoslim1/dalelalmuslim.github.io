import { describe, expect, it, vi } from "vitest";

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: { getItem: vi.fn(), setItem: vi.fn() },
}));

import { allahNames, azkarCategories, duaCategories, stories } from "../lib/content";
import { dailyAyahList, dailyMessages, getDailyIndex } from "../lib/content/daily";
import { surahCatalog } from "../lib/content/quran";
import { createDefaultAppState, normalizeAppState } from "../lib/state/app-state";

describe("المحتوى المحلي", () => {
  it("يتضمن فهرس القرآن كاملًا دون شبكة", () => {
    expect(surahCatalog).toHaveLength(114);
    expect(surahCatalog[0]).toMatchObject({ number: 1, name: "الفاتحة", ayahCount: 7 });
    expect(surahCatalog[113].number).toBe(114);
  });

  it("يتضمن أذكارًا وأسماء الله والقصص والرسائل اليومية", () => {
    expect(azkarCategories).toHaveLength(3);
    expect(azkarCategories.every((category) => category.azkar.length > 0)).toBe(true);
    expect(duaCategories.length).toBeGreaterThan(0);
    expect(duaCategories.every((category) => category.items.length > 0)).toBe(true);
    expect(allahNames).toHaveLength(99);
    expect(stories.length).toBeGreaterThan(0);
    expect(dailyMessages.length).toBeGreaterThan(0);
    expect(dailyAyahList.length).toBeGreaterThan(0);
  });

  it("يختار عنصرًا يوميًا بصورة ثابتة في اليوم ذاته", () => {
    const date = new Date("2026-08-24T12:00:00");
    expect(getDailyIndex(11, date)).toBe(getDailyIndex(11, date));
    expect(getDailyIndex(0, date)).toBe(0);
  });
});

describe("الحالة المحلية", () => {
  it("تنشئ حالة افتراضية صالحة دون حساب أو خادم", () => {
    const state = createDefaultAppState(new Date("2026-08-24T12:00:00"));
    expect(state.schemaVersion).toBe(2);
    expect(state.audio.playbackSpeed).toBe(1);
    expect(state.tasks).toHaveLength(3);
    expect(state.daily.tasbeehCount).toBe(0);
  });

  it("يعيد ضبط الإحصاءات اليومية عند تغير اليوم مع الحفاظ على التفضيلات", () => {
    const state = normalizeAppState({
      settings: { theme: "dark", tasbeehTarget: 200 },
      daily: { dateKey: "2026-08-23", tasbeehCount: 55, completedAzkarIds: ["morning-1"] },
      favoriteDuaIds: ["a"],
    }, new Date("2026-08-24T12:00:00"));
    expect(state.settings).toEqual({ theme: "dark", tasbeehTarget: 200 });
    expect(state.daily.tasbeehCount).toBe(0);
    expect(state.favoriteDuaIds).toEqual(["a"]);
  });

  it("يرحل بيانات الإصدار السابق ويحتفظ بإعدادات الصوت الصالحة", () => {
    const state = normalizeAppState({
      schemaVersion: 1,
      daily: { dateKey: "2026-08-24", tasbeehCount: 3, completedAzkarIds: [] },
      audio: { selectedReciterId: "aaqib-azeez", playbackSpeed: 1.25 },
    }, new Date("2026-08-24T12:00:00"));
    expect(state.schemaVersion).toBe(2);
    expect(state.audio).toEqual({ selectedReciterId: "aaqib-azeez", playbackSpeed: 1.25 });
  });
});
