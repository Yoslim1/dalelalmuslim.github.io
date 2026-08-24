import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen, ListChevron, ScreenTitle, Surface } from "@/components/dalil-ui";
import { azkarCategories } from "@/lib/content";
import { useAppState } from "@/lib/state/app-state";
import { palette } from "@/lib/ui/theme";

export default function AzkarScreen() {
  const { state } = useAppState();
  return (
    <AppScreen>
      <FlatList
        contentContainerStyle={styles.content}
        data={azkarCategories}
        keyExtractor={(item) => item.slug}
        ListHeaderComponent={<ScreenTitle eyebrow="وردك اليومي" title="الأذكار" />}
        renderItem={({ item }) => {
          const done = item.azkar.filter((dhikr) => state.daily.completedAzkarIds.includes(dhikr.id)).length;
          return (
            <Pressable onPress={() => router.push(`/azkar/${item.slug}` as never)} style={({ pressed }) => [pressed && styles.pressed]}>
              <Surface style={styles.card}>
                <ListChevron />
                <View style={styles.copy}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text numberOfLines={1} style={styles.description}>{item.description}</Text>
                  <Text style={styles.progress}>{done}/{item.azkar.length} مكتمل</Text>
                </View>
                <View style={styles.icon}><MaterialIcons color={palette.primary} name="wb-sunny" size={23} /></View>
              </Surface>
            </Pressable>
          );
        }}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 12, padding: 20 },
  card: { alignItems: "center", flexDirection: "row", padding: 16 },
  copy: { alignItems: "flex-end", flex: 1, marginHorizontal: 12 },
  title: { color: palette.ink, fontSize: 17, fontWeight: "800", textAlign: "right" },
  description: { color: palette.muted, fontSize: 13, marginTop: 3, textAlign: "right" },
  progress: { color: palette.success, fontSize: 12, fontWeight: "800", marginTop: 7 },
  icon: { alignItems: "center", backgroundColor: palette.primarySoft, borderRadius: 16, height: 46, justifyContent: "center", width: 46 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
});
