# تدقيق تشغيل التلاوة على Android

**الحالة:** حُلت مشكلة الصمت للمسار التجريبي على Android. ثبت على هاتف المستخدم أن تنزيل الفاتحة ثم تشغيلها عبر مزود Android المبني على `expo-video` ينتج صوتًا مسموعًا فعليًا. لا يوثق ذلك تغطية صوتية كاملة للقرآن أو مراجعة تجويدية مستقلة.

| محور التدقيق | النتيجة | القرار الهندسي |
| --- | --- | --- |
| الملف المنشور | البصمة المطابقة: `a819a37b86473f01d8f8ed477035bd737bde8530e6efc9486fe9448084bf0bdf`؛ مدته 76.968 ثانية | يستبعد تلف الملف أثناء النشر أو التنزيل. |
| الترميز | MP3 MPEG Layer III، ستيريو، 48 kHz، قرابة 144 kbps | الصيغة تقع ضمن MP3 الذي يعلن Android دعمه؛ ليست سببًا مرجحًا للصمت. [1] |
| `expo-audio` | الإصدار المثبت `1.1.1` هو المتوافق مع Expo SDK 54. توجد بلاغات Android موثقة عن تحديثات حالة ملفات محلية ومشغلات متعددة، لكنها لا تثبت أن الملف الحالي غير مدعوم. [2] | لا يكفي الاعتماد على `currentStatus` لتأكيد الصوت المسموع، ولا تستمر محاولات واجهة صامتة بلا تشخيص native. |
| بديل Native مرخّص | `react-native-track-player` v4.1.2 مفتوح تحت Apache-2.0، ويدعم Android وملفات محلية والخلفية والتحكم الإعلامي؛ v5 تجاري ولذلك لا يُعتمد. [3] [4] | فُحص ثم استُبعد من التطبيق لأن Expo Doctor صنّفه غير مدعوم مع New Architecture في هذا المشروع. |
| البديل المنفذ للاختبار | `expo-video` إصدار SDK 54 الرسمي يستخدم مشغل Android native منفصلًا، ويدعم التحكم الصوتي والخلفية والإشعار عند تفعيل config plugin. [5] | استبدل مزود Android فقط، بينما يحتفظ الويب بـ`expo-audio`. نجح اختبار هاتف المستخدم بصوت مسموع بعد التنزيل. |

## الاستنتاج

> ملف الفاتحة **MP3 صالح ومدعوم نظريًا على Android**. ومع ثبات الملف والبصمة ومسار `file://`، ثم نجاح تشغيل الملف نفسه على الهاتف عبر `expo-video`، صار التفسير العملي الأقوى أن الصمت كان في مسار `expo-audio` native أو تكامله في هذا التطبيق/الجهاز، لا في ترميز MP3 أو التلف أو المحتوى.

تحقق الاختبار الفاصل دون تغيير الترميز: بقي MP3 نفسه وبصمته، وتغير محرك Android فقط إلى `expo-video`؛ وأكد المستخدم أن الصوت «اشتغل تمام». هذا دليل عملي على نجاح مسار التنزيل والتشغيل المسموع للفاتحة التجريبية. تبقى وظائف الخلفية/شاشة القفل بحاجة إلى تحقق جهاز مستقل قبل أي ادعاء عنها.

## المراجع

[1]: https://developer.android.com/media/platform/supported-formats "Android supported media formats"
[2]: https://github.com/expo/expo/issues/38962 "expo-audio: local audio files status updates on Android"
[3]: https://github.com/doublesymmetry/react-native-track-player/tree/v4 "react-native-track-player v4"
[4]: https://raw.githubusercontent.com/doublesymmetry/react-native-track-player/v4/LICENSE "Apache License 2.0"
[5]: https://docs.expo.dev/versions/latest/sdk/video/ "Expo Video documentation"
