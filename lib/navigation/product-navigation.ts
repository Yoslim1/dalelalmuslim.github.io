import type MaterialIcons from "@expo/vector-icons/MaterialIcons";

export type PrimaryTab = {
  route: "index" | "quran" | "azkar" | "duas";
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

export const primaryTabs: readonly PrimaryTab[] = [
  { route: "quran", label: "القرآن", icon: "menu-book" },
  { route: "duas", label: "الأدعية", icon: "auto-stories" },
  { route: "azkar", label: "الأذكار", icon: "wb-sunny" },
  { route: "index", label: "الرئيسية", icon: "home" },
];

export const homeTools = [
  { href: "/masbaha", icon: "touch-app" as const, title: "المسبحة", subtitle: "عدادك اليومي" },
  { href: "/tasks", icon: "check-circle-outline" as const, title: "المهام", subtitle: "ورد اليوم" },
  { href: "/names", icon: "spa" as const, title: "أسماء الله", subtitle: "معانٍ وتدبر" },
  { href: "/stories", icon: "menu-book" as const, title: "قصص وعبر", subtitle: "اقرأ بتأنٍ" },
  { href: "/stats", icon: "insights" as const, title: "إحصاءاتك", subtitle: "تقدمك المحلي" },
] as const;
