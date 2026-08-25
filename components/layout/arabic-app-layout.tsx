import type { PropsWithChildren } from "react";
import { Platform, StyleSheet, View } from "react-native";

/**
 * Arabic-first shell: Expo's static localization plugin forces the native
 * direction in the APK, while web receives the explicit direction property
 * required by react-native-web.
 */
export function ArabicAppLayout({ children }: PropsWithChildren) {
  return <View {...(Platform.OS === "web" ? { dir: "rtl" } : {})} style={styles.root}>{children}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
