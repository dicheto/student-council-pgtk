'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Loader } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Connect to email service or API
      console.log('Form submitted:', formData)
      
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

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
                Връзка с Ученическия съвет
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Пиши ни спокойно и директно.
            </h1>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Въпроси, идеи или обратна връзка — всичко стига до правилните хора.
            </p>
          </motion.div>
        </header>

        {/* Content */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
              Информация за контакт
            </h2>

            {/* Email */}
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Имейл</h3>
                <a
                  href="mailto:contact@pgtk.bg"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  contact@pgtk.bg
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Телефон</h3>
                <a
                  href="tel:+359xxxxxxxxx"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  +359 XXX XXX XXX
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Адрес</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  ПГТК<br />
                  България
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-6 apple-glass p-6 sm:p-8">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Име
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Вашето име"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Имейл
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Тема
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Тема на съобщението"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Съобщение
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Вашето съобщение..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center space-x-2 rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Изпращане...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Изпрати съобщение</span>
                  </>
                )}
              </button>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg"
                >
                  Благодаря! Съобщението ти е изпратено успешно.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
