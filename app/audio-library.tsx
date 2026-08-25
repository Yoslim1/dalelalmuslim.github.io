import { ScrollView, StyleSheet } from "react-native";

import { ReciterDownloadCard } from "@/components/audio/reciter-download-card";
import { AppScreen, BackHeader } from "@/components/dalil-ui";

export default function AudioLibraryScreen() {
  return <AppScreen><ScrollView contentContainerStyle={styles.content}><BackHeader subtitle="اختر قارئًا ثم نزّل السور التي يتيحها فقط" title="مكتبة التلاوات" /><ReciterDownloadCard /></ScrollView></AppScreen>;
}

const styles = StyleSheet.create({ content: { gap: 14, paddingBottom: 28 } });
