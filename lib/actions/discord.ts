// lib/actions/discord.ts
'use server'

import { createClient } from '@/lib/supabase/server'

export interface DiscordSettingsInput {
  webhookUrl?: string
  botToken?: string
  guildId?: string
  activeChannel?: string
  activeChannelId?: string
  isActive?: boolean
}

export async function updateDiscordSettings(input: DiscordSettingsInput) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'Unauthorized' }
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return { error: 'Admin access required' }
    }

    // Get or create settings
    const { data: existing } = await supabase
      .from('discord_settings')
      .select('id')
      .single()

    if (existing) {
      const { data, error } = await supabase
        .from('discord_settings')
        .update({
          webhook_url: input.webhookUrl,
          bot_token: input.botToken,
          guild_id: input.guildId,
          active_channel: input.activeChannel,
          active_channel_id: input.activeChannelId,
          is_active: input.isActive,
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        return { error: error.message }
      }

      return { data, success: true }
    } else {
      const { data, error } = await supabase
        .from('discord_settings')
        .insert({
          webhook_url: input.webhookUrl,
          bot_token: input.botToken,
          guild_id: input.guildId,
          active_channel: input.activeChannel,
          active_channel_id: input.activeChannelId,
          is_active: input.isActive,
        })
        .select()
        .single()

      if (error) {
        return { error: error.message }
      }

      return { data, success: true }
    }
  } catch (error) {
    return { error: String(error) }
  }
}

export async function getDiscordSettings() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('discord_settings')
      .select('*')
      .single()

    if (error) {
      return { error: error.message }
    }

    // Don't expose sensitive data
    return {
      data: {
        ...data,
        bot_token: data.bot_token ? '***' : null,
        webhook_url: data.webhook_url ? '***' : null,
      },
      success: true,
    }
  } catch (error) {
    return { error: String(error) }
  }
}
