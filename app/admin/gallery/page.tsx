'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Image as ImageIcon, Edit2, Trash2, 
  FolderOpen, X, Save, Upload, Grid, List, Eye
} from 'lucide-react'

interface GalleryAlbum {
  id: string
  title: string
  description: string
  imageCount: number
  coverGradient: string
  createdAt: string
}

const initialAlbums: GalleryAlbum[] = [
  { id: '1', title: 'Спортни събития', description: 'Състезания, турнири и спортни празници', imageCount: 24, coverGradient: 'from-blue-500 to-cyan-500', createdAt: '2024-01-15' },
  { id: '2', title: 'Културни мероприятия', description: 'Концерти, театър и изкуство', imageCount: 18, coverGradient: 'from-purple-500 to-pink-500', createdAt: '2024-01-10' },
  { id: '3', title: 'Образователни инициативи', description: 'Семинари, уъркшопи и обучения', imageCount: 15, coverGradient: 'from-amber-500 to-orange-500', createdAt: '2024-01-05' },
  { id: '4', title: 'Благотворителни акции', description: 'Дарителски кампании и доброволчество', imageCount: 12, coverGradient: 'from-green-500 to-emerald-500', createdAt: '2024-01-01' },
  { id: '5', title: 'Празници', description: 'Коледа, Великден и други тържества', imageCount: 20, coverGradient: 'from-red-500 to-pink-500', createdAt: '2023-12-25' },
  { id: '6', title: 'Абитуриенти', description: 'Балове и завършващи класове', imageCount: 30, coverGradient: 'from-indigo-500 to-blue-500', createdAt: '2023-12-01' },
]

const gradientOptions = [
  { value: 'from-blue-500 to-cyan-500', label: 'Синьо' },
  { value: 'from-purple-500 to-pink-500', label: 'Лилаво' },
  { value: 'from-amber-500 to-orange-500', label: 'Оранжево' },
  { value: 'from-green-500 to-emerald-500', label: 'Зелено' },
  { value: 'from-red-500 to-pink-500', label: 'Червено' },
  { value: 'from-indigo-500 to-blue-500', label: 'Индиго' },
]

export default function GalleryManagementPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>(initialAlbums)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null)

  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: string) => {
    if (confirm('Сигурни ли сте, че искате да изтриете този албум?')) {
      setAlbums(prev => prev.filter(a => a.id !== id))
    }
  }

  const handleSave = (album: GalleryAlbum) => {
    if (album.id) {
      setAlbums(prev => prev.map(a => a.id === album.id ? album : a))
    } else {
      setAlbums(prev => [...prev, { ...album, id: Date.now().toString(), imageCount: 0, createdAt: new Date().toISOString().split('T')[0] }])
    }
    setIsModalOpen(false)
    setEditingAlbum(null)
  }

  const openModal = (album?: GalleryAlbum) => {
    setEditingAlbum(album || { 
      id: '', 
      title: '', 
      description: '', 
      imageCount: 0,
      coverGradient: gradientOptions[0].value,
      createdAt: '' 
    })
    setIsModalOpen(true)
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
            <ImageIcon className="w-8 h-8 text-primary" />
            Галерия
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Управлявайте фото албуми и снимки
          </p>
        </div>
        <motion.button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          Нов албум
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
            placeholder="Търси албуми..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border-0 rounded-xl shadow-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-3 rounded-xl transition-all ${
              viewMode === 'grid'
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-3 rounded-xl transition-all ${
              viewMode === 'list'
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Albums Grid */}
      {viewMode === 'grid' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAlbums.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group cursor-pointer"
              onClick={() => openModal(album)}
            >
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${album.coverGradient}`} />
                
                {/* Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                
                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="opacity-30 group-hover:opacity-20 transition-opacity"
                  >
                    <ImageIcon className="w-24 h-24 text-white" />
                  </motion.div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <FolderOpen className="w-4 h-4 text-white/80" />
                    <span className="text-white/80 text-sm">{album.imageCount} снимки</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{album.title}</h3>
                  <p className="text-white/70 text-sm line-clamp-1">{album.description}</p>
                </div>

                {/* Hover Actions */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openModal(album)
                    }}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(album.id)
                    }}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-red-500/80 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {filteredAlbums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${album.coverGradient} flex items-center justify-center`}>
                  <ImageIcon className="w-8 h-8 text-white/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white">{album.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{album.description}</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                  {album.imageCount} снимки
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(album)}
                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(album.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredAlbums.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg"
        >
          <ImageIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Няма намерени албуми</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery ? 'Опитайте с друга ключова дума' : 'Създайте първия албум'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl"
            >
              <Plus className="w-4 h-4" />
              Нов албум
            </button>
          )}
        </motion.div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && editingAlbum && (
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
                  {editingAlbum.id ? 'Редактиране на албум' : 'Нов албум'}
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
                  handleSave(editingAlbum)
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Име на албума *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAlbum.title}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary"
                    placeholder="напр. Спортни събития"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={editingAlbum.description}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border-0 rounded-xl focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Кратко описание на албума..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Цвят на корицата
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {gradientOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setEditingAlbum({ ...editingAlbum, coverGradient: option.value })}
                        className={`h-16 rounded-xl bg-gradient-to-br ${option.value} transition-all ${
                          editingAlbum.coverGradient === option.value
                            ? 'ring-4 ring-primary ring-offset-2 dark:ring-offset-slate-800'
                            : 'hover:scale-105'
                        }`}
                      >
                        <span className="sr-only">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload area - placeholder for now */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Снимки
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-primary dark:hover:border-primary-light transition-colors cursor-not-allowed opacity-50">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Функционалността за качване на снимки скоро
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Използвай админ панела за новини за качване на снимки
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Отказ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Запази
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
