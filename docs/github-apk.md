# بناء APK عبر GitHub Actions

يحتوي الفرع `expo-offline-mobile` على workflow باسم **Build Android APK**. يعمل تلقائيًا عند كل push إلى الفرع، ويمكن تشغيله يدويًا من تبويب **Actions** في GitHub عبر زر **Run workflow**. لا يحتاج هذا المسار قاعدة بيانات أو API أو أي مفتاح سري.

بعد اكتمال التشغيل، افتح صفحة الـ workflow ثم حمّل artifact باسم `dalil-almuslim-offline-standalone-apk`. الملف الناتج هو **APK مستقل** يضم حزمة JavaScript والمحتوى المحليين داخله، ولذلك يعمل دون خادم Metro أو اتصال شبكة. قد يطلب Android السماح بالتثبيت من مصدر التطبيق الذي استُخدم لتنزيل الملف.

> يُوقّع هذا الـ APK حاليًا بمفتاح اختبار مولّد من مشروع Android ليكون قابلًا للتثبيت اليدوي، وليس مفتاح توزيع محفوظًا. لا ترفعه إلى Google Play. عند الاستعداد للنشر، أضف keystore تملكه في GitHub Secrets؛ لا تُضمّن أي مفاتيح توقيع أو كلمات مرور في المستودع.

يتحقق المسار قبل البناء من TypeScript وlint واختبارات العمل دون اتصال وExpo Doctor، ثم يولّد مشروع Android مؤقتًا ويشغّل Gradle. يبقى مجلدا `android/` و`ios/` خارج Git لأن Expo يعيد توليدهما من `app.config.ts`.
