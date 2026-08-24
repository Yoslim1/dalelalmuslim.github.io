import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export function lightHaptic(): void {
  if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function successHaptic(): void {
  if (Platform.OS !== "web") void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
