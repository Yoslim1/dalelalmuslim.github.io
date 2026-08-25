import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { useChapterAudioAction } from "@/components/audio/use-chapter-audio-action";
import { palette } from "@/lib/ui/theme";

type Props = { chapter: number; chapterName: string };

export function ChapterAudioAction({ chapter, chapterName }: Props) {
  const action = useChapterAudioAction(chapter, chapterName);
  if (action.actionState === "unavailable") return <View style={styles.placeholder} accessibilityLabel="لا توجد تلاوة منشورة لهذه السورة" />;
  if (action.actionState === "downloading") return <View style={styles.action}><ActivityIndicator color={palette.primary} size="small" /><Text style={styles.busyText}>جارٍ التنزيل</Text></View>;
  const isPlay = action.actionState === "play";
  const isError = action.actionState === "error";
  const label = isPlay ? "تشغيل" : isError ? "إعادة التنزيل" : "تنزيل";
  const icon = isPlay ? "play-arrow" : isError ? "refresh" : "download";
  return <Pressable accessibilityLabel={`${label} تلاوة سورة ${chapterName}`} accessibilityRole="button" onPress={() => void (isPlay ? action.play() : action.download())} style={({ pressed }) => [styles.action, isPlay && styles.playAction, isError && styles.errorAction, pressed && styles.pressed]}><MaterialIcons color={isPlay ? "#FFFFFF" : isError ? palette.danger : palette.primary} name={icon} size={20} /><Text style={[styles.text, isPlay && styles.playText, isError && styles.errorText]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  placeholder: { minWidth: 88 },
  action: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: 16, flexDirection: "row", gap: 5, justifyContent: "center", minHeight: 48, minWidth: 88, paddingHorizontal: 10 },
  playAction: { backgroundColor: palette.primary },
  errorAction: { backgroundColor: "#FCE9E9" },
  text: { color: palette.primary, fontSize: 12, fontWeight: "900" },
  playText: { color: "#FFFFFF" },
  errorText: { color: palette.danger },
  busyText: { color: palette.primary, fontSize: 11, fontWeight: "800" },
  pressed: { opacity: 0.76, transform: [{ scale: 0.97 }] },
});
