'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit, Trash2, Eye, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { NewsFormModal } from './NewsFormModal'

interface News {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url: string | null
  author_id: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
  user_profiles: {
    full_name: string
  }
}

export function NewsList() {
  const [mounted, setMounted] = useState(false)
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          user_profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNews(data || [])
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете тази новина?')) return

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Обнови списъка
      setNews(news.filter(item => item.id !== id))
      alert('Новината е изтрита успешно!')
    } catch (error) {
      console.error('Error deleting news:', error)
      alert('Грешка при изтриване на новината!')
    }
  }

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingNews(null)
    fetchNews() // Обнови списъка след редакция
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {news.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">Няма новини все още. Създайте първата!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Заглавие
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {news.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.user_profiles?.full_name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {item.status === 'published' ? 'Публикувана' : 'Чернова'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(item.created_at), 'dd MMM yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Редактирай"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Изтрий"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      {editingNews && (
        <NewsFormModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          existingNews={editingNews}
        />
      )}
    </>
  )
}
