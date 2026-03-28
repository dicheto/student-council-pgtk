# 🔐 Google Service Account Setup - За протоколи

## 📌 Какво е Service Account?

Service Account е специален тип акаунт което:
- ✅ Е създаден специално за приложения
- ✅ Има собствено име за имейл (ще видиш долу)
- ✅ Може да бъде даден достъп само до конкретна папка
- ✅ Е по-безопасен от API Key
- ✅ Работи за Vercel free plan

---

## 🚀 STEP-BY-STEP GUIDE

### СТЪПКА 1: Отваряне на Google Cloud Console

1. Отвори: https://console.cloud.google.com/
2. Ако не видиш проект, **създай ново:**
   - Кликни върху Project Name (горе вляво)
   - Кликни "NEW PROJECT"
   - Име: `student-council-pgtk` (или което искаш)
   - Кликни "CREATE"

---

### СТЪПКА 2: Включване на Google Drive API

1. Отиди на: **APIs & Services** → **Library**
2. Търси: `Google Drive API`
3. Кликни върху нея
4. Кликни **ENABLE** (син бутон)

---

### СТЪПКА 3: Създаване на Service Account

1. Отиди на: **APIs & Services** → **Credentials**
2. Кликни **Create Credentials** → **Service Account**
3. Попълни:
   - **Service account name:** `protocols-reader`
   - **Service account ID:** `protocols-reader` (автоматично)
   - **Description:** Protocols Archive Reader for Student Council PGTK
4. Кликни **CREATE AND CONTINUE**

---

### СТЪПКА 4: Дай Разрешения (Grant Role)

1. На странице "Grant this service account access to project":
   - Намери dropdown "Select a role"
   - Иърави: **Viewer** (не Editor!)
   - Кликни **CONTINUE**

> 💡 **Viewer** е достатъчно - Service Account просто чете Google Drive папката

2. Кликни **DONE**

---

### СТЪПКА 5: Генерирай JSON Key

1. В таблицата "Service Accounts", намери съчетаната акаунт:
   - `protocols-reader@...`
2. Кликни върху нейния **email**
3. Отиди на таб **KEYS**
4. Кликни **ADD KEY** → **Create new key**
5. Избери **JSON** (по подразбиране)
6. Кликни **CREATE**

📥 **Ще се изтегли JSON файл** - ЗАПАЗИ ГО!

---

### СТЪПКА 6: Даване на Достъп до Google Drive Папката

1. Отвори Google Drive папката със протоколите:
   - https://drive.google.com/drive/folders/12axMX_3K5-HcFNWm3KcsKlnLOhHM5MW1

2. **Дели папката:**
   - Кликни **Share** (горе дясно)
   - Скопирай Service Account Email (от JSON файла)
   - Паста в полето "Share with people and groups"
   - Избери **Viewer** (в dropdown)
   - Кликни **Share**

> 📄 За Service Account Email, отвори JSON файлът и намери: `"client_email": "protocols-reader@..."`

---

### СТЪПКА 7: Добави в Vercel

1. **Отвори JSON файла** (загруженияm по-горе)
   - Отвори го в текстов редактор
   - **Копирай ЦЕЛИЯ съдържаща** (от { до })

2. **Отвори:** https://vercel.com/dashboard/student-council-pgtk

3. **Settings → Environment Variables**

4. **Добави следните:**

   **Вариант А: Целия JSON (препоръчано)**
   ```
   Name:  GOOGLE_SERVICE_ACCOUNT_JSON
   Value: [PASTE ENTIRE JSON HERE]
   ```

   **OR Вариант B: Отделни полета**
   ```
   Name:  GOOGLE_SERVICE_ACCOUNT_EMAIL
   Value: protocols-reader@xyz.iam.gserviceaccount.com
   
   Name:  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
   Value: -----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
   ```

5. **Save**

---

### СТЪПКА 8: Обновка на Код

Файлът `lib/google-drive.ts` вече поддържа Service Account, но трябва да го активираш.

Отвори `lib/google-drive.ts` и намери функцията `getProtocols()`.

Добави този код в начало:

```typescript
export async function getProtocols(): Promise<Protocol[]> {
  // TRY SERVICE ACCOUNT FIRST (most secure)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      console.log('✅ Using Service Account method');
      return await getProtocolsWithServiceAccount();
    } catch (error) {
      console.error('❌ Service Account method failed:', error);
    }
  }
  
  // Then try API Key
  // ... (rest of code)
}
```

---

### СТЪПКА 9: Redeploy

1. Отвори: https://vercel.com/dashboard/deployments
2. Кликни на последния деплой
3. Кликни **Redeploy**
4. Изчакай ~2-3 минути

---

## ✅ ТЕСТИРАЙ

След redeploy:

```
https://student-council-pgtk.vercel.app/protocols
```

Трябва да видиш протоколи! 🎉

---

## 📋 Материали в JSON Файлът

Когато отворишь изтегленияm JSON файл, ще видиш нещо така:

```json
{
  "type": "service_account",
  "project_id": "student-council-pgtk-123456",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "protocols-reader@student-council-pgtk-123456.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

**Това е всичко что трябва!** Целия JSON може да отидеш в `GOOGLE_SERVICE_ACCOUNT_JSON`.

---

## 🔒 Сигурност

✅ **Защитено:**
- Service Account има **само** Viewer роля (не може да редактира)
- Имаме достъп **само** до споделяната папка
- Private Key е в Vercel и не се показва публично

⚠️ **ВАЖНО:**
- Не раздели JSON файла в GitHub или публично
- Vercel Environment Variables са приватни

---

## 🆘 Проблеми?

### "Service Account email not working"

- Проверь че папката е шеред със Service Account email
- Дай **Viewer** permissions (не Editor)

### "Private Key format error"

- Целия JSON трябва да е на един ред (без нови редове)
- Во Vercel, той ще го обработи правилно

### "Still getting 500 error"

- Изчакай 5 минути (кеш)
- Харди-рефреш (Ctrl+Shift+R)
- Проверь Vercel Deployment Logs

---

## 📚 Більш Информация

- [Google Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Google Drive API Auth](https://developers.google.com/drive/api/guides/authorization)
- [Vercel Environment Variables](https://vercel.com/docs/build-output-api/v3/environment-variables)

---

**Ready!** Това е най-безопасният начин за продукшън. 🚀
