import { motion } from 'framer-motion'
import { CheckCircle, Zap, Shield, Globe } from 'lucide-react'

export default function FeaturesPage() {
  const features = [
    {
      icon: Zap,
      title: 'Бързо и Отзивчиво',
      description: 'Оптимизирано за производителност със всички последни технологии'
    },
    {
      icon: Shield,
      title: 'Безопасност на първо място',
      description: 'Защитени данни с ROW Level Security и криптография'
    },
    {
      icon: Globe,
      title: 'Многоезично',
      description: 'Поддръжка за английски и български език'
    },
    {
      icon: CheckCircle,
      title: 'SEO оптимизирано',
      description: 'Пълна поддръжка за търсачки и социални мрежи'
    },
  ]

  const pages = [
    { name: 'Начало', slug: '/', description: 'Главна страница със всички секции' },
    { name: 'За нас', slug: '/about', description: 'Информация за ученическия съвет' },
    { name: 'Новини', slug: '/news', description: 'Всички публикувани новини' },
    { name: 'Новина - Детайл', slug: '/news/[slug]', description: 'Пълна новина със съдържание' },
    { name: 'Събития', slug: '/events', description: 'Календар на събитията' },
    { name: 'Галерия', slug: '/gallery', description: 'Фотографии и видео съдържание' },
    { name: 'Контакти', slug: '/contact', description: 'Формуляр за контакт' },
    { name: 'Админ - Dashboard', slug: '/admin', description: 'Статистика и преглед' },
    { name: 'Админ - Новини', slug: '/admin/news', description: 'Управление на новини' },
    { name: 'Админ - Discord', slug: '/admin/discord', description: 'Интеграция с Discord' },
    { name: 'Login', slug: '/login', description: 'Форма за вход' },
  ]

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0b0d12] pt-24 pb-20">
      <div className="pointer-events-none absolute inset-0 bg-apple-grid opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.04]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 apple-glass">
              <span className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-200">
                Какво получаваш в кутията
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Функции и възможности.
            </h1>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Съвременно, поддържаемо приложение, готово за реална ученическа организация.
            </p>
          </motion.div>
        </header>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="mb-8 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
            Основни характеристики
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                  <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                    className="apple-glass p-6"
                >
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Pages Section */}
        <div>
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
            Страници в проекта
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {pages.map((page, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="apple-glass p-6 hover:-translate-y-0.5 transition-transform"
              >
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">{page.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{page.description}</p>
                    <code className="text-xs bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-gray-300 px-2 py-1 rounded mt-2 inline-block">
                      {page.slug}
                    </code>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 apple-glass p-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
            Технологичен стек
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              'Next.js 14',
              'TypeScript',
              'Tailwind CSS',
              'Framer Motion',
              'Supabase',
              'PostgreSQL',
              'Discord.js',
              'Openrouter API'
            ].map((tech, i) => (
              <div
                key={i}
                className="rounded-lg bg-white/70 px-4 py-3 text-center text-sm font-semibold text-slate-900 dark:bg-white/5 dark:text-slate-100"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
