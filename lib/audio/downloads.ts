// TypeScript resolves this neutral module, بينما Metro يختار downloads.native أو downloads.web وقت التشغيل.
export {
  deleteDownloadedAudio,
  downloadChapterAudio,
  getDownloadedAudioUri,
} from "./downloads.native";
