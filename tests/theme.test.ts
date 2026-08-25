import { describe, expect, it } from "vitest";

import { colorSchemes, getPalette, motion, resolveThemePreference, shapes, spacing, typography } from "@/lib/ui/theme";

describe("نظام تصميم سكينة", () => {
  it("يوفر مخططين كاملين فاتحًا وداكنًا دون قيم ناقصة", () => {
    expect(getPalette("light")).toEqual(colorSchemes.light);
    expect(getPalette("dark")).toEqual(colorSchemes.dark);
    expect(colorSchemes.light.primary).not.toBe(colorSchemes.dark.primary);
    expect(Object.values(colorSchemes.light).every(Boolean)).toBe(true);
    expect(Object.values(colorSchemes.dark).every(Boolean)).toBe(true);
  });

  it("يثبت القياسات المشتركة للأهداف اللمسية والكتابة والحركة الهادئة", () => {
    expect(spacing.md).toBe(16);
    expect(shapes.full).toBeGreaterThan(100);
    expect(typography.body.lineHeight).toBeGreaterThan(typography.body.fontSize);
    expect(motion.pressScale).toBeGreaterThan(0.95);
  });

  it("يحل اختيار المظهر المحفوظ بطريقة حتمية مع سمة النظام", () => {
    expect(resolveThemePreference("light", "dark")).toBe("light");
    expect(resolveThemePreference("dark", "light")).toBe("dark");
    expect(resolveThemePreference("system", "dark")).toBe("dark");
    expect(resolveThemePreference("system", null)).toBe("light");
  });
});
