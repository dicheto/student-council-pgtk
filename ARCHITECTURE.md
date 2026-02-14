# Архитектурен план - Уебсайт на Ученически Съвет

## 📋 Общ преглед

Модерен, анимиран уебсайт за ученически съвет, изграден с **Next.js 14+ (App Router)**, **Supabase** за база данни и автентификация, с пълна поддръжка за интернационализация и dark/light режим.

---

## 🎨 Дизайн система

### Цветова палитра
- **Primary Blue**: `#1E3A8A` (тъмно синьо от логото)
- **Secondary Blue**: `#3B82F6` (светло синьо от логото)
- **Accent White**: `#FFFFFF`
- **Dark Mode Background**: `#0F172A`
- **Dark Mode Surface**: `#1E293B`
- **Light Mode Background**: `#F8FAFC`
- **Light Mode Surface**: `#FFFFFF`

### Типография
- **Heading Font**: Inter / Poppins (модерен, четим)
- **Body Font**: Inter / System UI
- **Monospace**: JetBrains Mono (за код/технически секции)

---

## 🏗️ Технологичен стек

### Core
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage

### Анимации и UI
- **Animation Library**: Framer Motion
- **UI Components**: Radix UI / shadcn/ui
- **Icons**: Lucide React / Heroicons
- **Form Handling**: React Hook Form + Zod

### Интернационализация
- **i18n Library**: next-intl
- **Supported Languages**: Български (bg), English (en)

### Допълнителни инструменти
- **State Management**: Zustand / React Context
- **Data Fetching**: TanStack Query (React Query)
- **Date Handling**: date-fns
- **Validation**: Zod
- **Environment Variables**: dotenv

---

## 📁 Структура на проекта

```
StudentCouncilPGTK/
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── logo-animated.svg
│   │   └── assets/
│   ├── locales/
│   │   ├── bg/
│   │   └── en/
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx              # Root layout с i18n
│   │   │   ├── page.tsx                # Главна страница
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── events/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── news/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── gallery/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   └── admin/
│   │   │       ├── layout.tsx          # Admin layout с защита
│   │   │       ├── page.tsx            # Admin dashboard
│   │   │       ├── events/
│   │   │       │   ├── page.tsx        # Управление на събития
│   │   │       │   ├── create/
│   │   │       │   │   └── page.tsx
│   │   │       │   └── [id]/
│   │   │       │       └── edit/
│   │   │       │           └── page.tsx
│   │   │       ├── news/
│   │   │       │   ├── page.tsx        # Управление на новини
│   │   │       │   ├── create/
│   │   │       │   │   └── page.tsx
│   │   │       │   └── [id]/
│   │   │       │       └── edit/
│   │   │       │           └── page.tsx
│   │   │       ├── gallery/
│   │   │       │   └── page.tsx        # Управление на галерия
│   │   │       ├── users/
│   │   │       │   └── page.tsx        # Управление на потребители
│   │   │       └── settings/
│   │   │           └── page.tsx       # Настройки на сайта
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── callback/
│   │   │   │   │   └── route.ts        # Supabase auth callback
│   │   │   │   └── logout/
│   │   │   │       └── route.ts
│   │   │   ├── events/
│   │   │   │   └── route.ts
│   │   │   ├── news/
│   │   │   │   └── route.ts
│   │   │   └── upload/
│   │   │       └── route.ts
│   │   │
│   │   ├── loading.tsx                 # Global loading UI
│   │   ├── error.tsx                   # Global error boundary
│   │   ├── not-found.tsx               # 404 page
│   │   ├── layout.tsx                  # Root layout
│   │   └── globals.css                 # Global styles
│   │
│   ├── components/
│   │   ├── ui/                         # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx              # Навигация с анимации
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx             # Admin sidebar
│   │   │   └── ThemeToggle.tsx         # Dark/Light mode toggle
│   │   │
│   │   ├── animations/
│   │   │   ├── Preloader.tsx           # Custom animated preloader
│   │   │   ├── PageTransition.tsx      # Page transition wrapper
│   │   │   ├── ScrollReveal.tsx        # Scroll animations
│   │   │   ├── AnimatedLogo.tsx        # Logo с концентрични кръгове
│   │   │   └── ParallaxSection.tsx     # Parallax ефекти
│   │   │
│   │   ├── features/
│   │   │   ├── events/
│   │   │   │   ├── EventCard.tsx
│   │   │   │   ├── EventList.tsx
│   │   │   │   └── EventForm.tsx
│   │   │   ├── news/
│   │   │   │   ├── NewsCard.tsx
│   │   │   │   ├── NewsList.tsx
│   │   │   │   └── NewsForm.tsx
│   │   │   ├── gallery/
│   │   │   │   ├── GalleryGrid.tsx
│   │   │   │   └── ImageModal.tsx
│   │   │   └── contact/
│   │   │       └── ContactForm.tsx
│   │   │
│   │   └── admin/
│   │       ├── DashboardStats.tsx
│   │       ├── DataTable.tsx
│   │       └── AdminGuard.tsx          # Route protection
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts               # Supabase client
│   │   │   ├── server.ts               # Server-side Supabase
│   │   │   ├── middleware.ts           # Auth middleware
│   │   │   └── types.ts                # Database types
│   │   │
│   │   ├── i18n/
│   │   │   ├── config.ts               # i18n конфигурация
│   │   │   ├── messages/
│   │   │   │   ├── bg.json
│   │   │   │   └── en.json
│   │   │   └── utils.ts
│   │   │
│   │   ├── theme/
│   │   │   ├── provider.tsx            # Theme context
│   │   │   └── utils.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts                   # Class name utility
│   │   │   ├── date.ts                 # Date formatting
│   │   │   └── validation.ts
│   │   │
│   │   └── hooks/
│   │       ├── useAuth.ts
│   │       ├── useTheme.ts
│   │       ├── useScrollAnimation.ts
│   │       └── useMediaQuery.ts
│   │
│   ├── store/
│   │   ├── authStore.ts                # Auth state (Zustand)
│   │   ├── themeStore.ts               # Theme state
│   │   └── uiStore.ts                  # UI state
│   │
│   └── types/
│       ├── database.ts                 # Supabase types
│       ├── events.ts
│       ├── news.ts
│       └── user.ts
│
├── middleware.ts                       # Next.js middleware (i18n + auth)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── .env.local                          # Environment variables
```

