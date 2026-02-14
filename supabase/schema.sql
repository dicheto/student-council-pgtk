-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mirror table expected by some frontend parts (alias to users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user','admin','moderator','editor')),
  language TEXT DEFAULT 'bg' CHECK (language IN ('bg','en')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News table
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title JSONB NOT NULL, -- {bg: "...", en: "..."}
  content JSONB NOT NULL,
  excerpt JSONB,
  slug TEXT UNIQUE NOT NULL,
  images_urls TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_news_status ON public.news(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_author ON public.news(author_id);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title JSONB NOT NULL, -- {bg: "...", en: "..."}
  description JSONB NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  location_url TEXT,
  image_url TEXT,
  ics_data TEXT, -- Pre-generated ICS file content
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
  featured BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);

-- Discord settings table
CREATE TABLE IF NOT EXISTS public.discord_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_url TEXT,
  bot_token TEXT,
  guild_id TEXT,
  active_channel_id TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(id) -- Only one settings record
);

-- Custom pages table
CREATE TABLE IF NOT EXISTS public.custom_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title JSONB NOT NULL, -- {bg: "...", en: "..."}
  content JSONB NOT NULL,
  language TEXT DEFAULT 'bg' CHECK (language IN ('bg', 'en')),
  published BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_pages_slug ON public.custom_pages(slug);
CREATE INDEX IF NOT EXISTS idx_custom_pages_language ON public.custom_pages(language);

-- Links table (for navigation or external links)
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title JSONB NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  category TEXT,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_links_category ON public.links(category);
CREATE INDEX IF NOT EXISTS idx_links_order ON public.links(order_index);

-- Team members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  email TEXT,
  instagram TEXT,
  badge TEXT,
  avatar_url TEXT,
  order_index INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_order ON public.team_members(order_index);
CREATE INDEX IF NOT EXISTS idx_team_members_visible ON public.team_members(visible);

-- Site settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

-- Gallery albums table
CREATE TABLE IF NOT EXISTS public.gallery_albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  cover_gradient TEXT DEFAULT 'from-blue-500 to-cyan-500',
  order_index INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id UUID REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_images_album ON public.gallery_images(album_id);

-- Row Level Security Policies

-- Users: public read, manage via service role or self
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Users are viewable by everyone" ON public.users;
CREATE POLICY "Users are viewable by everyone"
  ON public.users FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage users" ON public.users;
DROP POLICY IF EXISTS "Service role manages users" ON public.users;
DROP POLICY IF EXISTS "Users manage themselves" ON public.users;
CREATE POLICY "Service role manages users"
  ON public.users FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Users manage themselves"
  ON public.users FOR ALL
  USING (auth.uid() = id);

-- User profiles mirror
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User profiles viewable by everyone" ON public.user_profiles;
DROP POLICY IF EXISTS "User profiles viewable by everyone" ON public.user_profiles;
CREATE POLICY "User profiles viewable by everyone"
  ON public.user_profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role manages user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role manages user profiles" ON public.user_profiles;
CREATE POLICY "Service role manages user profiles"
  ON public.user_profiles FOR ALL
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users manage own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users manage own profile" ON public.user_profiles;
CREATE POLICY "Users manage own profile"
  ON public.user_profiles FOR ALL
  USING (auth.uid() = id);

-- News: Public read published, Admin write
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published news are viewable by everyone" ON public.news;
DROP POLICY IF EXISTS "Published news is visible to everyone" ON public.news;
CREATE POLICY "Published news are viewable by everyone"
  ON public.news FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage news" ON public.news;
CREATE POLICY "Admins can manage news"
  ON public.news FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'moderator')
    )
  );

-- Events: Public read published, Admin write
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published events are viewable by everyone" ON public.events;
DROP POLICY IF EXISTS "Published events is visible to everyone" ON public.events;
CREATE POLICY "Published events are viewable by everyone"
  ON public.events FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'moderator')
    )
  );

-- Discord settings: Admin only
ALTER TABLE public.discord_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage discord settings" ON public.discord_settings;
CREATE POLICY "Admins can manage discord settings"
  ON public.discord_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Custom pages: Public read published, Admin write
ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published pages are viewable by everyone" ON public.custom_pages;
DROP POLICY IF EXISTS "Published pages is visible to everyone" ON public.custom_pages;
CREATE POLICY "Published pages are viewable by everyone"
  ON public.custom_pages FOR SELECT
  USING (published = TRUE);

DROP POLICY IF EXISTS "Admins can manage pages" ON public.custom_pages;
CREATE POLICY "Admins can manage pages"
  ON public.custom_pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'moderator')
    )
  );

-- Links: Public read visible, Admin write
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Visible links are viewable by everyone" ON public.links;
CREATE POLICY "Visible links are viewable by everyone"
  ON public.links FOR SELECT
  USING (visible = TRUE);

DROP POLICY IF EXISTS "Admins can manage links" ON public.links;
CREATE POLICY "Admins can manage links"
  ON public.links FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'moderator')
    )
  );

-- Team members: Public read visible, Admin write
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Visible team members are viewable by everyone" ON public.team_members;
CREATE POLICY "Visible team members are viewable by everyone"
  ON public.team_members FOR SELECT
  USING (visible = TRUE);

DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;
CREATE POLICY "Admins can manage team members"
  ON public.team_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'moderator')
    )
  );

-- Site settings: Admin only
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Site settings are readable by everyone" ON public.site_settings;
CREATE POLICY "Site settings are readable by everyone"
  ON public.site_settings FOR SELECT
  USING (true);

-- Gallery albums: Public read visible, Admin write
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Visible albums are viewable by everyone" ON public.gallery_albums;
CREATE POLICY "Visible albums are viewable by everyone"
  ON public.gallery_albums FOR SELECT
  USING (visible = TRUE);

DROP POLICY IF EXISTS "Admins can manage albums" ON public.gallery_albums;
CREATE POLICY "Admins can manage albums"
  ON public.gallery_albums FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'moderator')
    )
  );

-- Gallery images: Public read, Admin write
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Gallery images are viewable by everyone" ON public.gallery_images;
CREATE POLICY "Gallery images are viewable by everyone"
  ON public.gallery_images FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage gallery images" ON public.gallery_images;
CREATE POLICY "Admins can manage gallery images"
  ON public.gallery_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'moderator')
    )
  );

-- Functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_updated_at ON public.news;
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_custom_pages_updated_at ON public.custom_pages;
CREATE TRIGGER update_custom_pages_updated_at BEFORE UPDATE ON public.custom_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_links_updated_at ON public.links;
CREATE TRIGGER update_links_updated_at BEFORE UPDATE ON public.links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
