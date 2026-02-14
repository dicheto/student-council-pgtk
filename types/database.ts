// Database types for Supabase tables

export interface User {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'admin' | 'moderator'
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface News {
  id: string
  title: { bg: string; en?: string }
  content: { bg: string; en?: string }
  excerpt: { bg: string; en?: string } | null
  slug: string
  images_urls: string[]
  author_id: string | null
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  views: number
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface Event {
  id: string
  title: { bg: string; en?: string }
  description: { bg: string; en?: string }
  slug: string
  start_date: string
  end_date: string | null
  location: string | null
  location_url: string | null
  image_url: string | null
  ics_data: string | null
  status: 'draft' | 'published' | 'cancelled'
  featured: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  description: string | null
  email: string | null
  instagram: string | null
  badge: string | null
  avatar_url: string | null
  order_index: number
  visible: boolean
  created_at: string
  updated_at: string
}

export interface GalleryAlbum {
  id: string
  title: string
  description: string | null
  cover_gradient: string
  order_index: number
  visible: boolean
  created_at: string
  updated_at: string
  // Virtual field for image count
  image_count?: number
}

export interface GalleryImage {
  id: string
  album_id: string
  url: string
  caption: string | null
  order_index: number
  created_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: any
  updated_by: string | null
  updated_at: string
}

export interface DiscordSettings {
  id: string
  webhook_url: string | null
  bot_token: string | null
  guild_id: string | null
  active_channel_id: string | null
  enabled: boolean
  updated_by: string | null
  updated_at: string
}

export interface CustomPage {
  id: string
  slug: string
  title: { bg: string; en?: string }
  content: { bg: string; en?: string }
  language: 'bg' | 'en'
  published: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Link {
  id: string
  title: { bg: string; en?: string }
  url: string
  icon: string | null
  order_index: number
  category: string | null
  visible: boolean
  created_at: string
  updated_at: string
}

// Site settings keys
export type SiteSettingKey = 
  | 'site_name'
  | 'site_description'
  | 'school_name'
  | 'school_address'
  | 'contact_email'
  | 'contact_phone'
  | 'social_facebook'
  | 'social_instagram'
  | 'social_twitter'
  | 'primary_color'
  | 'accent_color'
  | 'dark_mode_default'
  | 'enable_discord'
  | 'enable_newsletter'
  | 'enable_comments'
  | 'hero_title'
  | 'hero_subtitle'
  | 'hero_tagline'
  | 'show_hero_stats'
  | 'show_hero_particles'
  | 'show_timeline'
  | 'show_team_section'
  | 'show_gallery'
  | 'footer_text'
  | 'show_social_links'

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
      news: {
        Row: News
        Insert: Omit<News, 'id' | 'created_at' | 'updated_at' | 'views'>
        Update: Partial<Omit<News, 'id' | 'created_at'>>
      }
      events: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Event, 'id' | 'created_at'>>
      }
      team_members: {
        Row: TeamMember
        Insert: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TeamMember, 'id' | 'created_at'>>
      }
      gallery_albums: {
        Row: GalleryAlbum
        Insert: Omit<GalleryAlbum, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<GalleryAlbum, 'id' | 'created_at'>>
      }
      gallery_images: {
        Row: GalleryImage
        Insert: Omit<GalleryImage, 'id' | 'created_at'>
        Update: Partial<Omit<GalleryImage, 'id' | 'created_at'>>
      }
      site_settings: {
        Row: SiteSetting
        Insert: Omit<SiteSetting, 'id' | 'updated_at'>
        Update: Partial<Omit<SiteSetting, 'id'>>
      }
      discord_settings: {
        Row: DiscordSettings
        Insert: Omit<DiscordSettings, 'id' | 'updated_at'>
        Update: Partial<Omit<DiscordSettings, 'id'>>
      }
      custom_pages: {
        Row: CustomPage
        Insert: Omit<CustomPage, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CustomPage, 'id' | 'created_at'>>
      }
      links: {
        Row: Link
        Insert: Omit<Link, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Link, 'id' | 'created_at'>>
      }
    }
  }
}