---

## 🗄️ База данни (Supabase Schema)

### Таблици

#### `users` (extended from Supabase Auth)
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `events`
```sql
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title JSONB NOT NULL, -- {bg: "...", en: "..."}
  description JSONB NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
  featured BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_start_date ON public.events(start_date);
```

#### `news`
```sql
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title JSONB NOT NULL,
  content JSONB NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt JSONB,
  image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_news_status ON public.news(status);
CREATE INDEX idx_news_published_at ON public.news(published_at);
```

#### `gallery`
```sql
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title JSONB,
  description JSONB,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gallery_category ON public.gallery(category);
CREATE INDEX idx_gallery_featured ON public.gallery(featured);
```

#### `settings`
```sql
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

```sql
-- Events: Public read, Admin write
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone"
  ON public.events FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'moderator')
    )
  );

-- News: Public read, Admin write
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "News are viewable by everyone"
  ON public.news FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can manage news"
  ON public.news FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'moderator')
    )
  );

-- Gallery: Public read, Admin write
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery is viewable by everyone"
  ON public.gallery FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage gallery"
  ON public.gallery FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'moderator')
    )
  );
```

---

## 🎭 Анимации и преходи

### 1. Animated Preloader
**Компонент**: `components/animations/Preloader.tsx`

**Функционалност**:
- Концентрични кръгове, анимирани от центъра навън
- Централна буква "T" с fade-in анимация
- Пълно зареждане на страницата преди показване
- Smooth fade-out преход към основното съдържание

**Framer Motion анимации**:
```typescript
// Концентрични кръгове
const circleVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: [0, 1, 0.8],
    transition: {
      delay: i * 0.2,
      duration: 1.2,
      ease: "easeOut"
    }
  })
};

// Централна буква T
const letterVariants = {
  hidden: { scale: 0, rotate: -180, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      delay: 0.8,
      duration: 0.8,
      ease: "backOut"
    }
  }
};
```

### 2. Page Transitions
**Компонент**: `components/animations/PageTransition.tsx`

**Ефекти**:
- Fade + Slide анимации между страници
- Direction-aware transitions (напред/назад)
- Loading states с skeleton screens

### 3. Scroll Animations
**Компонент**: `components/animations/ScrollReveal.tsx`

**Ефекти**:
- Fade-in при скролване
- Stagger animations за списъци
- Parallax за hero секции
- Progress indicators

### 4. Component Animations
- **Cards**: Hover scale + shadow
- **Buttons**: Ripple effect + press animation
- **Forms**: Input focus animations
- **Modals**: Backdrop blur + scale entrance
- **Navigation**: Smooth scroll + active state indicators

---

## 🌐 Интернационализация (i18n)

### Конфигурация
**Файл**: `lib/i18n/config.ts`

```typescript
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../../messages/${locale}.json`)).default
}));
```

### Структура на съобщенията
```json
// messages/bg.json
{
  "common": {
    "welcome": "Добре дошли",
    "readMore": "Прочети повече",
    "loading": "Зареждане..."
  },
  "navigation": {
    "home": "Начало",
    "about": "За нас",
    "events": "Събития",
    "news": "Новини",
    "gallery": "Галерия",
    "contact": "Контакти"
  },
  "events": {
    "title": "Събития",
    "upcoming": "Предстоящи събития",
    "past": "Минали събития"
  }
}
```

### Middleware за локализация
**Файл**: `middleware.ts`

