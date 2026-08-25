import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useQuranAudio } from "@/lib/audio/player";
import { motion, palette, shapes, spacing } from "@/lib/ui/theme";

export function MiniQuranPlayer() {
  const { playback, togglePlayback } = useQuranAudio();
  const track = playback.track;
  if (!track) return null;

  return (
    <View accessibilityLabel={`التلاوة الحالية: سورة ${track.chapterName} بصوت ${track.reciterName}`} style={styles.shell}>
      <Pressable accessibilityLabel={`فتح سورة ${track.chapterName}`} accessibilityRole="button" onPress={() => router.push(`/quran/${track.chapter}` as never)} style={({ pressed }) => [styles.copyPressable, pressed && styles.pressed]}>
        <View style={styles.soundIcon}><MaterialIcons color={palette.onPrimary} name="graphic-eq" size={20} /></View>
        <View style={styles.copy}><Text numberOfLines={1} style={styles.title}>سورة {track.chapterName}</Text><Text numberOfLines={1} style={styles.subtitle}>{playback.playing ? "قيد التشغيل" : "متوقفة مؤقتًا"} · {track.reciterName}</Text></View>
      </Pressable>
      <Pressable accessibilityLabel={playback.playing ? "إيقاف التلاوة مؤقتًا" : "استئناف التلاوة"} accessibilityRole="button" onPress={togglePlayback} style={({ pressed }) => [styles.control, pressed && styles.pressed]}>
        <MaterialIcons color={palette.primary} name={playback.playing ? "pause" : "play-arrow"} size={25} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { alignItems: "center", backgroundColor: palette.primary, borderRadius: shapes.large, bottom: spacing.sm, elevation: 4, flexDirection: "row", left: spacing.md, minHeight: 68, padding: spacing.sm, position: "absolute", right: spacing.md, shadowColor: palette.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 10 },
  copyPressable: { alignItems: "center", flex: 1, flexDirection: "row" },
  soundIcon: { alignItems: "center", backgroundColor: "#FFFFFF24", borderRadius: shapes.medium, height: 44, justifyContent: "center", width: 44 },
  copy: { alignItems: "flex-end", flex: 1, marginLeft: spacing.sm },
  title: { color: palette.onPrimary, fontSize: 14, fontWeight: "900", textAlign: "right" },
  subtitle: { color: "#E5F7F0", fontSize: 11, marginTop: 2, textAlign: "right" },
  control: { alignItems: "center", backgroundColor: palette.surfaceRaised, borderRadius: shapes.full, height: 48, justifyContent: "center", marginLeft: spacing.xs, width: 48 },
  pressed: { opacity: motion.pressOpacity, transform: [{ scale: motion.pressScale }] },
});
