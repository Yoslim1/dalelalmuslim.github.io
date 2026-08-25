import { describe, expect, it } from "vitest";

import { createDefaultAppState, normalizeAppState } from "@/lib/state/app-state";

const date = new Date("2026-08-25T12:00:00.000Z");

describe("settings migration", () => {
  it("migrates a schema v2 state without losing existing preferences", () => {
    const legacy = createDefaultAppState(date);
    const migrated = normalizeAppState({
      ...legacy,
      schemaVersion: 2,
      settings: { theme: "dark", tasbeehTarget: 175 },
    }, date);

    expect(migrated.schemaVersion).toBe(3);
    expect(migrated.settings).toEqual({
      theme: "dark",
      tasbeehTarget: 175,
      hapticsEnabled: true,
      quranTextSize: 22,
    });
  });

  it("normalizes unsafe settings while preserving valid new values", () => {
    const normalized = normalizeAppState({
      settings: { theme: "invalid", tasbeehTarget: 0, hapticsEnabled: false, quranTextSize: 48 },
      daily: { dateKey: "2026-08-25", tasbeehCount: 0, completedAzkarIds: [] },
    }, date);

    expect(normalized.settings).toEqual({
      theme: "system",
      tasbeehTarget: 100,
      hapticsEnabled: false,
      quranTextSize: 22,
    });
  });
});
