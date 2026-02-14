# 🎓 Student Council PGTK - Web Application

> **Production-Ready** | **Open Source** | **Built with Next.js 14 + Supabase + Discord**

A modern, fully-functional web application for school student councils with news management, event calendar, AI-powered content generation, and Discord integration.

![GitHub](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-v2-green)

---

## 📸 Features

### ✨ Core Features

- **📰 News Management**
  - CRUD operations for articles
  - Multi-language support (English, Bulgarian)
  - Featured images and galleries
  - Draft/Published/Archived status
  - SEO metadata
  - Automatic Discord posting

- **📅 Event Calendar**
  - Beautiful calendar interface
  - Event creation and management
  - ICS export (Apple Calendar, Outlook)
  - Google Calendar integration
  - Color-coded events
  - Location tracking

- **🤖 AI Content Generation**
  - OpenAI integration
  - OpenRouter free models (fallback)
  - Real-time content streaming
  - One-click article generation
  - Copy to clipboard

- **🖼️ Image Management**
  - Drag-and-drop upload
  - Batch upload support
  - Supabase Storage integration
  - Image preview grid
  - Automatic URL generation

- **💬 Discord Integration**
  - Webhook posting
  - Rich embeds with images
  - Auto-post on publish
  - Discord channel management
  - Webhook testing

- **📡 RSS Feed**
  - Multilingual feeds
  - Auto-generated from published articles
  - Standard RSS 2.0 format
  - External feed readers compatible

- **🌙 Dark/Light Theme**
  - Persistent theme preference
  - Smooth transitions
  - Deep navy dark mode
  - Full accessibility support

- **📱 Responsive Design**
  - Mobile-first approach
  - Tablet optimized
  - Desktop full-featured
  - Touch-friendly controls

- **🔐 Authentication & Security**
  - Supabase Auth integration
  - Role-based access control
  - Protected routes with middleware
  - RLS policies on all tables
  - Activity logging

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **next-intl** - Internationalization
- **next-themes** - Theme management

### Backend
- **Node.js** - Server runtime
- **Supabase** - PostgreSQL database & auth
- **Supabase Storage** - File hosting
- **API Routes** - Serverless functions

### External APIs
- **OpenAI** - Content generation
- **Discord.js** - Bot integration
- **Discord Webhooks** - Message posting

### DevOps
- **Vercel** - Recommended hosting
- **Docker** - Container support
- **GitHub** - Version control

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account (free)

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd StudentCouncilPGTK
npm install
```

2. **Configure environment**
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

3. **Setup Supabase**
- Create project at supabase.com
- Run DATABASE_SCHEMA.sql in SQL Editor
- Create storage buckets: `news-images`, `event-images`

4. **Start development**
```bash
npm run dev
# Visit http://localhost:3000
```

5. **Login**
- Visit http://localhost:3000/login
- Use credentials from Supabase Auth

**For detailed setup, see [QUICK_START.md](./QUICK_START.md)**

---

## 📁 Project Structure

```
app/                          # Next.js App Router
├── api/                      # API routes
│   ├── ai/                   # AI content generation
│   ├── discord/              # Discord integration
│   └── rss/                  # RSS feed
├── admin/                    # Protected admin routes
│   ├── news/                 # News management
│   ├── events/               # Events management
│   └── discord/              # Discord settings
├── login/                    # Authentication
├── news/                     # Public news page
├── events/                   # Public events page
└── layout.tsx                # Root layout

components/                   # React components
├── admin/                    # Admin components
│   ├── news/                 # News CRUD components
│   ├── discord/              # Discord settings
│   └── ...
├── events/                   # Event components
├── layout/                   # Layout components
├── providers/                # Context providers
└── animations/               # Framer Motion animations

lib/                          # Utilities
├── supabase/                 # Supabase clients
├── actions/                  # Server actions (CRUD)
└── utils.ts                  # Helper functions

types/                        # TypeScript types
public/                       # Static assets
```

**For full structure, see [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)**

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](./QUICK_START.md) | 5-minute setup guide |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Complete technical reference |
| [DATABASE_SCHEMA.sql](./DATABASE_SCHEMA.sql) | SQL schema with RLS policies |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Production deployment guide |

---

## 🎯 API Endpoints

### Public Endpoints
```
GET  /api/rss?lang=en           # RSS feed
GET  /api/discord/status        # Bot status
```

### Admin Endpoints (Protected)
```
POST /api/ai/generate-content   # AI generation
POST /api/discord/post-news     # Post to Discord
POST /api/discord/webhooks      # Webhook management
```

**See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md#-api-routes) for detailed API docs**

---

## 🔐 Security Features

- ✅ **Supabase Auth** - Secure authentication
- ✅ **Row Level Security** - Database-level access control
- ✅ **Middleware Protection** - Route-level authorization
- ✅ **Role-Based Access** - Admin/Editor/User roles
- ✅ **Environment Variables** - Secret management
- ✅ **Token Masking** - Sensitive data protection
- ✅ **Activity Logging** - Audit trail

---

## 🌍 Supported Languages

- 🇬🇧 English (en)
- 🇧🇬 Bulgarian (bg)

Add more languages in:
- Database schema
- Content management
- `next.config.js`

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
git push origin main
# Auto-deploys to Vercel
```

### Self-Hosted
```bash
npm run build
npm start
# Or use Docker
docker build -t pgtk-app .
docker run -p 3000:3000 pgtk-app
```

**See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for complete deployment guide**

---

## 📊 Database Schema Highlights

### Core Tables
- `user_profiles` - User information & roles
- `news` - Articles with multilingual support
- `events` - Calendar events with ICS
- `discord_settings` - Bot/webhook configuration
- `custom_pages` - Static pages
- `media` - File tracking
- `activity_log` - Audit trail

### Key Features
- ✅ Row Level Security (RLS)
- ✅ Automatic timestamps
- ✅ Indexes for performance
- ✅ Cascading deletes
- ✅ Check constraints

---

## 🎨 Design System

### Color Palette
- **Primary Dark**: `#0047AB` (Deep Blue)
- **Primary Light**: `#87CEEB` (Sky Blue)
- **Dark Mode**: Deep Navy (`#0f172a`)

### Components
- Reusable components in `components/`
- Animations with Framer Motion
- Responsive Tailwind CSS
- Dark/Light theme support

---

## 🔧 Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Environment Variables
See `.env.example` for all required variables

### Type Safety
- Full TypeScript support
- Strict mode enabled
- Type-safe server actions

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend services
- [Vercel](https://vercel.com) - Hosting platform
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Discord.js](https://discord.js.org/) - Discord integration

---

## 📞 Support

- 📖 [Documentation](./IMPLEMENTATION_GUIDE.md)
- ✅ [Checklist](./DEPLOYMENT_CHECKLIST.md)
- 🚀 [Quick Start](./QUICK_START.md)

---

## 🗓️ Roadmap

- [ ] Multi-channel Discord posting
- [ ] Telegram integration
- [ ] Advanced analytics
- [ ] Content calendar
- [ ] User comments system
- [ ] Email notifications
- [ ] API documentation (Swagger)
- [ ] Mobile app (React Native)

---

## 📈 Stats

- **Lines of Code**: 5000+
- **Components**: 30+
- **API Routes**: 8+
- **Supported Languages**: 2
- **Deployment Options**: 2+

---

**Made with ❤️ for Student Council PGTK**

*Ready to deploy? See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)*
