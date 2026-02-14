# 📁 Project Structure

```
StudentCouncilPGTK/
├── supabase/
│   └── schema.sql                    # PostgreSQL schema
│
├── app/
│   ├── [locale]/                     # i18n routes
│   │   ├── layout.tsx                # Locale layout
│   │   ├── page.tsx                  # Homepage
│   │   ├── news/
│   │   │   ├── page.tsx              # News list
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # News detail
│   │   ├── events/
│   │   │   ├── page.tsx              # Events calendar
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Event detail
│   │   └── [slug]/
│   │       └── page.tsx              # Custom pages
│   │
│   ├── admin/                        # Protected admin routes
│   │   ├── layout.tsx                # Admin layout
│   │   ├── page.tsx                  # Admin dashboard
│   │   ├── news/
│   │   │   ├── page.tsx              # News management
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   └── discord/
│   │       └── page.tsx              # Discord management
│   │
│   ├── login/
│   │   └── page.tsx                  # Login page
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts          # Supabase auth callback
│   │   ├── ai/
│   │   │   └── generate/
│   │   │       └── route.ts          # OpenRouter AI generation
│   │   ├── discord/
│   │   │   ├── post/
│   │   │   │   └── route.ts          # Post to Discord
│   │   │   └── settings/
│   │   │       └── route.ts          # Discord settings CRUD
│   │   ├── upload/
│   │   │   └── route.ts              # Image upload to Supabase Storage
│   │   └── rss/
│   │       └── route.ts              # RSS feed
│   │
│   ├── layout.tsx                    # Root layout
│   ├── globals.css
│   └── loading.tsx
│
├── components/
│   ├── admin/
│   │   ├── news/
│   │   │   ├── NewsForm.tsx          # News form with AI & images
│   │   │   └── NewsList.tsx
│   │   ├── events/
│   │   │   └── EventForm.tsx
│   │   └── discord/
│   │       └── DiscordSettings.tsx
│   │
│   ├── animations/
│   │   ├── AnimatedLogo.tsx
│   │   └── Preloader.tsx
│   │
│   ├── events/
│   │   ├── EventsCalendar.tsx
│   │   ├── EventModal.tsx
│   │   └── CalendarExport.tsx        # .ics & Google Calendar
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── AppShell.tsx
│   │
│   ├── providers/
│   │   ├── ThemeProvider.tsx
│   │   └── SupabaseProvider.tsx
│   │
│   └── ui/                           # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── ImageUpload.tsx           # Drag & drop uploader
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Supabase client
│   │   ├── server.ts                 # Server-side Supabase
│   │   └── middleware.ts             # Auth middleware
│   │
│   ├── discord/
│   │   └── client.ts                 # Discord.js client
│   │
│   ├── i18n/
│   │   └── config.ts                 # next-intl config
│   │
│   └── utils/
│       ├── cn.ts
│       └── slugify.ts
│
├── middleware.ts                     # Next.js middleware (i18n + auth)
├── messages/                         # i18n translations
│   ├── bg.json
│   └── en.json
│
├── types/
│   ├── database.ts                   # Supabase types
│   └── events.ts
│
├── .env.local                        # Environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
