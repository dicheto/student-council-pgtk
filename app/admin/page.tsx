'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Newspaper, 
  Calendar, 
  Users, 
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const quickActions = [
  { label: 'Нова новина', href: '/admin/news/create', icon: Newspaper, color: 'bg-blue-500' },
  { label: 'Ново събитие', href: '/admin/events/create', icon: Calendar, color: 'bg-emerald-500' },
  { label: 'Управление на календара', href: '/admin/milestones', icon: Clock, color: 'bg-pink-500' },
  { label: 'Добави член', href: '/admin/team/create', icon: Users, color: 'bg-purple-500' },
  { label: 'Настройки', href: '/admin/settings', icon: Activity, color: 'bg-amber-500' },
]

function StatsCard({ title, value, change, trend, icon: Icon, color, href }: any) {
  return (
    <Link href={href}>
      <motion.div
        className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Background gradient */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform`} />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
            }`}>
              {trend === 'up' && <TrendingUp className="w-4 h-4" />}
              {trend === 'down' && <TrendingDown className="w-4 h-4" />}
              {change}
            </div>
          </div>
          
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>
      </motion.div>
    </Link>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    {
      title: 'Общо Новини',
      value: '0',
      change: '0',
      trend: 'neutral' as const,
      icon: Newspaper,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/news',
    },
    {
      title: 'Активни Събития',
      value: '0',
      change: '0',
      trend: 'neutral' as const,
      icon: Calendar,
      color: 'from-emerald-500 to-emerald-600',
      href: '/admin/events',
    },
    {
      title: 'Членове на екипа',
      value: '0',
      change: '0',
      trend: 'neutral' as const,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/team',
    },
    {
      title: 'Прегледи/месец',
      value: '0',
      change: '0',
      trend: 'neutral' as const,
      icon: Eye,
      color: 'from-amber-500 to-amber-600',
      href: '/admin/settings',
    },
  ])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch news count
        const { count: newsCount } = await supabase
          .from('news')
          .select('*', { count: 'exact', head: true })

        // Fetch published news count
        const { count: publishedNewsCount } = await supabase
          .from('news')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published')

        // Fetch upcoming events count
        const { count: upcomingEventsCount } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published')
          .gte('start_date', new Date().toISOString())

        // Fetch team members count
        const { count: teamCount } = await supabase
          .from('team_members')
          .select('*', { count: 'exact', head: true })
          .eq('visible', true)

        // Calculate total views (sum of views from all published news)
        const { data: newsData } = await supabase
          .from('news')
          .select('views')
          .eq('status', 'published')

        const totalViews = newsData?.reduce((sum, item) => sum + (item.views || 0), 0) || 0
        const viewsThisMonth = Math.floor(totalViews * 0.3) // Approximate monthly views

        // Fetch recent activity
        const { data: recentNews } = await supabase
          .from('news')
          .select('id, title, created_at, updated_at, status')
          .order('updated_at', { ascending: false })
          .limit(5)

        const { data: recentEvents } = await supabase
          .from('events')
          .select('id, title, created_at, updated_at, status')
          .order('updated_at', { ascending: false })
          .limit(5)

        const activities: any[] = []
        
        if (recentNews) {
          recentNews.forEach((item: any) => {
            const title = typeof item.title === 'object' ? item.title?.bg || item.title?.en || 'Новина' : item.title || 'Новина'
            const time = getTimeAgo(item.updated_at || item.created_at)
            activities.push({
              type: 'news',
              title: `Новина "${title}" ${item.status === 'published' ? 'публикувана' : 'обновена'}`,
              time,
              status: item.status === 'published' ? 'success' : 'warning',
            })
          })
        }

        if (recentEvents) {
          recentEvents.forEach((item: any) => {
            const title = typeof item.title === 'object' ? item.title?.bg || item.title?.en || 'Събитие' : item.title || 'Събитие'
            const time = getTimeAgo(item.updated_at || item.created_at)
            activities.push({
              type: 'event',
              title: `Събитие "${title}" ${item.status === 'published' ? 'публикувано' : 'обновено'}`,
              time,
              status: item.status === 'published' ? 'success' : 'warning',
            })
          })
        }

        // Sort activities by time and limit to 4
        activities.sort((a, b) => {
          const timeA = parseTimeAgo(a.time)
          const timeB = parseTimeAgo(b.time)
          return timeA - timeB
        })

        setRecentActivity(activities.slice(0, 4))

        // Update stats
        setStats([
          {
            title: 'Общо Новини',
            value: String(newsCount || 0),
            change: String(publishedNewsCount || 0),
            trend: 'up' as const,
            icon: Newspaper,
            color: 'from-blue-500 to-blue-600',
            href: '/admin/news',
          },
          {
            title: 'Активни Събития',
            value: String(upcomingEventsCount || 0),
            change: '+0',
            trend: 'neutral' as const,
            icon: Calendar,
            color: 'from-emerald-500 to-emerald-600',
            href: '/admin/events',
          },
          {
            title: 'Членове на екипа',
            value: String(teamCount || 0),
            change: '0',
            trend: 'neutral' as const,
            icon: Users,
            color: 'from-purple-500 to-purple-600',
            href: '/admin/team',
          },
          {
            title: 'Прегледи/месец',
            value: viewsThisMonth >= 1000 ? `${(viewsThisMonth / 1000).toFixed(1)}K` : String(viewsThisMonth),
            change: '+0%',
            trend: 'up' as const,
            icon: Eye,
            color: 'from-amber-500 to-amber-600',
            href: '/admin/settings',
          },
        ])
      } catch (error: any) {
        if (error?.name !== 'AbortError' && !error?.message?.includes('aborted')) {
          console.error('Error fetching dashboard data:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} мин`
    if (diffHours < 24) return `${diffHours} час`
    return `${diffDays} ден`
  }

  const parseTimeAgo = (timeStr: string): number => {
    if (timeStr.includes('мин')) return parseInt(timeStr) || 0
    if (timeStr.includes('час')) return (parseInt(timeStr) || 0) * 60
    if (timeStr.includes('ден')) return (parseInt(timeStr) || 0) * 1440
    return 0
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Добре дошли! 👋
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Ето какво се случва с вашия сайт днес
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/news/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
          >
            <Plus className="w-5 h-5" />
            Нова новина
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Бързи действия
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                      {action.label}
                    </span>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Последна активност
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activity.status === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                }`}>
                  {activity.status === 'success' 
                    ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                    : <AlertCircle className="w-5 h-5 text-amber-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time} назад
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-6 text-white shadow-lg"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-1">Нуждаете се от помощ?</h3>
            <p className="text-white/80">
              Разгледайте документацията или се свържете с нас за поддръжка.
            </p>
          </div>
          <Link
            href="/admin/settings"
            className="px-6 py-3 bg-white text-primary rounded-xl font-bold hover:bg-white/90 transition-colors whitespace-nowrap"
          >
            Виж настройки
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
