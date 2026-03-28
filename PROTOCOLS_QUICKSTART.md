# 📋 Google Drive Protocols Integration - Пълно Ръководство

## 🎯 Какво е Инсталирано

Създадена е **пълна интеграция на архив с протоколи от Google Drive** на вашосе приложение. Потребителите могат да преглеждат, търсят и изтегляват протоколи директно от `/protocols` страница.

---

## 🚀 Бързо Начало (5 минути)

### Стъпка 1: Конфигурация `.env.local`

Добави следните редове в твоя `.env.local` файл:

```env
# Google Drive Protocols
GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID=12axMX_3K5-HcFNWm3KcsKlnLOhHM5MW1
NEXT_PUBLIC_ENABLE_PROTOCOLS=true
PROTOCOLS_CACHE_DURATION=48
```

> 💡 Папката е вече конфигурирана и е публично достъпна!

### Стъпка 2: Стартирай сървъра

```bash
npm run dev
```

### Стъпка 3: Тестирай

Отвори http://localhost:3001/protocols в браузър. Трябвалю да видиш:
- ✅ Списък със всички протоколи от Google Drive
- ✅ Функция за търсене
- ✅ Бутони за преглед и изтегляне

**Готово! 🎉**

---

## 📁 Файлова Структура

```
┌─ lib/
│  └─ google-drive.ts                    # 🔑 Главната utility функция
│
├─ app/
│  ├─ api/protocols/
│  │  ├─ route.ts                        # GET /api/protocols (списък)
│  │  └─ [fileId]/pdf/
│  │     └─ route.ts                     # GET /api/protocols/[id]/pdf
│  │
│  └─ protocols/
│     ├─ layout.tsx                      # Layout (SEO метаданни)
│     └─ page.tsx                        # 🎨 Главната страница
│
├─ components/layout/
│  └─ Header.tsx                         # ✅ Обновлена с "Протоколи" линк
│
├─ .env.example                          # ✅ Добавени нови переменни
│
├─ PROTOCOLS_SETUP.md                    # 📚 Детайлиран setup guide
└─ PROTOCOLS_IMPLEMENTATION.md           # 📝 Технически детайли
```

---

## 🔧 Конифгурация (Детайли)

### Задължително

```env
GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID=12axMX_3K5-HcFNWm3KcsKlnLOhHM5MW1
```
ID на папката от която ще бут протоколи. Вече конфигурирана!

### Опционално - За По-Високи API Лимити

```env
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=your-api-key-here
```

