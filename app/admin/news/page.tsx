'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Filter, Newspaper, Edit2, Trash2, Eye, 
  Calendar, Clock, MoreVertical, Check, X, AlertCircle, Save, Loader2
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { News } from '@/types/database'

interface NewsItem {
  id: string
  title: string
  excerpt: string
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  views: number
  slug: string
}

export default function NewsManagementPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  // Fetch news from Supabase
  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const mappedNews: NewsItem[] = (data || []).map((item: News) => ({
        id: item.id,
        title: item.title?.bg || '',
        excerpt: item.excerpt?.bg || '',
        status: item.status,
        createdAt: item.created_at.split('T')[0],
        views: item.views,
        slug: item.slug,
      }))

      setNews(mappedNews)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleDelete = async (id: string) => {
    if (confirm('Сигурни ли сте, че искате да изтриете тази новина?')) {
      try {
        const { error } = await supabase
          .from('news')
          .delete()
          .eq('id', id)

        if (error) throw error
        setNews(prev => prev.filter(n => n.id !== id))
      } catch (error) {
        console.error('Error deleting news:', error)
        alert('Грешка при изтриване')
      }
    }
  }

  const handleSave = async (item: NewsItem) => {
    setSaving(true)
    try {
      const slug = item.slug || item.title.toLowerCase()
        .replace(/[^a-zа-я0-9\s]/gi, '')
        .replace(/\s+/g, '-')
        .substring(0, 50) + '-' + Date.now()

      if (item.id) {
        // Update existing
        const { error } = await supabase
          .from('news')
          .update({
            title: { bg: item.title },
            excerpt: { bg: item.excerpt },
            status: item.status,
            published_at: item.status === 'published' ? new Date().toISOString() : null,
          })
          .eq('id', item.id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('news')
          .insert({
            title: { bg: item.title },
            content: { bg: item.excerpt },
            excerpt: { bg: item.excerpt },
            slug,
            status: item.status,
            published_at: item.status === 'published' ? new Date().toISOString() : null,
          })

        if (error) throw error
      }

      await fetchNews()
      setIsModalOpen(false)
      setEditingNews(null)
    } catch (error) {
      console.error('Error saving news:', error)
      alert('Грешка при запазване')
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (id: string) => {
    const item = news.find(n => n.id === id)
    if (!item) return

    const newStatus = item.status === 'published' ? 'draft' : 'published'

    try {
      const { error } = await supabase
        .from('news')
        .update({ 
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null,
        })
        .eq('id', id)

      if (error) throw error
      setNews(prev => prev.map(n => 
        n.id === id ? { ...n, status: newStatus } : n
      ))
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const openModal = (item?: NewsItem) => {
    setEditingNews(item || { id: '', title: '', excerpt: '', status: 'draft', createdAt: '', views: 0, slug: '' })
    setIsModalOpen(true)
  }

  const statusColors = {
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    archived: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  }

  const statusLabels = {
    published: 'Публикувано',
    draft: 'Чернова',
    archived: 'Архив',
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
            <Newspaper className="w-8 h-8 text-primary" />
            Управление на новини
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Създавайте, редактирайте и публикувайте новини
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/admin/news/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          >
            <Plus className="w-5 h-5" />
            Нова новина
          </Link>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Търси новини..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border-0 rounded-xl shadow-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'published', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                filterStatus === status
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {status === 'all' ? 'Всички' : statusLabels[status as keyof typeof statusLabels]}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-12"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Зареждане...</span>
        </motion.div>
      )}

      {/* News List */}
      {!loading && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Заглавие</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Статус</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">Дата</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">Прегледи</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredNews.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{item.excerpt}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                      {statusLabels[item.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {item.createdAt}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {item.views}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          item.status === 'published'
                            ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                            : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                        title={item.status === 'published' ? 'Скрий' : 'Публикувай'}
                      >
                        {item.status === 'published' ? <Check className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => openModal(item)}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Редактирай"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Изтрий"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Няма намерени новини</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery ? 'Опитайте с друга ключова дума' : 'Създайте първата новина'}
            </p>
            {!searchQuery && (
              <Link
                href="/admin/news/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl"
              >
                <Plus className="w-4 h-4" />
                Нова новина
              </Link>
            )}
          </div>
        )}
      </motion.div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && editingNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingNews.id ? 'Редактиране на новина' : 'Нова новина'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave(editingNews)
                }}
                className="p-6 space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Заглавие *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingNews.title}
                    onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="Въведете заглавие..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Кратко описание
                  </label>
                  <textarea
                    value={editingNews.excerpt}
                    onChange={(e) => setEditingNews({ ...editingNews, excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Кратко описание на новината..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Съдържание
                  </label>
                  <textarea
                    rows={8}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Пълен текст на новината..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Статус
                  </label>
                  <div className="flex gap-3">
                    {(['draft', 'published'] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setEditingNews({ ...editingNews, status })}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                          editingNews.status === status
                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {statusLabels[status]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={saving}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                  >
                    Отказ
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {saving ? 'Запазване...' : 'Запази'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
