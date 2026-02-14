'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Calendar, Edit2, Trash2, 
  MapPin, Clock, Star, X, Save, Eye, Users, Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Event } from '@/types/database'

interface EventItem {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  status: 'draft' | 'published' | 'cancelled'
  featured: boolean
  slug: string
}

export default function EventsManagementPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false })

      if (error) throw error

      const mappedEvents: EventItem[] = (data || []).map((item: Event) => {
        const startDate = new Date(item.start_date)
        return {
          id: item.id,
          title: item.title?.bg || '',
          description: item.description?.bg || '',
          date: startDate.toISOString().split('T')[0],
          time: startDate.toTimeString().slice(0, 5),
          location: item.location || '',
          status: item.status,
          featured: item.featured,
          slug: item.slug,
        }
      })

      setEvents(mappedEvents)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleDelete = async (id: string) => {
    if (confirm('Сигурни ли сте, че искате да изтриете това събитие?')) {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', id)

        if (error) throw error
        setEvents(prev => prev.filter(e => e.id !== id))
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('Грешка при изтриване')
      }
    }
  }

  const handleSave = async (item: EventItem) => {
    setSaving(true)
    try {
      const slug = item.slug || item.title.toLowerCase()
        .replace(/[^a-zа-я0-9\s]/gi, '')
        .replace(/\s+/g, '-')
        .substring(0, 50) + '-' + Date.now()

      const startDate = new Date(`${item.date}T${item.time}:00`)

      if (item.id) {
        const { error } = await supabase
          .from('events')
          .update({
            title: { bg: item.title },
            description: { bg: item.description },
            start_date: startDate.toISOString(),
            location: item.location,
            status: item.status,
            featured: item.featured,
          })
          .eq('id', item.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('events')
          .insert({
            title: { bg: item.title },
            description: { bg: item.description },
            slug,
            start_date: startDate.toISOString(),
            location: item.location,
            status: item.status,
            featured: item.featured,
          })

        if (error) throw error
      }

      await fetchEvents()
      setIsModalOpen(false)
      setEditingEvent(null)
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Грешка при запазване')
    } finally {
      setSaving(false)
    }
  }

  const toggleFeatured = async (id: string) => {
    const item = events.find(e => e.id === id)
    if (!item) return

    try {
      const { error } = await supabase
        .from('events')
        .update({ featured: !item.featured })
        .eq('id', id)

      if (error) throw error
      setEvents(prev => prev.map(e => 
        e.id === id ? { ...e, featured: !e.featured } : e
      ))
    } catch (error) {
      console.error('Error updating featured:', error)
    }
  }

  const openModal = (item?: EventItem) => {
    setEditingEvent(item || { 
      id: '', 
      title: '', 
      description: '', 
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      location: '',
      status: 'draft', 
      featured: false,
      slug: '',
    })
    setIsModalOpen(true)
  }

  const statusColors = {
    draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  const statusLabels = {
    draft: 'Чернова',
    published: 'Публикувано',
    cancelled: 'Отменено',
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
            <Calendar className="w-8 h-8 text-primary" />
            Управление на събития
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Създавайте и управлявайте събития и инициативи
          </p>
        </div>
        <motion.button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          Ново събитие
        </motion.button>
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
            placeholder="Търси събития..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border-0 rounded-xl shadow-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['all', 'upcoming', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
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

      {/* Events Grid */}
      {!loading && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
          >
            {/* Header with date */}
            <div className="p-4 bg-gradient-to-r from-primary to-primary-light text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">{event.date}</span>
                </div>
                {event.featured && (
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Препоръчано
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  {event.time}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {event.location}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
                  {statusLabels[event.status]}
                </span>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleFeatured(event.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      event.featured
                        ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${event.featured ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => openModal(event)}
                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      )}

      {/* Empty State */}
      {!loading && filteredEvents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg"
        >
          <Calendar className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Няма намерени събития</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery ? 'Опитайте с друга ключова дума' : 'Създайте първото събитие'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl"
            >
              <Plus className="w-4 h-4" />
              Ново събитие
            </button>
          )}
        </motion.div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && editingEvent && (
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
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingEvent.id ? 'Редактиране на събитие' : 'Ново събитие'}
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
                  handleSave(editingEvent)
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Заглавие *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="Име на събитието"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Описание на събитието..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Дата *
                    </label>
                    <input
                      type="date"
                      required
                      value={editingEvent.date}
                      onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Час *
                    </label>
                    <input
                      type="time"
                      required
                      value={editingEvent.time}
                      onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Локация
                  </label>
                  <input
                    type="text"
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="напр. Актови салон"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Статус
                  </label>
                  <select
                    value={editingEvent.status}
                    onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as EventItem['status'] })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={editingEvent.featured}
                    onChange={(e) => setEditingEvent({ ...editingEvent, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="featured" className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="font-medium text-gray-900 dark:text-white">Препоръчано събитие</span>
                  </label>
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
