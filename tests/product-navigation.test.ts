import { describe, expect, it } from "vitest";

import { homeTools, primaryTabs } from "@/lib/navigation/product-navigation";

describe("تنقل المنتج", () => {
  it("يحصر الشريط السفلي في الأقسام التعبدية الأربعة ولا يعرض المزيد", () => {
    expect(primaryTabs.map((tab) => tab.route)).toEqual(["quran", "duas", "azkar", "index"]);
    expect(primaryTabs.some((tab) => tab.route === ("more" as never))).toBe(false);
  });

  it("يبقي الأدوات الثانوية قابلة للوصول من الرئيسية", () => {
    expect(homeTools.map((tool) => tool.href)).toEqual(expect.arrayContaining(["/masbaha", "/tasks", "/names", "/stories", "/stats"]));
  });
});
