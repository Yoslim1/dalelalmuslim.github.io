import * as Clipboard from "expo-clipboard";
import { Share } from "react-native";

export async function copyText(text: string): Promise<boolean> {
  return Clipboard.setStringAsync(text);
}

export async function shareText(text: string, title: string): Promise<void> {
  await Share.share({ message: text, title });
}
