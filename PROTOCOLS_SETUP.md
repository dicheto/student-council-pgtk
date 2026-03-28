## 🔗 Google Drive Протоколи - Ръководство за Интеграция

### Преглед
Тази интеграция позволява да показиш архив сProtocols (протоколи) директно от Google Drive на публична страница `/protocols`.

### ✅ Характеристики
- 📋 Списък със всички протоколи от Google Drive папка
- 📄 PDF преглед директно в браузъра
- 📥 Изтегляне на PDF копия
- ⚡ 48-часов кеш за оптимизация на Vercel free plan
- 🔄 Автоматично сортиране по дата (най-нови първи)
- 🔍 Търсене по име на протокол

### 🚀 Бързо Начало

#### 1. **Конфигурация**

Добави следните променливи в `.env.local`:

```env
# Google Drive folder ID (вече е конфигурирана)
GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID=12axMX_3K5-HcFNWm3KcsKlnLOhHM5MW1

# (ОПЦИОНАЛНО) API ключ за по-високи API лимити
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=your-api-key-here

# Включи функцията
NEXT_PUBLIC_ENABLE_PROTOCOLS=true

# Кеш продължителност (часове)
PROTOCOLS_CACHE_DURATION=48
```

#### 2. **Получаване на Google Drive API Ключ (Опционално)**

Ако искаш по-високи API лимити:

1. Отвори [Google Cloud Console](https://console.cloud.google.com/)
2. Създай ново проект или избери съществуващ
3. Включи "Google Drive API"
4. Отиди на "Credentials" → "Create Credentials" → "API Key"
5. Копирай ключа в `.env.local` като `NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY`

#### 3. **Достъп до Папката**

Папката трябва да е **публично достъпна** или си собственост на service account.

Текущо настроени:
- ✅ Папката е публично достъпна по линк
- ✅ Автоматично кеширане за Vercel free plan

### 📁 Файлова Структура

```
lib/google-drive.ts                          # Utility функции за Google Drive API
app/api/protocols/route.ts                   # API endpoint за списък протоколи
app/api/protocols/[fileId]/pdf/route.ts      # API endpoint за PDF преглед
app/protocols/layout.tsx                     # Layout за протоколи страница
app/protocols/page.tsx                       # Основна протоколи страница
```

### 🔧 Как Работи

1. **Зареждане на списъка**: Когато потребител посети `/protocols`, приложението:
   - Проверява локалния кеш (48 часа)
   - Ако няма кеш, извлича данни от Google Drive API
   - Филтрира само Google Docs и PDF документи
   - Конвертира Google Docs в PDF URLs
   - Кеширует резултата

2. **PDF Преглед**: Когато потребител кликне "Преглед":
   - Приложението отваря модален прозорец
   - Вгражда PDF viewer iframe
   - PDF идва директно от Google Drive

3. **Изтегляне**: Кликът на "Изтегли":
   - Отваря PDF в нов прозорец
   - Браузърът обработва изтеглянето

### 🎯 Верификува, че е Работи

1. Стартирай приложението: `npm run dev`
2. Отворе `/protocols` в браузър
3. Трябва да видиш списък със всички документи от Google Drive папката
4. Кликни "Преглед" или "Изтегли" за да тестираш функцията

### 📊 API Endpoints

#### GET `/api/protocols`
Връща списък със всички протоколи (с кеширане).

Отговор:
```json
{
  "success": true,
  "data": [
    {
      "id": "doc-id",
      "name": "Протокол 5.01.2024",
      "mimeType": "application/vnd.google-apps.document",
      "modifiedTime": "2024-01-05T10:30:00.000Z",
      "webViewLink": "https://docs.google.com/document/d/.../edit",
      "pdfUrl": "https://docs.google.com/document/d/.../export?format=pdf"
    }
  ],
  "count": 5,
  "cached": true
}
```

#### GET `/api/protocols/[fileId]/pdf`
Връща PDF файл на протокол (proxy от Google Drive).

### ⚙️ Оптимизация за Vercel Free Plan

- **Кеширане**: 48-часов локален кеш избягва повтарящи се API повиквания
- **ISR (Incremental Static Regeneration)**: API route регенерира кешираното всеки 12 часа
- **CDN Кеш**: Vercel CDN кеширует отговора 24 часа
- **Бря параметри**: Списъкът е ограничен до 100 файла на заявка

### 🐛 Решаване на Проблеми

#### "Протоколи не се зареждат"
- Проверь дали `GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID` е правилна
- Проверь дали папката е публично достъпна
- Отвори browser console за детайли на грешката

#### "Получавам 403 Forbidden"
- Google Drive папката не е публично достъпна
- Дели папката и задай "Anyone with the link" permissions

#### "PDF не се показва в преглед"
- Някои PDF файлове може да не се показват в iframe от съображения за сигурност
- Потребителят все още може да го изтегли

### 🔐 Сигурност

- ✅ Файловете са налични само от публично споделяната папка
- ✅ API ключ (ако е конфигуриран) е NEXT_PUBLIC - безопасен за фронтенд
- ✅ Файловите ID-та се верифицират срещу списъка от Google Drive
- ⚠️ Следи лимитите на Google Drive API

### 🚫 Известни Ограничения

1. Google Drive API има месечни лимити (~1М заявки за free tier)
2. Някои PDF мит не се показват в iframe
3. Големи файлове може да отнемат време да се конвертират в PDF
4. На Vercel free plan, кеш е наличен само 60 секунди на repubblica

### 📚 Допълнителни Ресурси

- [Google Drive API Документация](https://developers.google.com/drive/api/guides/about-sdk)
- [Vercel Кеширане Документация](https://vercel.com/docs/concepts/analytics/guides/page-caching)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Вторак**: Тази интеграция готина и е готова за production! 🎉
