// components/admin/news/ImageUploader.tsx
'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react'
import Image from 'next/image'
import { uploadFile } from '@/lib/actions/storage'

interface ImageUploaderProps {
  onImagesChange: (urls: string[]) => void
  images: string[]
  maxImages?: number
}

export function ImageUploader({ onImagesChange, images, maxImages = 5 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length >= maxImages) {
        setError(`Maximum ${maxImages} images allowed`)
        return
      }

      setError('')
      setUploading(true)

      try {
        for (const file of acceptedFiles) {
          const buffer = await file.arrayBuffer()
          const result = await uploadFile(
            Buffer.from(buffer),
            file.name,
            'news-images'
          )

          if (result.success && result.url) {
            onImagesChange([...images, result.url])
          } else {
            setError(result.error || 'Upload failed')
          }
        }
      } catch (err) {
        setError('Upload failed')
      } finally {
        setUploading(false)
      }
    },
    [images, onImagesChange, maxImages]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    disabled: uploading || images.length >= maxImages,
  })

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isDragActive ? 'Drop images here' : 'Drag and drop images here'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          or click to select
        </p>
        {uploading && <Loader className="w-4 h-4 animate-spin mx-auto mt-2" />}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Uploaded Images ({images.length}/{maxImages})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <Image
                    src={url}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => removeImage(index)}
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Supported formats: JPEG, PNG, GIF, WebP (Max {maxImages} images)
      </p>
    </div>
  )
}
