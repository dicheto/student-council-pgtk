# 🎓 Student Council PGTK - Complete Implementation Guide

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [Database Schema](#database-schema)
3. [Setup Instructions](#setup-instructions)
4. [API Routes](#api-routes)
5. [Server Actions (CRUD)](#server-actions-crud)
6. [Authentication & Middleware](#authentication--middleware)
7. [Admin Components](#admin-components)
8. [Discord Integration](#discord-integration)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## 📁 Project Structure

```
StudentCouncilPGTK/
├── app/                                  # Next.js App Router
│   ├── api/                              # API Routes
│   │   ├── ai/
│   │   │   ├── generate-content/        # OpenAI content generation
│   │   │   └── models/                  # Available models endpoint
│   │   ├── discord/
│   │   │   ├── post-news/               # Post article to Discord
│   │   │   ├── status/                  # Check Discord bot status
│   │   │   └── webhooks/                # Webhook management
│   │   ├── rss/                          # RSS feed generation
│   │   ├── auth/                         # Supabase auth routes
│   │   └── storage/                      # File upload management
│   ├── login/                            # Authentication page
│   ├── admin/                            # Admin dashboard (protected)
│   │   ├── layout.tsx                   # Admin layout
│   │   ├── page.tsx                     # Dashboard home
│   │   ├── news/                        # News management
│   │   ├── events/                      # Events management
│   │   └── discord/                     # Discord settings
│   ├── events/                           # Public events page
│   ├── news/                             # Public news page
│   ├── layout.tsx                        # Root layout
│   ├── page.tsx                          # Home page
│   └── globals.css                       # Global styles
├── components/                           # React components
│   ├── admin/
│   │   ├── news/
│   │   │   ├── NewsForm.tsx             # Main form component
│   │   │   ├── NewsFormModal.tsx        # Modal wrapper
│   │   │   ├── NewsForm.tsx             # Enhanced form
│   │   │   ├── ImageUploader.tsx        # Drag-drop uploader
│   │   │   ├── ImageUpload.tsx          # Legacy image component
│   │   │   ├── AIContentGenerator.tsx   # AI writer
│   │   │   ├── DiscordToggle.tsx        # Discord switch
│   │   │   ├── NewsList.tsx             # Articles list
│   │   │   └── NewsCard.tsx             # Single article card
│   │   ├── discord/
│   │   │   ├── DiscordIntegration.tsx
│   │   │   ├── WebhookSettings.tsx
│   │   │   ├── ChannelSelector.tsx
│   │   │   ├── BotStatus.tsx
│   │   │   └── MessageLog.tsx
│   │   ├── RecentActivity.tsx
│   │   ├── StatsCard.tsx
│   │   └── ChartCard.tsx
│   ├── events/
│   │   ├── EventsCalendar.tsx           # Calendar component
│   │   ├── EventModal.tsx               # Event details modal
│   │   ├── AddToCalendarButtons.tsx     # ICS/Google export
│   │   └── EventCard.tsx                # Single event card
│   ├── layout/
│   │   ├── AppShell.tsx                 # Main layout wrapper
│   │   ├── Header.tsx                   # Navigation header
│   │   ├── Footer.tsx                   # Footer
│   │   ├── BentoGrid.tsx                # Grid layout system
│   │   └── SideNavigation.tsx           # Admin sidebar
│   ├── providers/
│   │   ├── ThemeProvider.tsx            # Dark/light mode provider
│   │   └── AuthProvider.tsx             # Authentication context
│   ├── sections/
│   │   ├── Hero.tsx                     # Landing hero
│   │   ├── LatestNews.tsx               # News preview section
│   │   ├── UpcomingEvents.tsx           # Events preview section
│   │   ├── GalleryHighlights.tsx        # Gallery section
│   │   └── NewsCard.tsx                 # News card component
│   └── animations/
│       ├── AnimatedLogo.tsx             # Logo animation
│       ├── PageTransition.tsx           # Page transitions
│       └── LoadingSpinner.tsx           # Custom loader
├── lib/                                  # Utilities and helpers
│   ├── supabase/
│   │   ├── client.ts                    # Browser client
│   │   ├── server.ts                    # Server client
│   │   ├── admin.ts                     # Admin/service role client
│   │   └── middleware.ts                # Auth middleware
│   ├── actions/                          # Server actions (CRUD)
│   │   ├── news.ts                      # News operations
│   │   ├── events.ts                    # Events operations
│   │   ├── discord.ts                   # Discord settings
│   │   ├── storage.ts                   # File uploads
│   │   ├── auth.ts                      # Auth operations
│   │   └── links.ts                     # Navigation links
│   ├── utils.ts                          # Utility functions
│   ├── discord/
│   │   ├── client.ts                    # Discord.js client
│   │   └── embed-builder.ts             # Embed creation
│   └── constants.ts                      # App constants
├── types/                                # TypeScript types
│   ├── events.ts                         # Event types
│   ├── news.ts                           # News types
│   ├── discord.ts                        # Discord types
│   └── index.ts                          # Shared types
├── public/                               # Static assets
│   ├── logo.svg
│   ├── logo-dark.svg
│   └── favicon.ico
├── middleware.ts                         # Request middleware
├── next.config.js                        # Next.js configuration
├── tailwind.config.ts                    # Tailwind configuration
├── tsconfig.json                         # TypeScript configuration
├── package.json                          # Dependencies
├── .env.example                          # Environment variables template
├── DATABASE_SCHEMA.sql                   # Supabase schema
└── IMPLEMENTATION_GUIDE.md               # This file
```

---

## 🗄️ Database Schema

### Tables Overview

**user_profiles**
- Links to Supabase Auth users
- Stores role (admin, editor, user), language preference, and profile info

**news**
- Title, content, excerpt
- Multiple image URLs, featured image
- Status (draft, published, archived)
- Language support (en, bg)
- Discord publish toggle
- SEO metadata

**events**
- Title, description, date/time
- Location and location URL
- ICS data for calendar export
- Color coding
- Language support

**discord_settings**
- Webhook URL for posting
- Bot token (encrypted)
- Guild ID and active channel
- Single record constraint

**custom_pages**
- Slug-based pages
- Multilingual support
- SEO fields

**media**
- File tracking for uploads
- Storage paths
- Alt text and metadata

**links**
- Navigation items
- Position-based ordering
- Icon support

**activity_log**
- Audit trail
- User actions
- Entity tracking

---

## ⚙️ Setup Instructions

### 1. Create Supabase Project

```bash
# Visit https://supabase.com and create a new project
# Copy your credentials:
# - Project URL
# - Anon Key
# - Service Role Key
```

### 2. Run Database Schema

```bash
# Go to Supabase Dashboard > SQL Editor
# Paste the entire DATABASE_SCHEMA.sql
# Execute the script
```

### 3. Configure Environment Variables

```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Fill in your credentials:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
OPENAI_API_KEY=sk-your-key-here  # Optional
```

### 4. Setup Storage Buckets

In Supabase Dashboard > Storage:

```bash
# Create two public buckets:
1. news-images
2. event-images

# Set both to public (optional for authenticated-only access)
# Configure CORS settings if needed
```

### 5. Create Admin User

```sql
-- In Supabase Auth, create a user manually or via:
-- Then create profile:

INSERT INTO public.user_profiles (id, username, full_name, role, language)
VALUES (
  'user-id-from-auth',
  'admin',
  'Admin User',
  'admin',
  'en'
);
```

### 6. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 7. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 📡 API Routes

### AI Content Generation

**POST** `/api/ai/generate-content`

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

**Supports:**
- OpenAI (if OPENAI_API_KEY set)
- OpenRouter free models (fallback)

---

### Discord Post News

**POST** `/api/discord/post-news`

```json
{
  "id": "news-id",
  "title": "Article Title",
  "excerpt": "Brief summary",
  "featured_image_url": "https://...",
  "slug": "article-slug"
}
```

**Sends Rich Embed to Discord with:**
- Article title
- Excerpt as description
- Featured image
- Link to full article

---

### RSS Feed

**GET** `/api/rss?lang=en`

**Response:** XML RSS feed

**Query Parameters:**
- `lang`: Language (en, bg) - default: en
- `limit`: Number of articles - default: 50

---

### Discord Status

**GET** `/api/discord/status`

**Response:**
```json
{
  "connected": true,
  "guild": "Guild Name",
  "channels": [...]
}
```

---

## 🔧 Server Actions (CRUD)

All located in `lib/actions/`

### News Operations (`lib/actions/news.ts`)

```typescript
// Create
createNews({
  title: string
  content: string
  excerpt?: string
  imageUrls?: string[]
  featuredImageUrl?: string
  language: 'en' | 'bg'
  publishToDiscord?: boolean
  status?: 'draft' | 'published'
})

// Read
getNews(id: string)
listNews(language: 'en' | 'bg', status?: 'published' | 'draft')

// Update
updateNews(id: string, { ...same fields as create })

// Delete
deleteNews(id: string)
```

### Events Operations (`lib/actions/events.ts`)

```typescript
// Create
createEvent({
  title: string
  description?: string
  date: string (ISO)
  endDate?: string (ISO)
  location?: string
  imageUrl?: string
  language: 'en' | 'bg'
})

// ICS auto-generated for calendar export

// List
listEvents(language: 'en' | 'bg')

// Update/Delete similar to news
```

### Storage Operations (`lib/actions/storage.ts`)

```typescript
// Upload
uploadFile(
  file: Buffer,
  fileName: string,
  bucket: 'news-images' | 'event-images'
)

// Delete
deleteFile(filePath: string, bucket)
```

### Discord Settings (`lib/actions/discord.ts`)

```typescript
// Get settings (masked tokens)
getDiscordSettings()

// Update settings
updateDiscordSettings({
  webhookUrl?: string
  botToken?: string
  guildId?: string
  isActive?: boolean
})
```

---

## 🔐 Authentication & Middleware

### Middleware Flow

1. Request to `/admin/*` routes
2. Middleware checks authentication
3. Verifies user role (admin/editor)
4. Redirects to `/login` if unauthorized

### Login Page

**Route:** `/login`

Features:
- Email/password authentication
- Error handling
- Dark mode support
- Redirect to admin on success

### Protected Routes

All routes starting with `/admin` are protected:
- `/admin` - Dashboard
- `/admin/news` - News management
- `/admin/events` - Events management
- `/admin/discord` - Discord settings

---

## 🎨 Admin Components

### News Form Component

**File:** `components/admin/news/NewsForm.tsx`

**Features:**
- Multi-step form (Content → Images → Settings)
- Real-time field updates
- Image upload with preview
- AI content generation
- Language selection
- Status management
- Discord publishing toggle

**Usage:**

```tsx
import { NewsFormModal } from '@/components/admin/news/NewsFormModal'

export function NewsPage() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Add News</button>
      <NewsFormModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          // Refresh list
        }}
      />
    </>
  )
}
```

### Image Uploader Component

**File:** `components/admin/news/ImageUploader.tsx`

**Features:**
- Drag-and-drop interface
- Multiple file upload
- Image preview grid
- Remove individual images
- Progress indication
- File type validation

---

### AI Content Generator

**File:** `components/admin/news/AIContentGenerator.tsx`

**Features:**
- Generates content from title
- Streaming response display
- Copy to clipboard
- Use generated content button
- OpenAI or free models support
- Error handling

---

## 🤖 Discord Integration

### Setup Discord Bot

1. **Create Discord Application** at https://discord.com/developers/applications
2. **Get Bot Token** from the Bot section
3. **Create Webhook** in channel settings
4. **Add to Your Server** with administrator permissions

### Webhook vs Bot Token

**Webhook:** Simple posting to specific channel
- Easier setup
- No bot presence needed
- Good for posting content

**Bot Token:** Full Discord.js control
- Can manage server
- Create/delete channels
- Role management
- Member moderation

### In Admin Panel

1. Go to `/admin/discord`
2. Enter Webhook URL or Bot Token
3. Select active channel
4. Toggle activation
5. Test connection

### Auto-Post on News Publish

When publishing news with "Post to Discord" enabled:
1. Article saved to database
2. Server action triggered
3. Rich embed created with:
   - Article title
   - Excerpt
   - Featured image (if available)
   - Link to full article
4. Posted to configured Discord channel

---

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
- Visit https://vercel.com
- Connect your GitHub repo
- Vercel will auto-detect Next.js

3. **Set Environment Variables**
- In Vercel dashboard, go to Settings > Environment Variables
- Add all variables from `.env.local`

4. **Deploy**
- Vercel auto-deploys on push to main

### Self-Hosted (Docker)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t pgtk-app .
docker run -p 3000:3000 --env-file .env.local pgtk-app
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--color-primary-dark: #0047AB     /* Deep Blue */
--color-primary-light: #87CEEB   /* Sky Blue */

/* Dark Mode */
--color-dark-bg: #0f172a         /* Deep Navy */
--color-dark-surface: #1e293b     /* Slate */

/* Accents */
--color-success: #10b981
--color-warning: #f59e0b
--color-error: #ef4444
```

### Theme Implementation

Uses `next-themes` for persistence:

```tsx
import { ThemeProvider } from '@/components/providers/ThemeProvider'

// In root layout
export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}
```

Toggle dark mode:

```tsx
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  )
}
```

### Animations

Using Framer Motion for:
- Page transitions
- Modal animations
- Hover effects
- Loading spinners
- List item stagger effects

---

## 🐛 Troubleshooting

### Database Connection Issues

**Error:** `Failed to connect to Supabase`

**Solution:**
- Check URL and keys in `.env.local`
- Verify network connectivity
- Check Supabase project is active

### Authentication Not Working

**Error:** `Unauthorized` on admin routes

**Solution:**
- Ensure user exists in `user_profiles` table
- Check role is 'admin' or 'editor'
- Clear browser cookies and login again

### Images Not Uploading

**Error:** `Upload failed`

**Solution:**
- Check storage buckets exist
- Verify bucket permissions (public or authenticated)
- Ensure file size is under limits
- Check browser storage quota

### Discord Integration Not Working

**Error:** `Discord webhook not configured`

**Solution:**
- Verify webhook URL is correct
- Check webhook channel still exists
- Ensure bot has message permissions
- Test webhook with curl:

```bash
curl -X POST https://discordapp.com/api/webhooks/YOUR/WEBHOOK \
  -H "Content-Type: application/json" \
  -d '{"content":"Test"}'
```

### AI Content Generation Failing

**Error:** `Failed to generate content`

**Solution:**
- Check OpenAI API key is valid
- Verify API quota
- Check OpenRouter fallback is available
- Ensure title is not empty

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Discord.js Guide](https://discordjs.guide/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review console logs for errors
3. Check Supabase logs in dashboard
4. Review API responses in Network tab

---

**Last Updated:** January 2026
**Version:** 1.0.0
