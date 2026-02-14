'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface ImageUploadProps {
  currentImageUrl?: string
  onImageUploaded: (url: string) => void
}

export function ImageUpload({ currentImageUrl, onImageUploaded }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  
  const uploadImage = useCallback(async (file: File) => {
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      onImageUploaded(data.url)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Грешка при качване'
      setError(errorMessage)
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }, [onImageUploaded])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    
    // Upload first file only (for single image upload)
    await uploadImage(acceptedFiles[0])
  }, [uploadImage])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false,
    noClick: false,
    noKeyboard: false,
  })

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        onClick={(e) => {
          e.stopPropagation()
          open()
        }}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700'
        } ${uploading ? 'opacity-50 cursor-wait' : ''}`}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={{ y: isDragActive ? -5 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {uploading ? (
            <Loader2 className="w-12 h-12 mx-auto text-primary dark:text-primary-light mb-4 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          )}
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            {uploading
              ? 'Качване на изображение...'
              : isDragActive
              ? 'Пуснете изображението тук'
              : 'Плъзнете изображение тук или кликнете за избор'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            PNG, JPG, GIF, WEBP до 10MB
          </p>
        </motion.div>
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Current Image Preview */}
      {currentImageUrl && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Текущо изображение
          </h3>
          <div className="relative inline-block group">
            <img
              src={currentImageUrl}
              alt="Current"
              className="max-w-xs max-h-48 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onImageUploaded('')
              }}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {!currentImageUrl && !uploading && (
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Няма качено изображение</p>
        </div>
      )}
    </div>
  )
}
