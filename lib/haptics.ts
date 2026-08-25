import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export function lightHaptic(enabled = true): void {
  if (enabled && Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function successHaptic(enabled = true): void {
  if (enabled && Platform.OS !== "web") void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
