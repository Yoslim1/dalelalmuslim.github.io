export type ByteFile = {
  bytes: () => Promise<Uint8Array<ArrayBuffer>>;
};

export type BytesDigest = (bytes: Uint8Array<ArrayBuffer>) => Promise<ArrayBuffer>;

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * يُبقي التحويل من ملف Expo إلى TypedArray في طبقة مستقلة.
 * جسر Android في expo-crypto لا يقبل ArrayBuffer الخام في بعض الإصدارات،
 * بينما تقبل واجهة digest الموثقة BufferSource مثل Uint8Array.
 */
export async function hashFileBytes(file: ByteFile, digest: BytesDigest): Promise<string> {
  const bytes = await file.bytes();
  return toHex(await digest(bytes));
}
