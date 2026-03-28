# 🔧 Protocols Integration - Решаване на Проблема

## ❌ Текущата Грешка

```json
{
  "success": false,
  "error": "Failed to fetch protocols",
  "message": "Could not parse Google Drive folder data"
}
```

**Причина:** Папката е достъпна, но API не е конфигуриран за достъп.

---

## ✅ Решение (3 простых стъпки)

### Стъпка 1: Генерирай Google Drive API Key

1. **Отвори** [Google Cloud Console](https://console.cloud.google.com/)
2. **Създай проект** (или избери съществуюч)
3. **Включи API:**
   - Отиди на "APIs & Services" → "Library"
   - Търси "Google Drive API"
   - Кликни на нея
   - Кликни "ENABLE"
4. **Генерирай ключ:**
   - Отиди на "Credentials"
   - Кликни "Create Credentials" → "API Key"
   - Копирай ключа (изглежда така: `AIzaSy...`)

### Стъпка 2: Добави в Vercel

1. **Отвори** [Vercel Dashboard](https://vercel.com/dashboard)
2. **Избери проекта** - `student-council-pgtk`
3. **Отиди на** Settings → Environment Variables
4. **Добави нова:**
   - Name: `NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY`
   - Value: Твоя API ключ (AIzaSy...)
   - Environments: Production + Preview + Development
5. **Кликни Save**

### Стъпка 3: Redeploy

1. **Отвори** [Vercel Deployments](https://vercel.com/dashboard/deployments)
2. **Кликни на последния деплой**
3. **Кликни "Redeploy"**
4. **Изчакай (~2 минути)**

---

## 🧪 Тестирай

След redeploy, отвори:
```
https://student-council-pgtk.vercel.app/protocols
```

Трябва да видиш списък със протоколи от Google Drive! ✅

---

## 🔍 Проверка

### На Локалния Сервър

Ако искаш да тестираш локално:

1. **Добави в `.env.local`:**
   ```env
   NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=AIzaSy...
   ```

2. **Рестартирай сървъра:**
   ```bash
   npm run dev
   ```

3. **Тестирай:**
   ```
   http://localhost:3001/protocols
   ```

---

## 🆘 Още Проблеми?

### "Invalid API Key"

- Провери дали ключът е копиран правилно (без пробели)
- Регенерирайте новия ключ

### "Protocols still not showing"

- Провери дали `GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID=12axMX_3K5-HcFNWm3KcsKlnLOhHM5MW1` е добавена
- Провери Google Drive папката дали е публична

### "API Error: 403 Forbidden"

- Google Drive API може да не бъде разрешена
- Отиди на Google Cloud Console → APIs & Services → Library
- Търси "Google Drive API"
- Кликни "Enable"

### "Redeploy doesn't help"

- Изчакай 5 минути (кеш обновяванния)
- Харди-рефреш браузъра (Ctrl+Shift+R)

---

## 📚 Повече Информация

- [Пълното ръководство](./PROTOCOLS_QUICKSTART.md)
- [Технически детайли](./PROTOCOLS_IMPLEMENTATION.md)
- [Google Cloud Console](https://console.cloud.google.com/)

---

**След като завършиш, протоколите ще работят перфектно! 🚀**
