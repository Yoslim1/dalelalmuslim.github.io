import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen, BackHeader, Surface } from "@/components/dalil-ui";
import { azkarCategories } from "@/lib/content";
import { useAppState } from "@/lib/state/app-state";
import { palette } from "@/lib/ui/theme";

export default function AzkarSessionScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const category = azkarCategories.find((item) => item.slug === slug) ?? azkarCategories[0];
  const { state, setAzkarRepeat } = useAppState();
  if (!category) return null;
  return (
    <AppScreen>
      <FlatList
        contentContainerStyle={styles.content}
        data={category.azkar}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<BackHeader subtitle={`${category.azkar.length} أذكار محفوظة محليًا`} title={category.title} />}
        renderItem={({ item }) => {
          const count = state.azkarRepeats[item.id] ?? 0;
          const complete = count >= item.repeatTarget;
          return <Surface style={styles.card}><Text style={styles.dhikr}>{item.text}</Text>{item.reference ? <Text style={styles.reference}>{item.reference}</Text> : null}<View style={styles.controlRow}><Pressable accessibilityLabel="إنقاص العدد" onPress={() => setAzkarRepeat(item.id, Math.max(0, count - 1), item.repeatTarget)} style={styles.smallControl}><MaterialIcons color={palette.primary} name="remove" size={21} /></Pressable><Pressable accessibilityLabel="زيادة العدد" onPress={() => setAzkarRepeat(item.id, count + 1, item.repeatTarget)} style={[styles.countControl, complete && styles.countComplete]}><Text style={[styles.countText, complete && styles.countTextComplete]}>{count}/{item.repeatTarget}</Text></Pressable><Pressable accessibilityLabel="زيادة العدد" onPress={() => setAzkarRepeat(item.id, count + 1, item.repeatTarget)} style={styles.smallControl}><MaterialIcons color={palette.primary} name="add" size={21} /></Pressable></View></Surface>;
        }}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({ content: { gap: 14, paddingBottom: 28 }, card: { marginHorizontal: 20, padding: 18 }, dhikr: { color: palette.ink, fontSize: 20, fontWeight: "600", lineHeight: 38, textAlign: "right" }, reference: { color: palette.muted, fontSize: 12, marginTop: 12, textAlign: "right" }, controlRow: { alignItems: "center", flexDirection: "row", justifyContent: "center", marginTop: 18 }, smallControl: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: 16, height: 44, justifyContent: "center", width: 44 }, countControl: { alignItems: "center", backgroundColor: palette.goldSoft, borderRadius: 16, justifyContent: "center", marginHorizontal: 10, minWidth: 104, minHeight: 44, paddingHorizontal: 14 }, countComplete: { backgroundColor: "#E4F4EB" }, countText: { color: palette.gold, fontSize: 15, fontWeight: "900" }, countTextComplete: { color: palette.success } });
