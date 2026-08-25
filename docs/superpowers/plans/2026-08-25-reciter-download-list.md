# Reciter Download List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use task-by-task execution with an independent verification gate after every deliverable. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** إظهار قارئ محدد بوضوح، ثم زر تنزيل أو تشغيل مستقل بجوار كل سورة يتيحها ذلك القارئ، مع تنفيذ تنزيل مجموعة السور المتاحة دون تضليل المستخدم بشأن تغطية القرآن.

**Architecture:** تفصل طبقة `lib/audio` الحقائق عن الواجهة: تحميل الفهارس والتحقق، ثم حالة تنزيل/تشغيل السور، ثم أوامر محددة للسورة أو للمجموعة. تبقى شاشة المكتبة مسؤولة عن اختيار القارئ والإجراءات العامة، بينما تعرض شاشة فهرس القرآن صفوف السور مع الإجراء الصحيح للقارئ المختار. كل عنصر واجهة يعرض حالة معلنة ولا يستنتج أن جميع سور القرآن قابلة للتنزيل ما لم يفهرس القارئ 114 سورة فعلًا.

**Tech Stack:** Expo SDK 54، Expo Router، React Native، TypeScript، Vitest، expo-audio، expo-file-system، expo-crypto، AsyncStorage.

**Spec:** `design.md` و`docs/audio-library-architecture.md` وطلب المستخدم بتاريخ 25 أغسطس 2026.

## Global Constraints

- الواجهة عربية RTL، مع إبقاء زمن المشغل وأزرار التقديم/التأخير LTR.
- لا تدخل MP3 في APK؛ التنزيل اختياري على Android وiOS فقط.
- لا يظهر نص «تحميل القرآن كله» إذا لم تكن تغطية القارئ تساوي 114 سورة؛ تظهر بدلاً منه «تنزيل السور المتاحة (1 من 114)».
- لا تدمج بيانات الفهرس أو التحقق أو التنزيل أو العرض في ملف واحد.
- لا يبدأ التشغيل إلا بعد تحقق النص والبصمة وحفظ الملف بنجاح.
- كل زر قابل للوصول وبحد لمس لا يقل عن 44 نقطة، مع حالة تحميل وخطأ مرئية.

---

### Task 1: نموذج الحالة وأوامر السور

**Files:**
- Create: `lib/audio/reciter-download-state.ts`
- Modify: `lib/audio/downloads.native.ts`
- Modify: `lib/audio/downloads.web.ts`
- Test: `tests/reciter-download-state.test.ts`

**Interfaces:**
- Consumes: `AudioLibraryEntry`, `ReciterManifest`, `ChapterAudio` وواجهات تنزيل ملف السورة الحالية.
- Produces: `getAvailableChapterNumbers(entry, manifest)`, `getReciterCoverageLabel(entry)`, و`getChapterActionState(...)` التي ترجع `unavailable | download | downloading | play | error`.

- [ ] **Step 1: كتابة اختبار فاشل لتسمية التغطية وحالة السورة.**

```ts
expect(getReciterCoverageLabel({ availableChapters: [1] })).toBe("السور المتاحة: 1 من 114");
expect(getChapterActionState({ available: true, downloadedUri: null, downloading: false })).toBe("download");
expect(getChapterActionState({ available: true, downloadedUri: "file://001.mp3", downloading: false })).toBe("play");
```

- [ ] **Step 2: تشغيل الاختبار للتحقق من فشله.**

Run: `pnpm vitest run tests/reciter-download-state.test.ts`

- [ ] **Step 3: تنفيذ دوال الحالة الصرفة.**

```ts
export type ChapterActionState = "unavailable" | "download" | "downloading" | "play" | "error";
export function getChapterActionState(input: ChapterActionInput): ChapterActionState { /* exhaustive branch */ }
```

- [ ] **Step 4: إعادة تشغيل الاختبار وTypeScript.**

