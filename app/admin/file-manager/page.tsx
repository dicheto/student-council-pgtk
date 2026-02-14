'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  File,
  Folder,
  FolderOpen,
  Save,
  Trash2,
  Plus,
  Edit,
  ChevronRight,
  ChevronDown,
  Code,
  FileText,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react'

interface FileItem {
  name: string
  path: string
  type: 'file' | 'directory'
  size: number
  modified: string
  extension: string | null
}

interface FileContent {
  type: 'file' | 'directory'
  path: string
  content?: string
  items?: FileItem[]
  size?: number
  modified?: string
}

export default function FileManagerPage() {
  const [currentPath, setCurrentPath] = useState('')
  const [fileContent, setFileContent] = useState<FileContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [newItemName, setNewItemName] = useState('')
  const [newItemType, setNewItemType] = useState<'file' | 'directory'>('file')
  const [showNewItemDialog, setShowNewItemDialog] = useState(false)

  useEffect(() => {
    loadPath('')
  }, [])

  const loadPath = async (path: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/file-manager?path=${encodeURIComponent(path)}`, {
        credentials: 'include',
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to load path')
      }
      const data = await response.json()
      setFileContent(data)
      setCurrentPath(path)
    } catch (err: any) {
      setError(err.message || 'Failed to load path')
    } finally {
      setLoading(false)
    }
  }

  const saveFile = async (path: string, content: string) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch('/api/file-manager', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'save_file',
          path,
          content,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save file')
      }

      setSuccess('File saved successfully')
      setEditingFile(null)
      setEditContent('')
      loadPath(currentPath)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to save file')
    } finally {
      setLoading(false)
    }
  }

  const deleteItem = async (path: string) => {
    if (!confirm(`Are you sure you want to delete "${path}"?`)) return

    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch(`/api/file-manager?path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete item')
      }

      setSuccess('Item deleted successfully')
      loadPath(currentPath)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to delete item')
    } finally {
      setLoading(false)
    }
  }

  const createItem = async () => {
    if (!newItemName.trim()) {
      setError('Name is required')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch('/api/file-manager', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: newItemType === 'file' ? 'create_file' : 'create_directory',
          path: currentPath,
          name: newItemName,
          content: newItemType === 'file' ? '' : undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create item')
      }

      setSuccess(`${newItemType === 'file' ? 'File' : 'Directory'} created successfully`)
      setNewItemName('')
      setShowNewItemDialog(false)
      loadPath(currentPath)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to create item')
    } finally {
      setLoading(false)
    }
  }

  const openFile = async (path: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/file-manager?path=${encodeURIComponent(path)}`, {
        credentials: 'include',
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to load file')
      }
      const data = await response.json()
      if (data.type === 'file') {
        setEditingFile(path)
        setEditContent(data.content || '')
      } else {
        loadPath(path)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to open file')
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'directory') {
      return expandedDirs.has(item.path) ? FolderOpen : Folder
    }
    
    const ext = item.extension?.toLowerCase()
    if (['.ts', '.tsx', '.js', '.jsx'].includes(ext || '')) return Code
    if (['.md', '.txt'].includes(ext || '')) return FileText
    if (['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext || '')) return ImageIcon
    return File
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const navigateUp = () => {
    const parts = currentPath.split('/').filter(Boolean)
    parts.pop()
    loadPath(parts.join('/'))
  }

  const pathParts = currentPath.split('/').filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Файл Мениджър
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Управление на файлове в проекта
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowNewItemDialog(true)}
            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Нов файл/папка
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 dark:text-red-400">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-emerald-700 dark:text-emerald-400">{success}</span>
          <button
            onClick={() => setSuccess(null)}
            className="ml-auto text-emerald-500 hover:text-emerald-700"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => loadPath('')}
          className="text-gray-600 dark:text-gray-400 hover:text-primary"
        >
          Root
        </button>
        {pathParts.map((part, index) => {
          const pathToPart = pathParts.slice(0, index + 1).join('/')
          return (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <button
                onClick={() => loadPath(pathToPart)}
                className="text-gray-600 dark:text-gray-400 hover:text-primary"
              >
                {part}
              </button>
            </div>
          )
        })}
      </div>

      {loading && !fileContent ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : editingFile ? (
        /* File Editor */
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Редактиране: {editingFile.split('/').pop()}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingFile(null)
                  setEditContent('')
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
              >
                Отказ
              </button>
              <button
                onClick={() => saveFile(editingFile, editContent)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Запази
              </button>
            </div>
          </div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-[600px] p-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary"
            spellCheck={false}
          />
        </div>
      ) : fileContent?.type === 'directory' ? (
        /* Directory Listing */
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Име
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Размер
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Модифициран
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {fileContent.items?.map((item) => {
                  const Icon = getFileIcon(item)
                  return (
                    <tr
                      key={item.path}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openFile(item.path)}
                          className="flex items-center gap-3 text-left hover:text-primary transition-colors"
                        >
                          <Icon className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {item.type === 'file' ? formatSize(item.size) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(item.modified)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {item.type === 'file' && (
                            <button
                              onClick={() => openFile(item.path)}
                              className="p-2 text-gray-400 hover:text-primary transition-colors"
                              title="Редактирай"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteItem(item.path)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Изтрий"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* New Item Dialog */}
      {showNewItemDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-xl"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Създай нов {newItemType === 'file' ? 'файл' : 'директорий'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Тип
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewItemType('file')}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      newItemType === 'file'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Файл
                  </button>
                  <button
                    onClick={() => setNewItemType('directory')}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      newItemType === 'directory'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Директорий
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Име
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder={newItemType === 'file' ? 'example.ts' : 'new-folder'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') createItem()
                    if (e.key === 'Escape') setShowNewItemDialog(false)
                  }}
                  autoFocus
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowNewItemDialog(false)
                  setNewItemName('')
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
              >
                Отказ
              </button>
              <button
                onClick={createItem}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Създай
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
