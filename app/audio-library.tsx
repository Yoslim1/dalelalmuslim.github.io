import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { AppScreen, BackHeader, Surface } from "@/components/dalil-ui";
import { loadAudioLibrary } from "@/lib/audio/library";
import type { AudioLibraryManifest } from "@/lib/audio/types";
import { palette } from "@/lib/ui/theme";

export default function AudioLibraryScreen() {
  const [library, setLibrary] = useState<AudioLibraryManifest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadAudioLibrary().then(setLibrary).catch(() => setError("تعذر الوصول إلى فهرس التلاوات."));
  }, []);

  return <AppScreen><FlatList contentContainerStyle={styles.content} data={library?.reciters ?? []} keyExtractor={(item) => item.id} ListHeaderComponent={<><BackHeader subtitle="تنزيل اختياري · تشغيل دون اتصال بعد التنزيل" title="مكتبة التلاوات" />{!library && !error ? <View style={styles.loading}><ActivityIndicator color={palette.primary} /><Text style={styles.loadingText}>جارٍ قراءة الفهرس المحلي…</Text></View> : null}{error ? <Surface style={styles.message}><MaterialIcons color={palette.danger} name="error-outline" size={24} /><Text style={styles.messageText}>{error}</Text></Surface> : null}{library?.reciters.length === 0 ? <Surface style={styles.message}><MaterialIcons color={palette.primary} name="verified-user" size={24} /><View style={styles.messageCopy}><Text style={styles.messageTitle}>لا توجد تلاوة متاحة بعد</Text><Text style={styles.messageText}>لا ينشر التطبيق قارئًا إلا بعد توثيق رخصة التسجيل، واكتمال التوافق آيةً بآية، والتحقق من سلامة الملف.</Text></View></Surface> : null}</>} renderItem={({ item }) => <Surface style={styles.reciter}><View style={styles.reciterCopy}><Text style={styles.reciterName}>{item.nameAr}</Text><Text style={styles.reciterDetail}>توقيتات آيةً بآية متحققة</Text></View><View style={styles.reciterIcon}><MaterialIcons color={palette.primary} name="person" size={23} /></View></Surface>} /></AppScreen>;
}

const styles = StyleSheet.create({ content: { gap: 12, paddingBottom: 28 }, loading: { alignItems: "center", gap: 10, justifyContent: "center", padding: 30 }, loadingText: { color: palette.muted, fontSize: 13 }, message: { alignItems: "center", flexDirection: "row", gap: 12, marginHorizontal: 20, padding: 17 }, messageCopy: { alignItems: "flex-end", flex: 1 }, messageTitle: { color: palette.ink, fontSize: 16, fontWeight: "900", textAlign: "right" }, messageText: { color: palette.muted, flex: 1, fontSize: 13, lineHeight: 21, textAlign: "right" }, reciter: { alignItems: "center", flexDirection: "row", marginHorizontal: 20, padding: 16 }, reciterCopy: { alignItems: "flex-end", flex: 1, marginLeft: 12 }, reciterName: { color: palette.ink, fontSize: 17, fontWeight: "900", textAlign: "right" }, reciterDetail: { color: palette.muted, fontSize: 12, marginTop: 3, textAlign: "right" }, reciterIcon: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: 16, height: 46, justifyContent: "center", width: 46 } });
