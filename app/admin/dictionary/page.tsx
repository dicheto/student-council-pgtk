'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
  Globe,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

interface DictionaryEntry {
  id: string
  key: string
  category: string
  value_en: string
  value_bg: string
  description: string
  is_html: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

const categories = [
  { id: 'navigation', label: 'Навигация' },
  { id: 'hero', label: 'Hero секция' },
  { id: 'team', label: 'Екип' },
  { id: 'events', label: 'Събития' },
  { id: 'news', label: 'Новини' },
  { id: 'gallery', label: 'Галерия' },
  { id: 'footer', label: 'Подножие' },
  { id: 'buttons', label: 'Бутони' },
  { id: 'common', label: 'Общо' },
  { id: 'sections', label: 'Секции' },
]

export default function DictionaryPage() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([])
  const [selectedCategory, setSelectedCategory] = useState('navigation')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showNotification, setShowNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    key: '',
    value_en: '',
    value_bg: '',
    description: '',
    is_html: false,
    sort_order: 0,
  })

  // Fetch entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/dictionary?category=${selectedCategory}`)
        if (response.ok) {
          const data = await response.json()
          setEntries(data)
        }
      } catch (error) {
        console.error('Error fetching entries:', error)
        showError('Грешка при зареждане на данните')
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [selectedCategory])

  const filteredEntries = entries.filter(
    (entry) =>
      entry.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.value_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.value_bg.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = async () => {
    if (!formData.key || !formData.value_en || !formData.value_bg) {
      showError('Моля, попълнете всички задължителни полета')
      return
    }

    try {
      const response = await fetch('/api/dictionary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category: selectedCategory,
        }),
      })

      if (response.ok) {
        const newEntry = await response.json()
        setEntries([...entries, newEntry])
        resetForm()
        setIsCreating(false)
        showSuccess('Запис създаден успешно')
      } else {
        showError('Грешка при създаване на запис')
      }
    } catch (error) {
      console.error('Error creating entry:', error)
      showError('Грешка при създаване на запис')
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`/api/dictionary/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedEntry = await response.json()
        setEntries(entries.map((e) => (e.id === id ? updatedEntry : e)))
        setEditingId(null)
        resetForm()
        showSuccess('Запис актуализиран успешно')
      } else {
        showError('Грешка при актуализиране на запис')
      }
    } catch (error) {
      console.error('Error updating entry:', error)
      showError('Грешка при актуализиране на запис')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Сигурни ли сте че искате да изтриете този запис?')) {
      return
    }

    try {
      const response = await fetch(`/api/dictionary/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setEntries(entries.filter((e) => e.id !== id))
        showSuccess('Запис изтрит успешно')
      } else {
        showError('Грешка при изтриване на запис')
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
      showError('Грешка при изтриване на запис')
    }
  }

  const handleEdit = (entry: DictionaryEntry) => {
    setFormData({
      key: entry.key,
      value_en: entry.value_en,
      value_bg: entry.value_bg,
      description: entry.description,
      is_html: entry.is_html,
      sort_order: entry.sort_order,
    })
    setEditingId(entry.id)
    setIsCreating(false)
  }

  const resetForm = () => {
    setFormData({
      key: '',
      value_en: '',
      value_bg: '',
      description: '',
      is_html: false,
      sort_order: 0,
    })
    setEditingId(null)
  }

  const showSuccess = (message: string) => {
    setShowNotification({ type: 'success', message })
    setTimeout(() => setShowNotification(null), 3000)
  }

  const showError = (message: string) => {
    setShowNotification({ type: 'error', message })
    setTimeout(() => setShowNotification(null), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Речник на сайта
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Управляйте всички текстове на сайта от едно място
          </p>
        </div>
        <motion.button
          onClick={() => {
            resetForm()
            setIsCreating(true)
          }}
          disabled={isCreating || !!editingId}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Нов запис
        </motion.button>
      </motion.div>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl flex items-center gap-3 ${
              showNotification.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
            }`}
          >
            {showNotification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <p
              className={
                showNotification.type === 'success'
                  ? 'text-emerald-800 dark:text-emerald-200'
                  : 'text-red-800 dark:text-red-200'
              }
            >
              {showNotification.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
        <div className="flex overflow-x-auto gap-2 pb-2">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id)
                setSearchQuery('')
                resetForm()
              }}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel */}
        {(isCreating || editingId) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingId ? 'Редактиране на запис' : 'Нов запис'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ключ *
                </label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) =>
                    setFormData({ ...formData, key: e.target.value })
                  }
                  disabled={!!editingId}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="напр: hero.title"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Примери: hero.title, team.subtitle, btn.save
                </p>
              </div>

              {/* English Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Стойност на английски *
                </label>
                <textarea
                  value={formData.value_en}
                  onChange={(e) =>
                    setFormData({ ...formData, value_en: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Текст на английски..."
                />
              </div>

              {/* Bulgarian Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Стойност на български *
                </label>
                <textarea
                  value={formData.value_bg}
                  onChange={(e) =>
                    setFormData({ ...formData, value_bg: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Текст на български..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Описание
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Описание на записа..."
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ред на сортиране
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_order: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* HTML Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_html}
                  onChange={(e) =>
                    setFormData({ ...formData, is_html: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Това е HTML съдържание
                </span>
              </label>

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <motion.button
                  onClick={() =>
                    editingId
                      ? handleUpdate(editingId)
                      : handleCreate()
                  }
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  {editingId ? 'Актуализирай' : 'Създай'}
                </motion.button>
                <motion.button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Отмени
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Entries List */}
        <div className={isCreating || editingId ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Търсене в записите..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Зареждане...</p>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery
                    ? 'Няма намерени записи'
                    : 'Няма записи за тази категория'}
                </p>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                          {entry.key}
                        </code>
                        {entry.is_html && (
                          <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded">
                            HTML
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">BG:</span> {entry.value_bg}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">EN:</span> {entry.value_en}
                        </p>
                      </div>
                      {entry.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {entry.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handleEdit(entry)}
                        disabled={isCreating || !!editingId}
                        className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(entry.id)}
                        disabled={isCreating || !!editingId}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
