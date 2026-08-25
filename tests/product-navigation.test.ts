import { describe, expect, it } from "vitest";

import { drawerTools, homeTools, primaryTabs } from "@/lib/navigation/product-navigation";

describe("تنقل المنتج", () => {
  it("يعرض خمسة تبويبات واضحة ويضع المسبحة في المركز دون جعل المزيد تبويبًا", () => {
    expect(primaryTabs.map((tab) => tab.route)).toEqual(["index", "quran", "masbaha", "azkar", "duas"]);
    expect(primaryTabs.find((tab) => tab.central)?.route).toBe("masbaha");
    expect(primaryTabs.some((tab) => tab.route === ("more" as never))).toBe(false);
  });

  it("يبقي الأدوات الثانوية قابلة للوصول من الرئيسية والدرج مع وجود الإعدادات في الدرج", () => {
    expect(homeTools.map((tool) => tool.href)).toEqual(expect.arrayContaining(["/tasks", "/names", "/stories", "/stats"]));
    expect(drawerTools.map((tool) => tool.href)).toEqual(expect.arrayContaining(["/audio-library", "/settings", "/tasks", "/names", "/stories", "/stats"]));
  });
});
