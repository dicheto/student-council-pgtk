# 📡 API Documentation

## Base URL
```
http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

### Types
1. **Anonymous** - Public endpoints
2. **User** - Authenticated endpoints (logged in users)
3. **Admin** - Protected endpoints (admin/editor role)

### Headers
```
Authorization: Bearer {session_token}
Content-Type: application/json
```

---

## 🤖 AI Endpoints

### Generate Content

**Endpoint:** `POST /ai/generate-content`

**Authentication:** User (authenticated)

**Request:**
```json
{
  "title": "Article Title"
}
```

**Response:**
```json
{
  "content": "Generated article content..."
}
```

**Query Parameters:**
- `model` (optional) - AI model to use

**Errors:**
- `400` - Title is required
- `401` - Unauthorized
- `500` - API error

**Example:**
```bash
curl -X POST http://localhost:3000/api/ai/generate-content \
  -H "Content-Type: application/json" \
  -d '{"title":"Breaking News"}'
```

---

## 📰 News Endpoints

### List News (Server Action)

**Function:** `listNews(language: 'en' | 'bg', status?: 'published' | 'draft')`

**Location:** `lib/actions/news.ts`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Article Title",
      "slug": "article-title",
      "content": "Article content...",
      "excerpt": "Brief summary",
      "image_urls": ["url1", "url2"],
      "featured_image_url": "url",
      "status": "published",
      "language": "en",
      "published_at": "2024-01-15T10:00:00Z",
      "created_at": "2024-01-15T09:00:00Z"
    }
  ]
}
```

### Create News (Server Action)

**Function:** `createNews(input: CreateNewsInput)`

**Input:**
```typescript
{
  title: string
  content: string
  excerpt?: string
  imageUrls?: string[]
  featuredImageUrl?: string
  language: 'en' | 'bg'
  publishToDiscord?: boolean
  status?: 'draft' | 'published' | 'archived'
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* created article */ }
}
```

**Errors:**
- `401` - Unauthorized
- `409` - Slug already exists

### Update News (Server Action)

**Function:** `updateNews(input: UpdateNewsInput)`

**Input:** Same as `CreateNewsInput` + `id`

**Response:** Updated article object

### Delete News (Server Action)

**Function:** `deleteNews(id: string)`

**Response:**
```json
{
  "success": true
}
```

---

## 📅 Events Endpoints

### List Events (Server Action)

**Function:** `listEvents(language: 'en' | 'bg')`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Event Title",
      "slug": "event-title",
      "description": "Event description",
      "date": "2024-02-15T18:00:00Z",
      "end_date": "2024-02-15T20:00:00Z",
      "location": "School Auditorium",
      "location_url": "https://maps.google.com/...",
      "image_url": "https://...",
      "color": "#0047AB",
      "ics_data": "BEGIN:VCALENDAR...",
      "language": "en",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Create Event (Server Action)

**Function:** `createEvent(input: CreateEventInput)`

**Input:**
```typescript
{
  title: string
  description?: string
  date: string (ISO)
  endDate?: string (ISO)
  location?: string
  locationUrl?: string
  imageUrl?: string
  color?: string
  language: 'en' | 'bg'
}
```

**Auto-Generated:**
- ICS calendar file
- Slug from title

### Update Event (Server Action)

**Function:** `updateEvent(input: UpdateEventInput)`

### Delete Event (Server Action)

**Function:** `deleteEvent(id: string)`

---

## 💬 Discord Endpoints

### Post News to Discord

**Endpoint:** `POST /discord/post-news`

**Authentication:** None (triggered by server action)

**Request:**
```json
{
  "id": "news-id",
  "title": "Article Title",
  "excerpt": "Brief summary",
  "featured_image_url": "https://...",
  "slug": "article-slug"
}
```

**Response:**
```json
{
  "success": true
}
```

**Embed Format:**
- Title: Article title
- Description: Excerpt
- Image: Featured image
- Link: Article URL
- Color: `#0047AB` (Deep Blue)

**Example Embed:**
```
┌─ Article Title ──────────────────────
│ 
│ Brief summary of the article
│ 
│ [Featured Image]
│
│ Read more: https://site.com/news/article
└──────────────────────────────────────
```

### Get Discord Settings (Server Action)

**Function:** `getDiscordSettings()`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "webhook_url": "***",  // Masked for security
    "bot_token": "***",    // Masked for security
    "guild_id": "123456789",
    "active_channel": "general",
    "active_channel_id": "123456789",
    "is_active": true,
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

### Update Discord Settings (Server Action)

**Function:** `updateDiscordSettings(input: DiscordSettingsInput)`

**Input:**
```typescript
{
  webhookUrl?: string
  botToken?: string
  guildId?: string
  activeChannel?: string
  activeChannelId?: string
  isActive?: boolean
}
```

**Authorization:** Admin only

**Response:** Updated settings (with masked tokens)

---

