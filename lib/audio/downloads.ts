// TypeScript resolves this neutral module, بينما Metro يختار downloads.native أو downloads.web وقت التشغيل.
export {
  deleteDownloadedAudio,
  downloadChapterAudio,
  getDownloadedAudioFile,
  getDownloadedAudioUri,
} from "./downloads.native";
