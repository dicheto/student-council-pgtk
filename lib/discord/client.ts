// Discord.js се използва само на сървъра
let discordClient: any = null
let isConnecting = false

export async function getDiscordClient() {
  // Проверка дали сме на сървъра
  if (typeof window !== 'undefined') {
    return null
  }

  const token = process.env.DISCORD_BOT_TOKEN

  if (!token) {
    console.warn('DISCORD_BOT_TOKEN not configured')
    return null
  }

  // Динамичен import само на сървъра
  try {
    const { Client, GatewayIntentBits, Partials } = await import('discord.js')

    // Ако клиентът вече съществува и е готов, го връщаме
    if (discordClient && discordClient.isReady()) {
      return discordClient
    }

    // Ако вече се опитваме да се свържем, изчакваме
    if (isConnecting) {
      // Изчакваме до 10 секунди
      for (let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, 500))
        if (discordClient && discordClient.isReady()) {
          return discordClient
        }
      }
      return null
    }

    isConnecting = true

    // Създаване на нов клиент с пълни intents за пълно управление
    // ВАЖНО: Трябва да активираш всички Privileged Gateway Intents в Discord Developer Portal:
    // - Presence Intent
    // - Server Members Intent  
    // - Message Content Intent
    discordClient = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
      ],
    })

    // Event handlers
    discordClient.once('ready', () => {
      console.log(`✅ Discord bot logged in as ${discordClient?.user?.tag}`)
      console.log(`📊 Bot is in ${discordClient.guilds.cache.size} guild(s)`)
      isConnecting = false
    })

    discordClient.on('error', (error: Error) => {
      console.error('❌ Discord client error:', error)
      isConnecting = false
    })

    discordClient.on('warn', (warning: string) => {
      console.warn('⚠️ Discord client warning:', warning)
    })

    discordClient.on('disconnect', () => {
      console.log('🔌 Discord bot disconnected')
      isConnecting = false
    })

    discordClient.on('reconnecting', () => {
      console.log('🔄 Discord bot reconnecting...')
    })

    // Опит за login
    await discordClient.login(token)
    return discordClient
  } catch (error) {
    console.error('❌ Failed to initialize Discord bot:', error)
    isConnecting = false
    return null
  }
}

export async function disconnectDiscordClient() {
  if (discordClient && discordClient.isReady()) {
    await discordClient.destroy()
    discordClient = null
    console.log('🔌 Discord client disconnected')
  }
}
