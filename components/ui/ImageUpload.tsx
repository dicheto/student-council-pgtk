'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (urls: string[]) => void
}

export function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState<string[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const tempId = `temp-${Date.now()}-${Math.random()}`
      setUploading(prev => [...prev, tempId])

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          let message = 'Upload failed'
          try {
            const err = await response.json()
            if (err?.error) {
              message = err.error
            }
          } catch {
            // ignore JSON parse error
          }
          throw new Error(message)
        }

        const data = await response.json()
        onImagesChange([...images, data.url])
      } catch (error) {
        console.error('Upload error:', error)
        alert(`Грешка при качване на ${file.name}`)
      } finally {
        setUploading(prev => prev.filter(id => id !== tempId))
      }
    }
  }, [images, onImagesChange])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true,
    noClick: false,
    noKeyboard: false,
  })

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        onClick={(e) => {
          e.stopPropagation()
          if (!uploading.length) open()
        }}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700'
        } ${uploading.length > 0 ? 'opacity-50 cursor-wait' : ''}`}
      >
        <input {...getInputProps()} style={{ display: 'none' }} />
        <motion.div
          animate={{ y: isDragActive ? -5 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Upload className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isDragActive ? 'Пуснете изображенията тук' : 'Плъзнете изображения тук или кликнете за избор'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            PNG, JPG, GIF, WEBP до 10MB
          </p>
        </motion.div>
      </div>

      {/* Uploading indicator */}
      {uploading.length > 0 && (
        <div className="flex items-center space-x-2 text-primary dark:text-primary-light">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Качване на {uploading.length} изображения...</span>
        </div>
      )}

      {/* Image Preview Gallery */}
      {images.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Изображения ({images.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <AnimatePresence>
              {images.map((url, index) => (
                <motion.div
                  key={url}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removeImage(index)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {images.length === 0 && uploading.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Няма качени изображения</p>
        </div>
      )}
    </div>
  )
}
