import type MaterialIcons from "@expo/vector-icons/MaterialIcons";

export type PrimaryTab = {
  route: "index" | "quran" | "masbaha" | "azkar" | "duas";
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  central?: boolean;
};

export const primaryTabs: readonly PrimaryTab[] = [
  { route: "index", label: "الرئيسية", icon: "home" },
  { route: "quran", label: "القرآن", icon: "menu-book" },
  { route: "masbaha", label: "المسبحة", icon: "touch-app", central: true },
  { route: "azkar", label: "الأذكار", icon: "wb-sunny" },
  { route: "duas", label: "الأدعية", icon: "auto-stories" },
];

export const drawerTools = [
  { href: "/audio-library", icon: "headphones" as const, title: "مكتبة التلاوات", subtitle: "قراء وتنزيلاتك الاختيارية" },
  { href: "/tasks", icon: "check-circle-outline" as const, title: "المهام اليومية", subtitle: "وردك وقائمة إنجازك" },
  { href: "/stats", icon: "insights" as const, title: "إحصاءاتك", subtitle: "تقدمك المحلي" },
  { href: "/names", icon: "spa" as const, title: "أسماء الله الحسنى", subtitle: "معانٍ وتدبر" },
  { href: "/stories", icon: "menu-book" as const, title: "قصص وعبر", subtitle: "حكمة وموعظة" },
  { href: "/settings", icon: "settings", title: "الإعدادات", subtitle: "المظهر والقراءة والبيانات" },
] as const;

export const homeTools = drawerTools.filter((item) => item.href !== "/audio-library" && item.href !== "/settings");
