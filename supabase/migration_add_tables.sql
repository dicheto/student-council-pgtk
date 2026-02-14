-- =============================================================================
-- MIGRATION: Add new tables for Admin Panel
-- Run this in your Supabase SQL Editor
-- =============================================================================

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

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

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

-- Site settings: Admin write, Public read
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Site settings are readable by everyone" ON public.site_settings;
CREATE POLICY "Site settings are readable by everyone"
  ON public.site_settings FOR SELECT
  USING (true);

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

-- =============================================================================
-- TRIGGERS FOR updated_at
-- =============================================================================

DROP TRIGGER IF EXISTS update_team_members_updated_at ON public.team_members;
CREATE TRIGGER update_team_members_updated_at 
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at 
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gallery_albums_updated_at ON public.gallery_albums;
CREATE TRIGGER update_gallery_albums_updated_at 
  BEFORE UPDATE ON public.gallery_albums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- SAMPLE DATA (Optional - uncomment to add demo data)
-- =============================================================================

-- INSERT INTO public.team_members (name, role, description, badge, order_index) VALUES
-- ('Председател', 'Ръководител на съвета', 'Координира всички дейности и представлява съвета пред училищното ръководство.', 'Лидер', 0),
-- ('Заместник-председател', 'Организационна дейност', 'Подпомага председателя и отговаря за организацията на събитията.', 'Организатор', 1),
-- ('Секретар', 'Документация', 'Води протоколите от заседанията и поддържа документацията на съвета.', NULL, 2),
-- ('PR Мениджър', 'Комуникации', 'Отговаря за социалните мрежи и комуникацията с учениците.', 'Креативен', 3);

-- INSERT INTO public.gallery_albums (title, description, cover_gradient, order_index) VALUES
-- ('Спортни събития', 'Състезания, турнири и спортни празници', 'from-blue-500 to-cyan-500', 0),
-- ('Културни мероприятия', 'Концерти, театър и изкуство', 'from-purple-500 to-pink-500', 1),
-- ('Образователни инициативи', 'Семинари, уъркшопи и обучения', 'from-amber-500 to-orange-500', 2);

-- =============================================================================
-- DEFAULT SITE SETTINGS (Optional - uncomment to add defaults)
-- =============================================================================

-- INSERT INTO public.site_settings (key, value) VALUES
-- ('site_name', '"Ученически Съвет"'),
-- ('site_description', '"Вдъхновяваме промяна, изграждаме общност, създаваме бъдеще."'),
-- ('school_name', '"ПГТК \"\""'),
-- ('contact_email', '"contact@pgtk.bg"'),
-- ('enable_discord', 'true'),
-- ('enable_newsletter', 'false'),
-- ('primary_color', '"#0047AB"'),
-- ('accent_color', '"#F59E0B"')
-- ON CONFLICT (key) DO NOTHING;

SELECT 'Migration completed successfully!' as status;
