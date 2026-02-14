'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, Save, X, GripVertical, Calendar,
  GraduationCap, PartyPopper, Heart, Sparkles, Trophy, Star, Flag, Users, Zap
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Milestone {
  id: string
  title: { bg: string; en: string }
  description: { bg: string; en: string }
  month: string
  year: string
  icon: string
  color: string
  is_highlighted: boolean
  display_order: number
}

const iconOptions = [
  { name: 'Calendar', component: Calendar },
  { name: 'GraduationCap', component: GraduationCap },
  { name: 'PartyPopper', component: PartyPopper },
  { name: 'Heart', component: Heart },
  { name: 'Sparkles', component: Sparkles },
  { name: 'Trophy', component: Trophy },
  { name: 'Star', component: Star },
  { name: 'Flag', component: Flag },
  { name: 'Users', component: Users },
  { name: 'Zap', component: Zap },
]

const colorOptions = [
  { name: 'Син', value: 'from-blue-500 to-cyan-500' },
  { name: 'Лилав', value: 'from-purple-500 to-pink-500' },
  { name: 'Червен', value: 'from-red-500 to-orange-500' },
  { name: 'Зелен', value: 'from-green-500 to-emerald-500' },
  { name: 'Розов', value: 'from-pink-500 to-rose-500' },
  { name: 'Жълт', value: 'from-amber-500 to-yellow-500' },
  { name: 'Индиго', value: 'from-indigo-500 to-purple-500' },
  { name: 'Тюркоаз', value: 'from-teal-500 to-cyan-500' },
]

const monthOptions = [
  'Септември', 'Октомври', 'Ноември', 'Декември',
  'Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август'
]

export default function MilestonesAdminPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<Partial<Milestone>>({
    title: { bg: '', en: '' },
    description: { bg: '', en: '' },
    month: 'Септември',
    year: new Date().getFullYear().toString(),
    icon: 'Calendar',
    color: 'from-blue-500 to-cyan-500',
    is_highlighted: false,
  })

  const supabase = createClient()

  useEffect(() => {
    fetchMilestones()
  }, [])

  const fetchMilestones = async () => {
    try {
      const response = await fetch('/api/milestones')
      const data = await response.json()
      setMilestones(data)
    } catch (error) {
      console.error('Error fetching milestones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          display_order: milestones.length + 1,
        }),
      })

      if (response.ok) {
        await fetchMilestones()
        setIsCreating(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error creating milestone:', error)
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`/api/milestones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchMilestones()
        setEditingId(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error updating milestone:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете този milestone?')) {
      return
    }

    try {
      const response = await fetch(`/api/milestones/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchMilestones()
      }
    } catch (error) {
      console.error('Error deleting milestone:', error)
    }
  }

  const startEdit = (milestone: Milestone) => {
    setEditingId(milestone.id)
    setFormData(milestone)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsCreating(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: { bg: '', en: '' },
      description: { bg: '', en: '' },
      month: 'Септември',
      year: new Date().getFullYear().toString(),
      icon: 'Calendar',
      color: 'from-blue-500 to-cyan-500',
      is_highlighted: false,
    })
  }

  const getIconComponent = (iconName: string) => {
    const icon = iconOptions.find(i => i.name === iconName)
    return icon ? icon.component : Calendar
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Управление на Timeline Milestones
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Добавяй, редактирай и премахвай събития от календара
          </p>
        </div>
        <motion.button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          Добави Milestone
        </motion.button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-primary p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                Нов Milestone
              </h3>
              <MilestoneForm
                formData={formData}
                setFormData={setFormData}
                onSave={handleCreate}
                onCancel={cancelEdit}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.map((milestone) => {
          const Icon = getIconComponent(milestone.icon)
          const isEditing = editingId === milestone.id

          return (
            <motion.div
              key={milestone.id}
              layout
              className={`bg-white dark:bg-gray-800 rounded-xl border ${
                isEditing ? 'border-2 border-primary' : 'border-gray-200 dark:border-gray-700'
              } p-6`}
            >
              {isEditing ? (
                <MilestoneForm
                  formData={formData}
                  setFormData={setFormData}
                  onSave={() => handleUpdate(milestone.id)}
                  onCancel={cancelEdit}
                />
              ) : (
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${milestone.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-500">
                            {milestone.month} {milestone.year}
                          </span>
                          {milestone.is_highlighted && (
                            <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent-dark text-xs font-bold">
                              Важно
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {milestone.title.bg}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {milestone.description.bg}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => startEdit(milestone)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(milestone.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function MilestoneForm({
  formData,
  setFormData,
  onSave,
  onCancel,
}: {
  formData: Partial<Milestone>
  setFormData: (data: Partial<Milestone>) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title BG */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Заглавие (BG)
          </label>
          <input
            type="text"
            value={formData.title?.bg || ''}
            onChange={(e) => setFormData({
              ...formData,
              title: { ...formData.title!, bg: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Начало на учебната година"
          />
        </div>

        {/* Title EN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Заглавие (EN)
          </label>
          <input
            type="text"
            value={formData.title?.en || ''}
            onChange={(e) => setFormData({
              ...formData,
              title: { ...formData.title!, en: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Start of School Year"
          />
        </div>

        {/* Description BG */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Описание (BG)
          </label>
          <textarea
            value={formData.description?.bg || ''}
            onChange={(e) => setFormData({
              ...formData,
              description: { ...formData.description!, bg: e.target.value }
            })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Официално откриване на новата учебна година..."
          />
        </div>

        {/* Description EN */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Описание (EN)
          </label>
          <textarea
            value={formData.description?.en || ''}
            onChange={(e) => setFormData({
              ...formData,
              description: { ...formData.description!, en: e.target.value }
            })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Official opening of the new school year..."
          />
        </div>

        {/* Month */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Месец
          </label>
          <select
            value={formData.month || ''}
            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {monthOptions.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Година
          </label>
          <input
            type="text"
            value={formData.year || ''}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="2024"
          />
        </div>

        {/* Icon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Икона
          </label>
          <select
            value={formData.icon || ''}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {iconOptions.map(icon => (
              <option key={icon.name} value={icon.name}>{icon.name}</option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Цвят
          </label>
          <select
            value={formData.color || ''}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {colorOptions.map(color => (
              <option key={color.value} value={color.value}>{color.name}</option>
            ))}
          </select>
        </div>

        {/* Highlighted */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_highlighted || false}
              onChange={(e) => setFormData({ ...formData, is_highlighted: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Маркирай като важно събитие (показва "Не пропускайте!")
            </span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <X className="w-4 h-4" />
          Откажи
        </motion.button>
        <motion.button
          onClick={onSave}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save className="w-4 h-4" />
          Запази
        </motion.button>
      </div>
    </div>
  )
}
