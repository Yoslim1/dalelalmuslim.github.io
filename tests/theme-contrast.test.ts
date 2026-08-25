import { describe, expect, it } from "vitest";

import { contrastRatio } from "@/lib/ui/contrast";
import { colorSchemes } from "@/lib/ui/theme";

describe("تباين رموز سكينة", () => {
  it("يحافظ على تباين 4.5:1 على الأقل للنصوص الأساسية والثانوية في السمتين", () => {
    for (const scheme of Object.values(colorSchemes)) {
      expect(contrastRatio(scheme.ink, scheme.surfaceRaised)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(scheme.muted, scheme.surfaceRaised)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(scheme.onPrimary, scheme.primary)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
