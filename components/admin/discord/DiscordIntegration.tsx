'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BotStatus } from './BotStatus'
import { WebhookSettings } from './WebhookSettings'
import { MessageLog } from './MessageLog'
import { ChannelSelector } from './ChannelSelector'

export function DiscordIntegration() {
  const [botStatus, setBotStatus] = useState<'online' | 'offline' | 'idle' | 'dnd'>('offline')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [channels, setChannels] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    // Зареждане на текущите настройки
    fetch('/api/discord/status')
      .then(res => res.json())
      .then(data => {
        if (data.status) setBotStatus(data.status)
        if (data.webhook) setWebhookUrl(data.webhook)
        if (data.channel) setSelectedChannel(data.channel)
      })
      .catch(err => console.error('Error loading status:', err))

    // Зареждане на каналите
    fetch('/api/discord/channels')
      .then(res => res.json())
      .then(data => {
        if (data.channels) setChannels(data.channels)
      })
      .catch(err => console.error('Error loading channels:', err))

    // Зареждане на лога съобщения
    fetch('/api/discord/messages')
      .then(res => res.json())
      .then(data => {
        if (data.messages) setMessages(data.messages)
      })
      .catch(err => console.error('Error loading messages:', err))
  }, [])

  const handleChannelChange = async (channelId: string) => {
    try {
      const response = await fetch('/api/discord/channel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId }),
      })

      if (response.ok) {
        setSelectedChannel(channelId)
        // Презареждане на съобщенията
        const messagesRes = await fetch('/api/discord/messages')
        const messagesData = await messagesRes.json()
        if (messagesData.messages) setMessages(messagesData.messages)
      }
    } catch (error) {
      console.error('Error changing channel:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Status and Settings */}
      <div className="lg:col-span-1 space-y-6">
        <BotStatus status={botStatus} />
        <WebhookSettings 
          webhookUrl={webhookUrl} 
          onWebhookChange={setWebhookUrl} 
        />
        <ChannelSelector
          channels={channels}
          selectedChannel={selectedChannel}
          onChannelChange={handleChannelChange}
        />
      </div>

      {/* Right Column - Message Log */}
      <div className="lg:col-span-2">
        <MessageLog messages={messages} />
      </div>
    </div>
  )
}