```typescript
import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

export default createMiddleware({
  locales: ['bg', 'en'],
  defaultLocale: 'bg',
  localePrefix: 'always'
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
```

---

## 🎨 Dark/Light Mode

### Реализация
**Файл**: `lib/theme/provider.tsx`

**Функционалност**:
- System preference detection
- Manual toggle с запазване в localStorage
- Smooth transitions между режими
- CSS variables за динамични цветове

**Tailwind конфигурация**:
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A',
          light: '#3B82F6',
        },
        background: {
          light: '#F8FAFC',
          dark: '#0F172A',
        }
      }
    }
  }
}
```

---

## 🔐 Автентификация и авторизация

### Supabase Auth Flow
1. **Login**: Email/Password или OAuth (Google, GitHub)
2. **Session Management**: Server-side session validation
3. **Role-based Access**: Admin/Moderator/User роли
4. **Protected Routes**: Middleware за `/admin/*` пътища

### Admin Guard
**Компонент**: `components/admin/AdminGuard.tsx`

```typescript
// Проверка за admin роля
const { user, role } = useAuth();
if (role !== 'admin' && role !== 'moderator') {
  redirect('/');
}
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile-first подход
- Touch-friendly интерфейс
- Swipe жестове за галерия
- Collapsible навигация
- Optimized images (Next.js Image)

---

## 🚀 Performance оптимизации

### Next.js оптимизации
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Font Optimization**: next/font
- **Static Generation**: ISR за публични страници
- **API Routes**: Edge functions където е възможно

### Анимации
- **GPU Acceleration**: `transform` и `opacity` за анимации
- **Will-change**: За предстоящи анимации
- **Reduced Motion**: Respect `prefers-reduced-motion`

### Caching
- **React Query**: Client-side caching
- **Supabase**: Query caching
- **Static Assets**: CDN caching

---

## 🔧 Development Workflow

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:types": "supabase gen types typescript --local > src/types/database.ts"
  }
}
```

---

## 📦 Ключови зависимости

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/ssr": "^0.0.10",
    "framer-motion": "^10.16.0",
    "next-intl": "^3.0.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.292.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.2.0",
    "eslint": "^8.50.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

---

## 🎯 Функционални изисквания

### Публична зона
1. **Главна страница**
   - Hero секция с анимиран лого
   - Предстоящи събития (carousel)
   - Последни новини
   - Статистики/Достижения
   - Call-to-action секции

2. **Събития**
   - Списък с филтри (дата, категория)
   - Детайлна страница за събитие
   - Календарен изглед
   - Регистрация за събития

3. **Новини**
   - Списък с пагинация
   - Детайлна страница с коментари (опционално)
   - Категории и тагове
   - Търсене

4. **Галерия**
   - Grid/Masonry layout
   - Lightbox за изображения
   - Категории
   - Infinite scroll или пагинация

5. **Контакти**
   - Контактна форма
   - Карта (опционално)
   - Социални мрежи

### Администраторска зона
1. **Dashboard**
   - Статистики (събития, новини, потребители)
   - Графики и аналитика
   - Последни активности

2. **Управление на събития**
   - CRUD операции
   - Rich text editor
   - Image upload
   - Публикуване/Отмяна

3. **Управление на новини**
   - CRUD операции
   - Rich text editor
   - SEO настройки
   - Планиране на публикуване

4. **Управление на галерия**
   - Bulk upload
   - Image optimization
   - Категоризация
   - Drag & drop сортиране

5. **Управление на потребители**
   - Списък с роли
   - Промяна на роли
   - Деактивиране на акаунти

6. **Настройки**
   - Общи настройки на сайта
   - SEO настройки
   - Email настройки (опционално)

---

## 🧪 Тестване

### Планирани тестове
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **Visual Regression**: Chromatic (опционално)

---

## 📈 SEO и Accessibility

### SEO
- Meta tags (title, description, OG)
- Structured data (JSON-LD)
- Sitemap generation
- Robots.txt

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- WCAG 2.1 AA compliance
- Focus management

---

## 🚢 Deployment

### Рекомендувани платформи
- **Vercel** (оптимизирано за Next.js)
- **Netlify** (алтернатива)

### CI/CD
- Automated builds при push
- Environment variables management
- Preview deployments за PRs

---

## 📝 Следващи стъпки

1. ✅ Създаване на архитектурен план (текущ документ)
2. ⏭️ Инициализация на Next.js проект
3. ⏭️ Настройка на Supabase проект и схема
4. ⏭️ Интеграция на i18n
5. ⏭️ Създаване на дизайн система и компоненти
6. ⏭️ Имплементация на анимации
7. ⏭️ Разработка на публичната зона
8. ⏭️ Разработка на администраторската зона
9. ⏭️ Тестване и оптимизация
10. ⏭️ Deployment

---

## 📚 Допълнителни ресурси

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

*Този документ е жива спецификация и трябва да се актуализира с развитието на проекта.*
