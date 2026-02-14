import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'
import Link from 'next/link'

export default function StatusPage() {
  const completedFeatures = [
    '✅ Многоезична поддръжка (BG, EN)',
    '✅ Пълна аутентификация със Supabase',
    '✅ Admin панел със управление на новини',
    '✅ Discord интеграция',
    '✅ Администратор и редактор роли',
    '✅ Резуме система със аутоматични временни белези',
    '✅ RLS политики за сигурност',
    '✅ Отзивчив дизайн (мобилен, таблет, десктоп)',
    '✅ Dark/Light режим',
    '✅ SEO оптимизирано',
    '✅ Преди-построени компоненти със Framer Motion анимации',
    '✅ PostgreSQL база данни със Supabase',
  ]

  const pages = [
    { name: 'Начало (Home)', icon: '🏠', ready: true },
    { name: 'За нас (About)', icon: 'ℹ️', ready: true },
    { name: 'Новини (News)', icon: '📰', ready: true },
    { name: 'Новина Детайл (News Detail)', icon: '📄', ready: true },
    { name: 'Събития (Events)', icon: '📅', ready: true },
    { name: 'Галерия (Gallery)', icon: '🖼️', ready: true },
    { name: 'Контакти (Contact)', icon: '📧', ready: true },
    { name: 'Админ Dashboard', icon: '📊', ready: true },
    { name: 'Админ Новини', icon: '✏️', ready: true },
    { name: 'Админ Discord', icon: '🤖', ready: true },
    { name: 'Login', icon: '🔐', ready: true },
  ]

  const nextSteps = [
    'Конфигурирай Discord webhook URL за автоматично постване',
    'Конфигурирай Openrouter API ключ за AI генериране на съдържание',
    'Кастомизирай брандинг и лога',
    'Добави реални снимки и съдържание',
    'Конфигурирай имейл сервис за контакт форма',
    'Деплой на production (Vercel/Netlify)',
    'Конфигурирай DNS и SSL сертификат',
    'Добави Google Analytics за мониторинг',
  ]

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0b0d12] pt-24 pb-20">
      <div className="pointer-events-none absolute inset-0 bg-apple-grid opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.03] dark:opacity-[0.04]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.61, 0.35, 1] }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  Приложението е готово за работа.
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Състояние на страниците, функциите и следващите стъпки.
                </p>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Completion Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16 apple-glass p-6 sm:p-8"
        >
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
            Статус на завършване
          </h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">Прогрес</span>
            <span className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">100%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-emerald-100 dark:bg-emerald-900/40">
            <div className="h-3 w-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
          </div>
        </motion.div>

        {/* All Pages */}
        <div className="mb-16">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
            Страници
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pages.map((page, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4 rounded-2xl apple-glass p-4"
              >
                <span className="text-3xl">{page.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white">{page.name}</p>
                </div>
                {page.ready && <CheckCircle className="w-5 h-5 text-green-600" />}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Completed Features */}
        <div className="mb-16">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
            Реализирани функции
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {completedFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3 rounded-2xl bg-white/70 p-4 text-sm text-slate-800 dark:bg-white/5 dark:text-slate-100"
              >
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="apple-glass p-6 sm:p-8"
        >
          <div className="mb-4 flex items-center space-x-3">
            <Info className="h-5 w-5 text-blue-600" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
              Следващи стъпки
            </h2>
          </div>
          <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
            {nextSteps.map((step, i) => (
              <li key={i} className="flex items-start space-x-3">
                <span className="font-semibold text-blue-600 dark:text-blue-400">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
            Готов ли си да пуснеш сайта към учениците и учителите?
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900"
            >
              Към Начало
            </Link>
            <Link
              href="/admin"
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Към Admin Панел
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