Run: `pnpm vitest run tests/reciter-download-state.test.ts && pnpm check`

### Task 2: بطاقة القارئ وإجراء تنزيل السور المتاحة

**Files:**
- Create: `components/audio/reciter-download-card.tsx`
- Create: `components/audio/use-reciter-library.ts`
- Modify: `app/audio-library.tsx`
- Test: `tests/reciter-download-state.test.ts`

**Interfaces:**
- Consumes: `loadAudioLibrary`, `loadReciterManifest`, إعداد القارئ المحفوظ، ودوال الحالة من Task 1.
- Produces: hook يعيد `selectedReciter`, `manifest`, `availableChapters`, `selectReciter`، ومكون بطاقة يطلب تنزيل السور المتاحة مع مؤشر تقدّم عددي.

- [ ] **Step 1: كتابة اختبار يثبت أن القارئ صاحب سورة واحدة لا يحمل تسمية «القرآن كله».**

```ts
expect(getReciterCoverageLabel({ availableChapters: [1] })).not.toContain("القرآن كله");
```

- [ ] **Step 2: تنفيذ hook وCard، مع زر صريح «تنزيل السور المتاحة (1)».**

- [ ] **Step 3: ربط شاشة المكتبة بالقارئ المختار وبالحالة الفارغة والخطأ.**

- [ ] **Step 4: تشغيل الاختبارات وفحص الواجهة على الويب.**

Run: `pnpm test && pnpm check && pnpm lint`

### Task 3: إجراء مستقل بجوار كل سورة

**Files:**
- Create: `components/audio/chapter-audio-action.tsx`
- Modify: `app/(tabs)/quran.tsx` أو مسار فهرس السور الفعلي بعد مراجعته
- Modify: `app/quran/[number].tsx`
- Modify: `components/quran-audio-panel.tsx`
- Test: `tests/reciter-download-state.test.ts`

**Interfaces:**
- Consumes: hook القارئ من Task 2، manifest القارئ، حالة الملف المحلي، و`playTrack`.
- Produces: زر أيقوني/نصي مستقل في كل صف: «تنزيل» للسورة المتاحة غير المحفوظة، «تشغيل» للمحفوظة، ولا شيء قابل للنقر للسورة غير المتاحة.

- [ ] **Step 1: كتابة اختبار يميّز السورة المتاحة من غير المتاحة.**

```ts
expect(getChapterActionState({ available: false, downloadedUri: null, downloading: false })).toBe("unavailable");
```

- [ ] **Step 2: تنفيذ `ChapterAudioAction` بأزرار ذات accessibilityLabel وحالات انتظار وخطأ.**

- [ ] **Step 3: وضع الإجراء في فهرس السور وبطاقة المشغل داخل السورة.**

- [ ] **Step 4: تنفيذ تجربة مسار الفاتحة: اختيار القارئ → تنزيل → تشغيل → حذف → تنزيل مرة أخرى.**

### Task 4: المراجعة والبناء

**Files:**
- Modify: `todo.md`
- Modify: `README.md`
- Test: `tests/reciter-download-state.test.ts`, `tests/audio-validation.test.ts`

**Interfaces:**
- Consumes: السلوك الكامل للمهام السابقة.
- Produces: توثيق صادق للتغطية الحالية وAPK مستقل جديد.

- [ ] **Step 1: تشغيل الفحوص الكاملة.**

Run: `pnpm check && pnpm lint && pnpm test && npx --yes expo-doctor && npx expo export --platform android --output-dir dist-audio-check`

- [ ] **Step 2: مراجعة لقطة واجهة الويب للهوامش والـRTL وحجم اللمس، من دون اعتبار الويب دليلًا على تنزيل Native.**

- [ ] **Step 3: تحديث TODO والتوثيق بالمتحقق منه فقط.**

- [ ] **Step 4: حفظ checkpoint، دفع التغيير إلى `expo-offline-mobile`، وتشغيل GitHub Actions لبناء APK مستقل.**