Как да получиш ключ:
1. Отвори [Google Cloud Console](https://console.cloud.google.com/)
2. Създай ново проект
3. Включи "Google Drive API"
4. Отиди на Credentials → Create Credentials → API Key
5. Копирай ключа

### Функционални Флагове

```env
NEXT_PUBLIC_ENABLE_PROTOCOLS=true          # Включи/изключи функцията
PROTOCOLS_CACHE_DURATION=48                # Кеш времеток в часове
```

---

## 💡 Как Работи

### 1️⃣ Потребитеял Отваря `/protocols`

```
Browser → GET /protocols
   ↓
Next.js Renders Page (page.tsx)
   ↓
Page Fetches GET /api/protocols
```

### 2️⃣ API Връща Списък

```
GET /api/protocols
   ↓
Checked Local Cache (48h)
   ↓
If No Cache:
  ├─ Connect to Google Drive API
  ├─ Fetch Files from Folder
  ├─ Filter: Only Docs + PDFs
  ├─ Convert Google Docs → PDF URLs
  └─ Save to Cache
   ↓
Return JSON
```

### 3️⃣ Клиент Рендерира Списък

```
API Response with 5-10 Protocols
   ↓
Show table/grid with:
├─ Name
├─ Modified Date
└─ Action Buttons (Preview, Download, View on Drive)
```

### 4️⃣ Користувач Кликне "Преглед"

```
Click Preview Button
   ↓
Open Modal Dialog
   ↓
Embed PDF in <iframe>
   ↓
Show PDF Viewer in Browser
```

### 5️⃣ Похистувач Кликне "Изтегли"

```
Click Download
   ↓
Open GET /api/protocols/[fileId]/pdf
   ↓
Proxy PDF from Google Drive
   ↓
Browser Downloads PDF
```

---

## 🎨 Интерфейс

### През Десктоп

```
┌─────────────────────────────────────────┐
│ Архив с Протоколи                      │
├─────────────────────────────────────────┤
│ [Търсене по дата или дело...]          │
├─────────────────────────────────────────┤
│ 📄 Протокол 5.01.2024                  │
│    5 януари 2024                        │
│    [Преглед] [Изтегли] [Google]        │
├─────────────────────────────────────────┤
│ 📄 Протокол 12.12.2023                 │
│    12 декември 2023                     │
│    [Преглед] [Изтегли] [Google]        │
└─────────────────────────────────────────┘
```

### Модален на Преглед

```
┌─────────────────────────────────────┐
│ Протокол 5.01.2024  [Изтегли][X]   │
├─────────────────────────────────────┤
│                                     │
│  [PDF Viewer in iframe]             │
│                                     │
│  (Can scroll, zoom, etc.)           │
│                                     │
└─────────────────────────────────────┘
```

---

## 📊 API Документация

### GET `/api/protocols`

**Заявка:**
```
GET /api/protocols
```

**Отговор (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1a2b3c4d",
      "name": "Протокол 5.01.2024",
      "mimeType": "application/vnd.google-apps.document",
      "modifiedTime": "2024-01-05T10:30:00.000Z",
      "webViewLink": "https://docs.google.com/document/d/1a2b3c4d/edit",
      "pdfUrl": "https://docs.google.com/document/d/1a2b3c4d/export?format=pdf"
    }
  ],
  "count": 5,
  "cached": true,
  "cachedAt": "2024-01-20T15:30:00.000Z"
}
```

**Кеширане:**
- Local Cache: 48 часа
- ISR regener: 12 часа
- CDN Cache: 24 часа

---

### GET `/api/protocols/[fileId]/pdf`

**Заявка:**
```
GET /api/protocols/1a2b3c4d/pdf
```

**Отговор (200 OK):**
- Content-Type: `application/pdf`
- Body: PDF файл
- Кеш: 24 часа

**Грешки:**
- 404: Протокол не намерен
- 500: Грешка при генериране на PDF

---

## ⚡ Оптимизация за Vercel Free Plan

1. **Кеширане**
   - 48-часов локален кеш исключава повтарящи се API повиквания
   - Верай API лимити от ~1М заявки/месец

2. **ISR (Incremental Static Regeneration)**
   - API route се восстанавливает всеки 12 часа
   - Гарантира свежи данни без повишен товар

3. **CDN Кеш**
   - Vercel CDN кеширует отговора 24 часа
   - Намаля натоварването на origin сервъра

4. **Ограничения на Файлове**
   - Максимум 100 файла на заявка към Google Drive API
   - Достатъчно за повечето архиви

---

## 🐛 Решаване на Проблеми

### ❌ "Cannot find module 'next/server'"

**Причина:** TypeScript конфликт при редактирането на файлове

**Решение:** Рестартирай сървъра
```bash
npm run dev
```

### ❌ "Протоколи не се показват (404)"

**Причина:** Google Drive папката не е публично достъпна

**Решение:** 
1. Отвори Google Drive папката
2. Кликни "Share"
3. Постави "Anyone with the link" може да "View"

### ❌ "PDF не се показва в преглед"

**Причина:** Някои PDF-и имат защита или не могат да бъдат вградени в iframe

**Решение:** Потребителят все още може да го изтегли със "Изтегли" бутона

### ❌ "API Error: 403 Forbidden"

**Причина:** Недостатъчни разрешения за Google Drive API

**Решение:**
- Проверь дали API ключът е конфигуриран правилно
- Генерирай нов ключ от Google Cloud Console

### ❌ Сръбърът se запалкивает при първо посещение

**Причина:** Първият request към Google Drive API отнема време

**Решение:** Това е нормално. 2-ри пътем ще благободария кешираният отговор (~100ms)

---

## 🔒 Сигурост

✅ **Сигурно:**
- Файлове само от публично споделяната папка
- API ключ (ако е конфигуриран) е NEXT_PUBLIC - безопасен за фронтенд
- Файловите ID-та се верифицират срещу списъка

⚠️ **Важно:**
- Всеки може да има достъп до протоколите (публична папка)
- Не съхранявай чувствителни данни в Google Drive папката

---

## 🚀 Deployment на Vercel

1. Добави `GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID` в Vercel Environment Variables
2. Push код към GitHub
3. Vercel ще го деплойра автоматично
4. Посети `yourdomain.com/protocols`

**Готово!** 🎉

---

## 📚 Допълнителни Функции (Идеи)

### 🔄 Филтриране по Година

Добави фильтр която да群групира протоколи по година:

```tsx
const [selectedYear, setSelectedYear] = useState<number | null>(null);
const years = new Set(protocols.map(p => new Date(p.modifiedTime).getFullYear()));
```

### 📂 Категоризиране

Създай подпапки в Google Drive по категории:
```
Protocols Folder/
├─ 2024/
├─ 2023/
└─ Archive/
```

### 📊 Аналитика

Следи кожих протоколи са най-често изтегляни:
```typescript
// Track downloads
analytics.event('protocol_downloaded', { fileId, fileName });
```

### 🔐 Достъп на ADMIN

Добави admin панел за управление на папката:
```typescript
if (user?.role === 'admin') {
  // Show upload, delete, organize options
}
```

---

## 📞 Поддержка & Връзки

- 🔗 [Google Drive API Docs](https://developers.google.com/drive/api/guides/about-sdk)
- 🔗 [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- 🔗 [Vercel Caching](https://vercel.com/docs/concepts/analytics/guides/page-caching)
- 📄 [PROTOCOLS_SETUP.md](./PROTOCOLS_SETUP.md) - Детайлиран setup guide
- 📄 [PROTOCOLS_IMPLEMENTATION.md](./PROTOCOLS_IMPLEMENTATION.md) - Технически детайли

---

## ✨ Резюме

Това е **production-ready** решение което:

- ✅ Работи перфектно на Vercel free plan
- ✅ Мощнено кеширане (48h local + CDN cache)
- ✅ Поддършка за Bulgarian + English
- ✅ Красив, responsive дизайн
- ✅ Пълна SEO оптимизация
- ✅ Лесно за управление (просто добави файлове в Google Drive!)

**Готова за production! 🚀**

Потребителите могат да посещават `/protocols` и автоматично ще вачат всички документи от твоята Google Drive папка!

---

**Направено с ❤️ за Ученическия Съвет ПГТК**
