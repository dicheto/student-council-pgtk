'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Eye, FileText, Loader, Search, X } from 'lucide-react'
import { format } from 'date-fns'
import { bg } from 'date-fns/locale'
import { useTheme } from 'next-themes'

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
  const { theme, resolvedTheme } = useTheme()

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
        
        // Check for API key configuration error
        if (!response.ok) {
          const errorMsg = data.message || data.error || 'Възникна грешка';
          if (errorMsg.includes('API key') || errorMsg.includes('GOOGLE_DRIVE_PROTOCOLS_FOLDER_ID')) {
            setError(
              '⚠️ Системата не е конфигурирана правилно. ' +
              'Добави NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY в Vercel Environment Variables. ' +
              'Виж PROTOCOLS_TROUBLESHOOT.md за помощ.'
            );
          } else {
            setError(data.message || errorMsg);
          }
          return;
        }
        
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
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a')
    link.href = protocol.pdfUrl
    link.download = `${protocol.name}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!mounted) {
    return null
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <div className={`min-h-screen pt-28 pb-16 transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 max-w-6xl"
      >
        {/* Header Section */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4"
          >
            <span className="text-5xl">📋</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-4xl md:text-5xl font-bold mb-3 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Архив с Протоколи
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-lg ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
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
          <div className={`relative rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
            isDark 
              ? 'bg-slate-800 border border-slate-700' 
              : 'bg-white border border-slate-200'
          }`}>
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`} />
            <input
              type="text"
              placeholder="Търси протокол по дата или номер..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 focus:outline-none transition-colors ${
                isDark
                  ? 'bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-700'
                  : 'bg-white text-slate-900 placeholder-slate-500 focus:bg-slate-50'
              }`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Loader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              Зареждане на протоколи...
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-xl p-4 mb-8 border-l-4 ${
              isDark
                ? 'bg-red-900/20 border-red-500 text-red-300'
                : 'bg-red-50 border-red-500 text-red-700'
            }`}
          >
            <p className="font-medium">⚠️ {error}</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredProtocols.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex flex-col items-center justify-center py-20 rounded-lg border-2 border-dashed ${
              isDark
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-white border-slate-300'
            }`}
          >
            <FileText className={`w-12 h-12 mb-4 ${
              isDark ? 'text-slate-600' : 'text-slate-400'
            }`} />
            <p className={`text-lg ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {searchTerm
                ? 'Няма намерени протоколи които съвпадат с търсенето'
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max"
          >
            {filteredProtocols.map((protocol, index) => (
              <motion.div
                key={protocol.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isDark
                    ? 'bg-slate-800 border border-slate-700 hover:border-blue-500'
                    : 'bg-white border border-slate-200 hover:border-blue-400'
                }`}
              >
                <div className={`p-6 border-b ${
                  isDark ? 'border-slate-700' : 'border-slate-200'
                }`}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className={`text-lg font-semibold line-clamp-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {protocol.name}
                    </h3>
                    <FileText className={`w-5 h-5 flex-shrink-0 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </div>
                  <p className={`text-sm ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {format(new Date(protocol.modifiedTime), 'dd MMMM yyyy', {
                      locale: bg,
                    })}
                  </p>
                  <div className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    isDark
                      ? 'bg-blue-900/30 text-blue-300'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    📋 Протокол
                  </div>
                </div>

                <div className={`px-6 py-4 flex gap-2 ${
                  isDark ? 'bg-slate-700/30' : 'bg-slate-50'
                }`}>
                  <button
                    onClick={() => handleViewPdf(protocol)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                      isDark
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Гледай</span>
                    <span className="sm:hidden">👁</span>
                  </button>
                  <button
                    onClick={() => handleDownloadPdf(protocol)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                      isDark
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Сваляй</span>
                    <span className="sm:hidden">⬇</span>
                  </button>
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
            className={`text-center mt-8 text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Показани {filteredProtocols.length} от {protocols.length} протоколи
          </motion.p>
        )}
      </motion.div>

      {/* PDF Preview Modal */}
      {showPreview && selectedProtocol && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowPreview(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`sticky top-0 border-b p-4 flex items-center justify-between ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <h2 className={`text-xl font-semibold truncate ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {selectedProtocol.name}
              </h2>
              <button
                onClick={() => setShowPreview(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'hover:bg-slate-700 text-slate-400'
                    : 'hover:bg-slate-200 text-slate-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - PDF Viewer */}
            <div className={`flex-1 overflow-hidden ${
              isDark ? 'bg-slate-900' : 'bg-slate-50'
            }`}>
              <iframe
                src={`${selectedProtocol.pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                className="w-full"
                style={{ height: 'calc(90vh - 140px)' }}
                title={`Preview of ${selectedProtocol.name}`}
              />
            </div>

            {/* Modal Footer */}
            <div className={`border-t p-4 flex gap-2 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <button
                onClick={() => handleDownloadPdf(selectedProtocol)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Сваляй
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  isDark
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
              >
                Затвори
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
