'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Server,
  Hash,
  MessageSquare,
  Users,
  Send,
  Edit,
  Trash2,
  Power,
  PowerOff,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Settings,
} from 'lucide-react'

interface BotInfo {
  connected: boolean
  bot?: {
    id: string
    username: string
    tag: string
    avatar: string
  }
  stats?: {
    guilds: number
    channels: number
    users: number
  }
  status?: string
  shards?: number
  error?: string
}

interface Guild {
  id: string
  name: string
  icon: string | null
  memberCount: number
  ownerId: string
}

interface Channel {
  id: string
  name: string
  type: number
  parentId: string | null
  position: number
}

interface Message {
  id: string
  content: string
  author: {
    id: string
    username: string
    tag: string
    avatar: string | null
    bot: boolean
  }
  createdAt: string
  editedAt?: string
  embeds: any[]
  attachments: any[]
}

export function BotControlPanel() {
  const [botInfo, setBotInfo] = useState<BotInfo>({ connected: false })
  const [selectedGuild, setSelectedGuild] = useState<string>('')
  const [selectedChannel, setSelectedChannel] = useState<string>('')
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [activeTab, setActiveTab] = useState<'guilds' | 'channels' | 'messages' | 'members'>('guilds')
  const [messageContent, setMessageContent] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    loadBotInfo()
    loadGuilds()
  }, [])

  useEffect(() => {
    if (selectedGuild) {
      loadChannels(selectedGuild)
      loadMembers(selectedGuild)
    }
  }, [selectedGuild])

  useEffect(() => {
    if (selectedChannel) {
      loadMessages(selectedChannel)
    }
  }, [selectedChannel])

  const loadBotInfo = async () => {
    try {
      const res = await fetch('/api/discord/bot-info')
      const data = await res.json()
      setBotInfo(data)
    } catch (error) {
      console.error('Error loading bot info:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadGuilds = async () => {
    try {
      const res = await fetch('/api/discord/guilds')
      const data = await res.json()
      setGuilds(data.guilds || [])
      if (data.guilds && data.guilds.length > 0 && !selectedGuild) {
        setSelectedGuild(data.guilds[0].id)
      }
    } catch (error) {
      console.error('Error loading guilds:', error)
    }
  }

  const loadChannels = async (guildId: string) => {
    try {
      const res = await fetch(`/api/discord/channels?guildId=${guildId}`)
      const data = await res.json()
      setChannels(data.channels || [])
      if (data.channels && data.channels.length > 0 && !selectedChannel) {
        const textChannel = data.channels.find((c: Channel) => c.type === 0)
        if (textChannel) setSelectedChannel(textChannel.id)
      }
    } catch (error) {
      console.error('Error loading channels:', error)
    }
  }

  const loadMessages = async (channelId: string) => {
    try {
      const res = await fetch(`/api/discord/messages?channelId=${channelId}&limit=50`)
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const loadMembers = async (guildId: string) => {
    try {
      const res = await fetch(`/api/discord/members?guildId=${guildId}`)
      const data = await res.json()
      setMembers(data.members || [])
    } catch (error) {
      console.error('Error loading members:', error)
    }
  }

  const handleConnect = async () => {
    setConnecting(true)
    try {
      const res = await fetch('/api/discord/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect' }),
      })
      const data = await res.json()
      if (data.success) {
        await loadBotInfo()
        await loadGuilds()
      } else {
        alert(data.error || 'Failed to connect')
      }
    } catch (error) {
      console.error('Error connecting:', error)
      alert('Failed to connect bot')
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm('Сигурни ли сте, че искате да изключите бота?')) return
    
    try {
      const res = await fetch('/api/discord/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disconnect' }),
      })
      const data = await res.json()
      if (data.success) {
        setBotInfo({ connected: false })
        setGuilds([])
        setChannels([])
        setMessages([])
        setMembers([])
      }
    } catch (error) {
      console.error('Error disconnecting:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!selectedChannel || !messageContent.trim()) return

    setSendingMessage(true)
    try {
      const res = await fetch('/api/discord/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: selectedChannel,
          content: messageContent,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setMessageContent('')
        await loadMessages(selectedChannel)
      } else {
        alert(data.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setSendingMessage(false)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете това съобщение?')) return

    try {
      const res = await fetch('/api/discord/delete-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: selectedChannel,
          messageId,
        }),
      })

      const data = await res.json()
      if (data.success) {
        await loadMessages(selectedChannel)
      } else {
        alert(data.error || 'Failed to delete message')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Failed to delete message')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Bot Status Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="apple-glass rounded-2xl p-6 border border-white/5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {botInfo.bot?.avatar ? (
              <img
                src={botInfo.bot.avatar}
                alt={botInfo.bot.username}
                className="w-16 h-16 rounded-full border-2 border-primary/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <Bot className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {botInfo.bot?.tag || 'Discord Bot'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {botInfo.connected ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400">Свързан</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600 dark:text-red-400">Несвързан</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {botInfo.connected ? (
              <motion.button
                onClick={handleDisconnect}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PowerOff className="w-4 h-4" />
                Изключи
              </motion.button>
            ) : (
              <motion.button
                onClick={handleConnect}
                disabled={connecting}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {connecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Power className="w-4 h-4" />
                )}
                {connecting ? 'Свързване...' : 'Включи'}
              </motion.button>
            )}
            <motion.button
              onClick={() => {
                loadBotInfo()
                loadGuilds()
              }}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {botInfo.connected && botInfo.stats && (
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {botInfo.stats.guilds}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Сървъри</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {botInfo.stats.channels}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Канали</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {botInfo.stats.users}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Потребители</div>
            </div>
          </div>
        )}

        {botInfo.error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700 dark:text-red-400">{botInfo.error}</span>
          </div>
        )}
      </motion.div>

      {!botInfo.connected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="apple-glass rounded-2xl p-6 border border-white/5 text-center"
        >
          <Bot className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Ботът не е свързан
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Включи бота, за да започнеш да управляваш Discord сървърите, каналите и съобщенията.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            Уверете се, че <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">DISCORD_BOT_TOKEN</code> е зададен в <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">.env.local</code>
          </p>
        </motion.div>
      )}

      {botInfo.connected && (
        <>
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'guilds' as const, label: 'Сървъри', icon: Server },
              { id: 'channels' as const, label: 'Канали', icon: Hash },
              { id: 'messages' as const, label: 'Съобщения', icon: MessageSquare },
              { id: 'members' as const, label: 'Членове', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Guilds Tab */}
          {activeTab === 'guilds' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="apple-glass rounded-2xl p-6 border border-white/5"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Сървъри ({guilds.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {guilds.map((guild) => (
                  <motion.button
                    key={guild.id}
                    onClick={() => setSelectedGuild(guild.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedGuild === guild.id
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 hover:border-primary/30'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      {guild.icon ? (
                        <img
                          src={guild.icon}
                          alt={guild.name}
                          className="w-12 h-12 rounded-xl"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                          <Server className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {guild.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {guild.memberCount} членове
                        </div>
                      </div>
                      {selectedGuild === guild.id && (
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Channels Tab */}
          {activeTab === 'channels' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="apple-glass rounded-2xl p-6 border border-white/5"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Канали ({channels.length})
              </h3>
              {!selectedGuild ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  Избери сървър първо
                </div>
              ) : (
                <div className="space-y-2">
                  {channels
                    .filter((c) => c.type === 0)
                    .map((channel) => (
                      <motion.button
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel.id)}
                        className={`w-full p-3 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                          selectedChannel === channel.id
                            ? 'border-primary bg-primary/10'
                            : 'border-white/10 hover:border-primary/30'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <Hash className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900 dark:text-white">
                            {channel.name}
                          </span>
                        </div>
                        {selectedChannel === channel.id && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </motion.button>
                    ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Send Message */}
              {selectedChannel && (
                <div className="apple-glass rounded-2xl p-4 border border-white/5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder="Напиши съобщение..."
                      className="flex-1 px-4 py-2 bg-white/50 dark:bg-slate-800/50 border-0 rounded-xl focus:ring-2 focus:ring-primary"
                    />
                    <motion.button
                      onClick={handleSendMessage}
                      disabled={!messageContent.trim() || sendingMessage}
                      className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {sendingMessage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Messages List */}
              <div className="apple-glass rounded-2xl p-6 border border-white/5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Съобщения ({messages.length})
                </h3>
                {!selectedChannel ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    Избери канал първо
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    Няма съобщения в този канал
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-white/30 dark:bg-slate-800/30 border border-white/10 hover:border-primary/30 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {message.author.avatar ? (
                                <img
                                  src={message.author.avatar}
                                  alt={message.author.username}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                                  <span className="text-xs text-white font-bold">
                                    {message.author.username[0].toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-slate-900 dark:text-white">
                                  {message.author.tag}
                                  {message.author.bot && (
                                    <span className="ml-2 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded">
                                      BOT
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                  {new Date(message.createdAt).toLocaleString('bg-BG')}
                                </div>
                              </div>
                            </div>
                            {message.content && (
                              <div className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                                {message.content}
                              </div>
                            )}
                            {message.embeds && message.embeds.length > 0 && (
                              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                {message.embeds.length} embed(s)
                              </div>
                            )}
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Изтрий"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="apple-glass rounded-2xl p-6 border border-white/5"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Членове ({members.length})
              </h3>
              {!selectedGuild ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  Избери сървър първо
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  Няма членове
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
                  {members.map((member) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-xl bg-white/30 dark:bg-slate-800/30 border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.username}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                            <span className="text-lg text-white font-bold">
                              {member.username[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 dark:text-white truncate">
                            {member.displayName || member.username}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {member.tag}
                          </div>
                          {member.roles && member.roles.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {member.roles.slice(0, 2).map((role: any) => (
                                <span
                                  key={role.id}
                                  className="text-xs px-2 py-0.5 rounded"
                                  style={{
                                    backgroundColor: role.color
                                      ? `#${role.color.toString(16).padStart(6, '0')}20`
                                      : 'rgba(0, 0, 0, 0.1)',
                                    color: role.color
                                      ? `#${role.color.toString(16).padStart(6, '0')}`
                                      : 'inherit',
                                  }}
                                >
                                  {role.name}
                                </span>
                              ))}
                              {member.roles.length > 2 && (
                                <span className="text-xs text-slate-500">
                                  +{member.roles.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
