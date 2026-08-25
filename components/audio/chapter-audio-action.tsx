import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { useChapterAudioAction } from "@/components/audio/use-chapter-audio-action";
import { motion, palette, shapes, spacing } from "@/lib/ui/theme";

type Props = { chapter: number; chapterName: string };

export function ChapterAudioAction({ chapter, chapterName }: Props) {
  const action = useChapterAudioAction(chapter, chapterName);
  if (action.actionState === "unavailable") return <View accessibilityLabel="لا توجد تلاوة منشورة لهذه السورة" style={styles.placeholder} />;
  if (action.actionState === "downloading") return <View accessibilityLabel="جارٍ تنزيل التلاوة" style={styles.action}><ActivityIndicator color={palette.primary} size="small" /><Text style={styles.busyText}>جارٍ التنزيل</Text></View>;
  const isPlay = action.actionState === "play";
  const isError = action.actionState === "error";
  const label = isPlay ? "تشغيل" : isError ? "إعادة" : "تنزيل";
  const icon = isPlay ? "play-arrow" : isError ? "refresh" : "download";
  return (
    <Pressable accessibilityHint={isPlay ? "تشغيل التلاوة المحفوظة" : "حفظ التلاوة على جهازك"} accessibilityLabel={`${label} تلاوة سورة ${chapterName}`} accessibilityRole="button" onPress={() => void (isPlay ? action.play() : action.download())} style={({ pressed }) => [styles.action, isPlay && styles.playAction, isError && styles.errorAction, pressed && styles.pressed]}>
      <MaterialIcons color={isPlay ? palette.onPrimary : isError ? palette.danger : palette.primary} name={icon} size={20} />
      <Text style={[styles.text, isPlay && styles.playText, isError && styles.errorText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  placeholder: { minWidth: 88 },
  action: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: shapes.full, flexDirection: "row", gap: 5, justifyContent: "center", minHeight: 48, minWidth: 88, paddingHorizontal: spacing.sm },
  playAction: { backgroundColor: palette.primary },
  errorAction: { backgroundColor: palette.dangerSoft },
  text: { color: palette.primary, fontSize: 12, fontWeight: "900" },
  playText: { color: palette.onPrimary },
  errorText: { color: palette.danger },
  busyText: { color: palette.primary, fontSize: 11, fontWeight: "800" },
  pressed: { opacity: motion.pressOpacity, transform: [{ scale: motion.pressScale }] },
});
