'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Newspaper, 
  Calendar, 
  Image as ImageIcon, 
  Users, 
  Settings,
  MessageSquare,
  Menu,
  X,
  LogOut,
  Palette,
  FileText,
  Home,
  Bell,
  Search,
  Moon,
  Sun,
  ChevronDown,
  FolderTree,
  BookOpen,
  Flag
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AnimatedLogo } from '@/components/animations/AnimatedLogo'
import { useTheme } from 'next-themes'
import { useSiteSettings } from '@/lib/hooks/useSiteSettings'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Newspaper, label: 'Новини', href: '/admin/news' },
  { icon: Calendar, label: 'Събития', href: '/admin/events' },
  { icon: Flag, label: 'Календар 2024/2025', href: '/admin/milestones' },
  { icon: Users, label: 'Екип', href: '/admin/team' },
  { icon: ImageIcon, label: 'Галерия', href: '/admin/gallery' },
  { icon: FileText, label: 'Страници', href: '/admin/pages' },
  { icon: BookOpen, label: 'Речник', href: '/admin/dictionary' },
  { icon: Palette, label: 'Дизайн', href: '/admin/design' },
  { icon: MessageSquare, label: 'Discord', href: '/admin/discord' },
  { icon: FolderTree, label: 'Файл Мениджър', href: '/admin/file-manager' },
  { icon: Settings, label: 'Настройки', href: '/admin/settings' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-800 z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent 
                pathname={pathname} 
                onClose={() => setSidebarOpen(false)} 
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-72">
            <div className="flex flex-col flex-grow bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 shadow-lg">
              <SidebarContent pathname={pathname} />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-400 transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
                
                {/* Search */}
                <div className="hidden sm:flex items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Търсене..."
                      className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-slate-700 border-0 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-600 transition-all"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-400 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Theme Toggle */}
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-400 transition-colors"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                )}

                {/* View Site */}
                <Link
                  href="/"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light rounded-xl font-medium text-sm hover:bg-primary/20 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Виж сайта
                </Link>

                {/* User Menu */}
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-slate-700">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-sm">
                    A
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Администратор</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-slate-900">
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function SidebarContent({ 
  pathname, 
  onClose 
}: { 
  pathname: string
  onClose?: () => void 
}) {
  const { settings } = useSiteSettings()
  
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-slate-700">
        <AnimatedLogo size={40} animated={false} logoUrl={settings.logoUrl} />
        <div>
          <h1 className="font-display font-bold text-lg text-gray-900 dark:text-white">
            Admin Panel
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">{settings.siteNameBg}</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="ml-auto p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all',
                isActive
                  ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/25'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <Icon className={cn(
                'w-5 h-5 transition-transform group-hover:scale-110',
                isActive && 'drop-shadow-lg'
              )} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-2 h-2 bg-white rounded-full"
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700">
        <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-xl">
          <p className="text-xs font-medium text-primary dark:text-primary-light mb-1">
            Development Mode
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Без Supabase - данните са локални
          </p>
        </div>
      </div>
    </div>
  )
}
