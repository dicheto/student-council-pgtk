'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Eye, FileText, Loader } from 'lucide-react'
import { format } from 'date-fns'
import { bg } from 'date-fns/locale'

interface Protocol {
  id: string
  name: string
  mimeType: string
  modifiedTime: string
  webViewLink: string
  pdfUrl: string
}

export default function ProtocolsPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchProtocols = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/protocols')

        if (!response.ok) {
          throw new Error('Не можах да заредя протоколите')
        }

        const data = await response.json()
        setProtocols(data.data || [])
      } catch (error) {
        console.error('Error fetching protocols:', error)
        setError(
          error instanceof Error
            ? error.message
            : 'Възникна грешка при зареждането на протоколите'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProtocols()
  }, [mounted])

  const filteredProtocols = protocols.filter(protocol =>
    protocol.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewPdf = (protocol: Protocol) => {
    setSelectedProtocol(protocol)
    setShowPreview(true)
  }

  const handleDownloadPdf = (protocol: Protocol) => {
    // Open PDF in new tab, which will trigger download
    window.open(protocol.pdfUrl, '_blank')
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 max-w-6xl"
      >
        {/* Header Section */}
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-3"
          >
            📋 Архив с Протоколи
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            Протоколи от заседания на Ученическия съвет
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <input
            type="text"
            placeholder="Търси протокол по дата или дело..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:border-blue-500 transition-colors bg-white shadow-sm"
          />
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Loader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-600">Зареждане на протоколи...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-8"
          >
            <p className="text-red-700">⚠️ {error}</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredProtocols.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border-2 border-dashed border-slate-300"
          >
            <FileText className="w-12 h-12 text-slate-400 mb-4" />
            <p className="text-slate-600 text-lg">
              {searchTerm
                ? 'Нямаше протоколи които съвпадат с търсенето'
                : 'Архивът не съдържа протоколи'}
            </p>
          </motion.div>
        )}

        {/* Protocols List */}
        {!loading && filteredProtocols.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid gap-4"
          >
            {filteredProtocols.map((protocol, index) => (
              <motion.div
                key={protocol.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border-l-4 border-blue-500"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Protocol Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 truncate">
                      {protocol.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2">
                      {format(new Date(protocol.modifiedTime), 'dd MMMM yyyy', {
                        locale: bg,
                      })}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewPdf(protocol)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Преглед
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownloadPdf(protocol)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Изтегли
                    </motion.button>

                    {/* View on Google Drive */}
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={protocol.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      Google
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Result Count */}
        {!loading && protocols.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-slate-600 mt-8 text-sm"
          >
            Найдени {filteredProtocols.length} от {protocols.length} протоколи
          </motion.p>
        )}
      </motion.div>

      {/* PDF Preview Modal */}
      {showPreview && selectedProtocol && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 truncate">
                {selectedProtocol.name}
              </h2>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownloadPdf(selectedProtocol)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
                >
                  Изтегли
                </motion.button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-slate-300 text-slate-800 rounded-lg hover:bg-slate-400 transition-colors text-sm font-medium"
                >
                  Затвори
                </button>
              </div>
            </div>

            {/* Modal Body - PDF Viewer */}
            <div className="p-4 bg-slate-50">
              <iframe
                src={`${selectedProtocol.pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                className="w-full"
                style={{ height: 'calc(90vh - 140px)' }}
                title={`Preview of ${selectedProtocol.name}`}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
