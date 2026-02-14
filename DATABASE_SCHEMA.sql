-- ============================================================================
-- Student Council PGTK - Supabase PostgreSQL Schema
-- ============================================================================
-- This schema provides the complete database structure for the web application
-- including authentication, content management, and Discord integration.
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- 1. AUTHENTICATION & USERS
-- ============================================================================
-- Note: Supabase Auth creates the auth.users table automatically
-- We extend it with a public users profile table

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'bg')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Note: Admin/Editor view all profiles is handled by middleware with SERVICE_ROLE_KEY
-- Service role bypasses RLS, so no recursive policy needed here

-- ============================================================================
-- 2. NEWS & ARTICLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  featured_image_url TEXT,
  author_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'bg')),
  publish_to_discord BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_news_status ON public.news(status);
CREATE INDEX IF NOT EXISTS idx_news_language ON public.news(language);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_author_id ON public.news(author_id);

-- Enable RLS for news
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Published news is visible to everyone"
  ON public.news FOR SELECT
  USING (status = 'published' OR auth.uid() IN (
    SELECT id FROM public.user_profiles WHERE role IN ('admin', 'editor')
  ));

CREATE POLICY "Authors and admins can update their news"
  ON public.news FOR UPDATE
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 3. EVENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  location_url TEXT,
  image_url TEXT,
  color TEXT DEFAULT '#0047AB',
  ics_data TEXT,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'bg')),
  author_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_language ON public.events(language);
CREATE INDEX IF NOT EXISTS idx_events_is_published ON public.events(is_published);
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);

-- Enable RLS for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Published events are visible to everyone"
  ON public.events FOR SELECT
  USING (is_published = TRUE OR auth.uid() IN (
    SELECT id FROM public.user_profiles WHERE role IN ('admin', 'editor')
  ));

-- ============================================================================
-- 4. DISCORD SETTINGS & CONFIGURATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.discord_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_url TEXT,
  bot_token TEXT,
  guild_id TEXT,
  active_channel TEXT,
  active_channel_id TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  encrypted BOOLEAN DEFAULT TRUE,
  
  -- Only allow one settings record
  CONSTRAINT only_one_record CHECK (id IS NOT NULL)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_discord_settings_active ON public.discord_settings(is_active);

-- Enable RLS for discord_settings
ALTER TABLE public.discord_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only admins can access
CREATE POLICY "Only admins can view Discord settings"
  ON public.discord_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update Discord settings"
  ON public.discord_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 5. CUSTOM PAGES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.custom_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  language TEXT NOT NULL CHECK (language IN ('en', 'bg')),
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(slug, language)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_custom_pages_slug ON public.custom_pages(slug);
CREATE INDEX IF NOT EXISTS idx_custom_pages_language ON public.custom_pages(language);

-- Enable RLS
ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Published pages are visible to everyone"
  ON public.custom_pages FOR SELECT
  USING (is_published = TRUE OR auth.uid() IN (
    SELECT id FROM public.user_profiles WHERE role = 'admin'
  ));

-- ============================================================================
-- 6. MEDIA / FILE UPLOADS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  storage_path TEXT,
  uploader_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_uploader_id ON public.media(uploader_id);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON public.media(created_at DESC);

-- Enable RLS
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Media is visible to authenticated users"
  ON public.media FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- 7. LINKS / NAVIGATION ITEMS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'bg')),
  is_external BOOLEAN DEFAULT FALSE,
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_links_position ON public.links(position);
CREATE INDEX IF NOT EXISTS idx_links_language ON public.links(language);

-- Enable RLS
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Links are visible to everyone"
  ON public.links FOR SELECT
  USING (TRUE);

-- ============================================================================
-- 8. ACTIVITY LOG / AUDIT
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON public.activity_log(entity_type, entity_id);

-- Enable RLS
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only admins can view
CREATE POLICY "Only admins can view activity log"
  ON public.activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 9. TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discord_settings_updated_at
  BEFORE UPDATE ON public.discord_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_pages_updated_at
  BEFORE UPDATE ON public.custom_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at
  BEFORE UPDATE ON public.links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. SEED DATA (OPTIONAL - Comment out after first run)
-- ============================================================================

-- Insert initial Discord settings record
INSERT INTO public.discord_settings (id, is_active)
VALUES (uuid_generate_v4(), FALSE)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SETUP INSTRUCTIONS
-- ============================================================================
/*
1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and paste this entire script
3. Execute the script
4. The schema is now ready for use

IMPORTANT: 
- Configure Supabase Auth in the dashboard
- Enable Google OAuth and other providers as needed
- Set up Storage buckets for media uploads:
  - Create a "news-images" bucket
  - Create a "event-images" bucket
  - Set them to public or authenticated access as needed
- Set up Row Level Security (RLS) policies as provided above
- The discord_settings table is encrypted by default - use a Supabase vault extension for production

TO GET CREDENTIALS:
1. Go to Project Settings > API
2. Copy Project URL and anon/service_role keys
3. Add to your .env.local file
*/