## 📡 RSS Feed

### Get RSS Feed

**Endpoint:** `GET /rss`

**Authentication:** None (public)

**Query Parameters:**
- `lang` - Language code: `en` or `bg` (default: `en`)
- `limit` - Number of items (max: 100, default: 50)

**Response:** XML RSS 2.0 format

**Example:**
```bash
GET /api/rss?lang=en&limit=50
```

**Feed Structure:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Student Council PGTK</title>
    <link>https://site.com</link>
    <language>en</language>
    <item>
      <title>Article Title</title>
      <description>Article excerpt</description>
      <link>https://site.com/news/slug</link>
      <pubDate>Mon, 15 Jan 2024 10:00:00 GMT</pubDate>
      <image>https://...</image>
    </item>
  </channel>
</rss>
```

**Headers:**
```
Content-Type: application/rss+xml; charset=utf-8
Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
```

---

## 📁 Storage Endpoints

### Upload File (Server Action)

**Function:** `uploadFile(file: Buffer, fileName: string, bucket: 'news-images' | 'event-images')`

**Parameters:**
- `file` - File buffer
- `fileName` - Original filename
- `bucket` - Target bucket

**Response:**
```json
{
  "success": true,
  "url": "https://supabase-storage-url/..."
}
```

**Authorization:** Authenticated user

**File Limits:**
- Max size: 10MB (configurable)
- Types: Images only (JPEG, PNG, GIF, WebP)

### Delete File (Server Action)

**Function:** `deleteFile(filePath: string, bucket: 'news-images' | 'event-images')`

**Response:**
```json
{
  "success": true
}
```

---

## 🔐 Authentication Endpoints

### Supabase Auth Routes

Automatically handled by `@supabase/auth-helpers-nextjs`

**Key Routes:**
- `POST /auth/v1/token` - Get/refresh token
- `GET /auth/v1/user` - Get current user
- `POST /auth/v1/signout` - Sign out

---

## ⚠️ Error Responses

### Standard Error Format
```json
{
  "error": "Error message",
  "status": 400
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Server Error

### Error Examples

**Missing Required Field:**
```json
{
  "error": "Title is required",
  "status": 400
}
```

**Unauthorized:**
```json
{
  "error": "Unauthorized",
  "status": 401
}
```

**Not Found:**
```json
{
  "error": "Article not found",
  "status": 404
}
```

---

## 📊 Rate Limiting

Currently not implemented but recommended for production:

**Suggested Limits:**
- Public endpoints: 100 req/min per IP
- AI generation: 10 req/min per user
- File upload: 5 req/min per user

---

## 🧪 Testing

### Using cURL

**Test AI Generation:**
```bash
curl -X POST http://localhost:3000/api/ai/generate-content \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Article"}'
```

**Test RSS Feed:**
```bash
curl http://localhost:3000/api/rss?lang=en
```

**Post to Discord:**
```bash
curl -X POST http://localhost:3000/api/discord/post-news \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Test Article",
    "excerpt":"Test summary",
    "slug":"test-article"
  }'
```

### Using Postman

1. Create new collection "Student Council API"
2. Set environment variables:
   - `base_url` = `http://localhost:3000/api`
   - `auth_token` = Your Supabase token
3. Import endpoints
4. Use `{{base_url}}` in request URLs
5. Add `Authorization: Bearer {{auth_token}}` header

---

## 📈 Performance Tips

1. **Pagination** - Use `limit` in list endpoints
2. **Caching** - RSS feed cached for 1 hour
3. **Indexes** - Database indexes on frequently queried fields
4. **Compression** - Gzip enabled on responses
5. **CDN** - Use Supabase CDN for images

---

## 🔄 Webhook Integration

### Discord Webhook Format

When posting news with Discord enabled:

```json
{
  "embeds": [
    {
      "title": "Article Title",
      "description": "Article excerpt",
      "url": "https://site.com/news/slug",
      "color": 0x0047ab,
      "image": {
        "url": "https://featured-image-url"
      },
      "timestamp": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

## 📚 SDK Usage Examples

### Server-Side
```typescript
import { createNews } from '@/lib/actions/news'

const result = await createNews({
  title: 'Breaking News',
  content: 'Article content...',
  language: 'en',
  status: 'published'
})

if (result.success) {
  console.log('Article created:', result.data)
} else {
  console.error('Error:', result.error)
}
```

### Client-Side (Fetch)
```typescript
const response = await fetch('/api/ai/generate-content', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'My Article' })
})

const data = await response.json()
console.log(data.content)
```

---

## 🚀 Deployment Notes

- **API Rate Limits** - Configure on hosting platform
- **CORS** - Already configured for development
- **Environment Variables** - Set on hosting dashboard
- **Timeouts** - Set appropriate timeouts for long operations
- **Monitoring** - Enable error tracking (Sentry, etc.)

---

**API Version:** 1.0.0  
**Last Updated:** January 2026
