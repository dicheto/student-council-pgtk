# Уебсайт на Ученически Съвет - ПГТК

Модерен, анимиран уебсайт за ученически съвет, изграден с Next.js 14+, Framer Motion, и Tailwind CSS.

## 🚀 Бърз старт

### Инсталация

```bash
# Инсталиране на зависимости
npm install

# Стартиране на development сървъра
npm run dev
```

Отворете [http://localhost:3000](http://localhost:3000) в браузъра си.

### Build за production

```bash
npm run build
npm start
```

## 🎨 Особености

- ✨ **Супер модерен дизайн** с vibrant цветове и анимации
- 🎭 **Framer Motion** за плавни анимации и преходи
- 🌙 **Dark/Light Mode** с автоматично разпознаване на системните настройки
- 🌐 **Интернационализация** (подготовка за i18n)
- 📱 **Пълно responsive** дизайн
- 🎯 **Bento Grid Layout** за модерно представяне на съдържанието
- 🎪 **Parallax ефекти** в Hero секцията
- 🔄 **Анимирано лого** с концентрични кръгове

## 📁 Структура на проекта

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Главна страница
│   └── globals.css         # Global styles
├── components/
│   ├── animations/         # Анимационни компоненти
│   │   └── AnimatedLogo.tsx
│   ├── layout/             # Layout компоненти
│   │   ├── Header.tsx
│   │   └── BentoGrid.tsx
│   ├── sections/           # Секции на страницата
│   │   ├── Hero.tsx
│   │   ├── LatestNews.tsx
│   │   ├── UpcomingEvents.tsx
│   │   └── GalleryHighlights.tsx
│   └── providers/          # Context providers
│       └── ThemeProvider.tsx
└── lib/
    └── utils.ts            # Utility функции
```

## 🛠️ Технологии

- **Next.js 14+** - React framework с App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **date-fns** - Date formatting

## 🎨 Цветова палитра

- **Primary Blue**: `#1E3A8A`
- **Secondary Blue**: `#3B82F6`
- **Dark Mode Background**: `#0F172A`
- **Light Mode Background**: `#F8FAFC`

## 📝 Следващи стъпки

1. Интеграция с Supabase за база данни
2. Добавяне на пълна i18n поддръжка
3. Създаване на администраторска панел
4. Добавяне на реални изображения и съдържание
5. SEO оптимизация

## 📄 Лиценз

MIT
