'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
  AlertCircle,
  CheckCircle,
  EyeOff,
  Eye,
} from 'lucide-react'

interface TeamMember {
  id: string
  name_en: string
  name_bg: string
  role_en: string
  role_bg: string
  description_en: string
  description_bg: string
  badge_en: string
  badge_bg: string
  email: string
  instagram: string
  image_url: string
  position_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showNotification, setShowNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name_en: '',
    name_bg: '',
    role_en: '',
    role_bg: '',
    description_en: '',
    description_bg: '',
    badge_en: '',
    badge_bg: '',
    email: '',
    instagram: '',
    image_url: '',
    position_order: 0,
    is_visible: true,
  })

  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/team-members')
        if (response.ok) {
          const data = await response.json()
          setMembers(data)
        }
      } catch (error) {
        console.error('Error fetching members:', error)
        showError('Грешка при зареждане на данните')
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  const filteredMembers = members.filter(
    (member) =>
      member.name_bg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role_bg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role_en.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = async () => {
    if (!formData.name_en || !formData.name_bg || !formData.role_en || !formData.role_bg) {
      showError('Моля, попълнете всички задължителни полета')
      return
    }

    try {
      const response = await fetch('/api/team-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newMember = await response.json()
        setMembers([...members, newMember])
        resetForm()
        setIsCreating(false)
        showSuccess('Член на екипа създаден успешно')
      } else {
        showError('Грешка при създаване на член')
      }
    } catch (error) {
      console.error('Error creating member:', error)
      showError('Грешка при създаване на член')
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`/api/team-members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedMember = await response.json()
        setMembers(members.map((m) => (m.id === id ? updatedMember : m)))
        setEditingId(null)
        resetForm()
        showSuccess('Член актуализиран успешно')
      } else {
        showError('Грешка при актуализиране на член')
      }
    } catch (error) {
      console.error('Error updating member:', error)
      showError('Грешка при актуализиране на член')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Сигурни ли сте че искате да изтриете този член?')) {
      return
    }

    try {
      const response = await fetch(`/api/team-members/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMembers(members.filter((m) => m.id !== id))
        showSuccess('Член изтрит успешно')
      } else {
        showError('Грешка при изтриване на член')
      }
    } catch (error) {
      console.error('Error deleting member:', error)
      showError('Грешка при изтриване на член')
    }
  }

  const handleToggleVisibility = async (member: TeamMember) => {
    try {
      const response = await fetch(`/api/team-members/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...member,
          is_visible: !member.is_visible,
        }),
      })

      if (response.ok) {
        const updatedMember = await response.json()
        setMembers(members.map((m) => (m.id === member.id ? updatedMember : m)))
        showSuccess(
          !member.is_visible ? 'Член видлив' : 'Член скрит'
        )
      } else {
        showError('Грешка при промяна на видимостта')
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
      showError('Грешка при промяна на видимостта')
    }
  }

  const handleEdit = (member: TeamMember) => {
    setFormData({
      name_en: member.name_en,
      name_bg: member.name_bg,
      role_en: member.role_en,
      role_bg: member.role_bg,
      description_en: member.description_en,
      description_bg: member.description_bg,
      badge_en: member.badge_en,
      badge_bg: member.badge_bg,
      email: member.email,
      instagram: member.instagram,
      image_url: member.image_url,
      position_order: member.position_order,
      is_visible: member.is_visible,
    })
    setEditingId(member.id)
    setIsCreating(false)
  }

  const resetForm = () => {
    setFormData({
      name_en: '',
      name_bg: '',
      role_en: '',
      role_bg: '',
      description_en: '',
      description_bg: '',
      badge_en: '',
      badge_bg: '',
      email: '',
      instagram: '',
      image_url: '',
      position_order: 0,
      is_visible: true,
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
            <Users className="w-8 h-8 text-primary" />
            Управление на екипа
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Добавяй, редактирай и управлявай членовете на ученическия съвет
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
          Добави член
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel */}
        {(isCreating || editingId) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 max-h-[800px] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white dark:bg-slate-800 pb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingId ? 'Редактиране на член' : 'Нов член'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Име (ENG) *
                </label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) =>
                    setFormData({ ...formData, name_en: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Name BG */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Име (BG) *
                </label>
                <input
                  type="text"
                  value={formData.name_bg}
                  onChange={(e) =>
                    setFormData({ ...formData, name_bg: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Role EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Роля (ENG) *
                </label>
                <input
                  type="text"
                  value={formData.role_en}
                  onChange={(e) =>
                    setFormData({ ...formData, role_en: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Role BG */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Роля (BG) *
                </label>
                <input
                  type="text"
                  value={formData.role_bg}
                  onChange={(e) =>
                    setFormData({ ...formData, role_bg: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Description EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Описание (ENG)
                </label>
                <textarea
                  value={formData.description_en}
                  onChange={(e) =>
                    setFormData({ ...formData, description_en: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              {/* Description BG */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Описание (BG)
                </label>
                <textarea
                  value={formData.description_bg}
                  onChange={(e) =>
                    setFormData({ ...formData, description_bg: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              {/* Badge EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Значка (ENG)
                </label>
                <input
                  type="text"
                  value={formData.badge_en}
                  onChange={(e) =>
                    setFormData({ ...formData, badge_en: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="напр: Leader, Organizer"
                />
              </div>

              {/* Badge BG */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Значка (BG)
                </label>
                <input
                  type="text"
                  value={formData.badge_bg}
                  onChange={(e) =>
                    setFormData({ ...formData, badge_bg: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="напр: Лидер, Организатор"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Имейл
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instagram
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData({ ...formData, instagram: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="@username"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL на снимка
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Position Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ред на показване
                </label>
                <input
                  type="number"
                  value={formData.position_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      position_order: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Visibility */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_visible}
                  onChange={(e) =>
                    setFormData({ ...formData, is_visible: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Видлив в публичния сайт
                </span>
              </label>

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <motion.button
                  onClick={() =>
                    editingId ? handleUpdate(editingId) : handleCreate()
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

        {/* Members List */}
        <div className={editingId || isCreating ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Търсене в членовете..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="text-center py-12 col-span-full">
                <p className="text-gray-500 dark:text-gray-400">Зареждане...</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-12 col-span-full">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'Няма намерени членове' : 'Няма членове'}
                </p>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white dark:bg-slate-800 rounded-xl p-4 border ${
                    member.is_visible
                      ? 'border-gray-200 dark:border-slate-700'
                      : 'border-amber-200 dark:border-amber-700/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {member.name_bg} / {member.name_en}
                      </h3>
                      <p className="text-sm text-primary dark:text-primary-light font-medium">
                        {member.role_bg} / {member.role_en}
                      </p>
                    </div>
                    {!member.is_visible && (
                      <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded">
                        Скрит
                      </span>
                    )}
                  </div>

                  {member.description_bg && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {member.description_bg}
                    </p>
                  )}

                  {member.email && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                      📧 {member.email}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleEdit(member)}
                      disabled={isCreating || !!editingId}
                      className="flex-1 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit2 className="w-4 h-4 inline mr-1" />
                      Редактирай
                    </motion.button>
                    <motion.button
                      onClick={() => handleToggleVisibility(member)}
                      disabled={isCreating || !!editingId}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        member.is_visible
                          ? 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-600'
                          : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {member.is_visible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(member.id)}
                      disabled={isCreating || !!editingId}
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
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
