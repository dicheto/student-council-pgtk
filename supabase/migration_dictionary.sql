-- ============================================================================
-- Dictionary/Content Management Table
-- ============================================================================
-- This table stores all editable content for the website

CREATE TABLE IF NOT EXISTS public.dictionary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'navigation', 'hero', 'team', 'events', 'news', 'gallery', 
    'footer', 'buttons', 'common', 'sections', 'team_members'
  )),
  value_en TEXT,
  value_bg TEXT,
  description TEXT,
  is_html BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(key, category)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_dictionary_key ON public.dictionary(key);
CREATE INDEX IF NOT EXISTS idx_dictionary_category ON public.dictionary(category);
CREATE INDEX IF NOT EXISTS idx_dictionary_sort_order ON public.dictionary(sort_order);

-- Enable RLS
ALTER TABLE public.dictionary ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Dictionary is visible to everyone"
  ON public.dictionary FOR SELECT
  USING (TRUE);

CREATE POLICY "Only admins can update dictionary"
  ON public.dictionary FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can insert dictionary"
  ON public.dictionary FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete dictionary"
  ON public.dictionary FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Table for team members data
CREATE TABLE IF NOT EXISTS public.team_members_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_bg TEXT NOT NULL,
  role_en TEXT NOT NULL,
  role_bg TEXT NOT NULL,
  description_en TEXT,
  description_bg TEXT,
  badge_en TEXT,
  badge_bg TEXT,
  email TEXT,
  instagram TEXT,
  image_url TEXT,
  position_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for team members
CREATE INDEX IF NOT EXISTS idx_team_members_position ON public.team_members_data(position_order);
CREATE INDEX IF NOT EXISTS idx_team_members_visible ON public.team_members_data(is_visible);

-- Enable RLS for team members
ALTER TABLE public.team_members_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team members
CREATE POLICY "Team members are visible to everyone"
  ON public.team_members_data FOR SELECT
  USING (is_visible = TRUE);

CREATE POLICY "Only admins can manage team members"
  ON public.team_members_data FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_dictionary_updated_at
  BEFORE UPDATE ON public.dictionary
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA - Complete dictionary entries with all content
-- ============================================================================

INSERT INTO public.dictionary (key, category, value_en, value_bg, description, sort_order) VALUES
-- NAVIGATION
('nav.home', 'navigation', 'Home', 'Начало', 'Navigation - Home', 1),
('nav.about', 'navigation', 'About', 'За нас', 'Navigation - About', 2),
('nav.events', 'navigation', 'Events', 'Събития', 'Navigation - Events', 3),
('nav.news', 'navigation', 'News', 'Новини', 'Navigation - News', 4),
('nav.gallery', 'navigation', 'Gallery', 'Галерия', 'Navigation - Gallery', 5),
('nav.contact', 'navigation', 'Contact', 'Контакт', 'Navigation - Contact', 6),

-- COMMON BUTTONS
('btn.read_more', 'buttons', 'Read more', 'Прочети още', 'Button - Read more', 1),
('btn.save', 'buttons', 'Save', 'Запази', 'Button - Save', 2),
('btn.cancel', 'buttons', 'Cancel', 'Отмени', 'Button - Cancel', 3),
('btn.delete', 'buttons', 'Delete', 'Изтрий', 'Button - Delete', 4),
('btn.view_all', 'buttons', 'View all', 'Виж всички', 'Button - View all', 5),
('btn.learn_more', 'buttons', 'Learn more', 'Научи повече', 'Button - Learn more', 6),
('btn.contact_us', 'buttons', 'Contact us', 'Свържи се с нас', 'Button - Contact us', 7),
('btn.join_us', 'buttons', 'Join us', 'Присъедини се', 'Button - Join us', 8),

-- HERO SECTION
('hero.badge', 'hero', 'PGTK "Georgi Izmirlieva"', 'ПГТК „"', 'Hero - School badge', 1),
('hero.title', 'hero', 'The Student Council, made to work', 'Ученическият съвет, направен да работи', 'Hero - Main title', 2),
('hero.title_highlight', 'hero', 'for you', 'за вас', 'Hero - Title highlight', 3),
('hero.subtitle', 'hero', 'News, events and initiatives — cleanly organized, no noise. One page that looks calm, but moves things forward.', 'Новини, събития и инициативи — подредени ясно, без шум. Една страница, която изглежда спокойно, но движи нещата напред.', 'Hero - Subtitle', 4),
('hero.cta_events', 'hero', 'See upcoming events', 'Виж предстоящите събития', 'Hero - Events CTA', 5),
('hero.cta_news', 'hero', 'Read the news', 'Прочети новините', 'Hero - News CTA', 6),
('hero.stat_events', 'hero', 'Events', 'Събития', 'Hero - Stats Events', 7),
('hero.stat_news', 'hero', 'News', 'Новини', 'Hero - Stats News', 8),
('hero.stat_moments', 'hero', 'Moments', 'Моменти', 'Hero - Stats Moments', 9),
('hero.dashboard_title', 'hero', 'Council Dashboard', 'Табло на съвета', 'Hero - Dashboard title', 10),
('hero.dashboard_subtitle', 'hero', 'Today • updated in real time', 'Днес • обновено в реално време', 'Hero - Dashboard subtitle', 11),
('hero.dashboard_status', 'hero', 'Online', 'Онлайн', 'Hero - Dashboard status', 12),
('hero.card1_title', 'hero', 'Next event', 'Следващо събитие', 'Hero - Card 1 title', 13),
('hero.card1_desc', 'hero', 'See date, place and program.', 'Виж датата, мястото и програмата.', 'Hero - Card 1 desc', 14),
('hero.card2_title', 'hero', 'Latest news', 'Последна новина', 'Hero - Card 2 title', 15),
('hero.card2_desc', 'hero', 'Brief summary, no extra.', 'Кратко резюме, без излишно.', 'Hero - Card 2 desc', 16),
('hero.card3_title', 'hero', 'Gallery', 'Галерия', 'Hero - Card 3 title', 17),
('hero.card3_desc', 'hero', 'Moments worth keeping.', 'Моменти, които си струва да пазим.', 'Hero - Card 3 desc', 18),

-- EVENTS SECTION
('events.section_title', 'events', 'Upcoming', 'Предстоящи', 'Events - Section title', 1),
('events.section_subtitle', 'events', 'Events', 'събития', 'Events - Section subtitle', 2),
('events.section_description', 'events', 'Don''t miss our exciting events and initiatives', 'Не пропускайте нашите вълнуващи събития и инициативи', 'Events - Description', 3),
('events.featured_badge', 'events', 'Recommended', 'Препоръчано', 'Events - Featured badge', 4),
('events.status_upcoming', 'events', 'Upcoming', 'Предстои', 'Events - Status upcoming', 5),
('events.status_finished', 'events', 'Finished', 'Приключило', 'Events - Status finished', 6),
('events.details_button', 'events', 'Details', 'Детайли', 'Events - Details button', 7),
('events.view_all_button', 'events', 'View all events', 'Виж всички събития', 'Events - View all button', 8),

-- NEWS SECTION
('news.section_title', 'news', 'Latest', 'Последни', 'News - Section title', 1),
('news.section_subtitle', 'news', 'News', 'новини', 'News - Section subtitle', 2),
('news.section_description', 'news', 'Be in the know with the latest news and events from our student council', 'Бъдете в течение с последните новини и събития от нашия ученически съвет', 'News - Description', 3),
('news.empty_message', 'news', 'No news published yet', 'Все още няма публикувани новини', 'News - Empty message', 4),
('news.read_button', 'news', 'Read', 'Прочети', 'News - Read button', 5),
('news.view_all_button', 'news', 'View all news', 'Виж всички новини', 'News - View all button', 6),

-- TEAM SECTION
('team.section_title', 'team', 'Our', 'Нашият', 'Team - Section title part 1', 1),
('team.section_subtitle', 'team', 'Team', 'екип', 'Team - Section subtitle', 2),
('team.section_description', 'team', 'Meet the members of the student council working for you', 'Запознайте се с членовете на ученическия съвет, които работят за вас', 'Team - Description', 3),
('team.join_title', 'team', 'Want to join?', 'Искаш да се присъединиш?', 'Team - Join CTA title', 4),
('team.join_subtitle', 'team', 'We are always looking for new members with ideas!', 'Винаги търсим нови членове с идеи!', 'Team - Join CTA subtitle', 5),
('team.contact_button', 'team', 'Contact us', 'Свържи се', 'Team - Join button', 6),

-- CTA SECTION
('cta.invitation_badge', 'sections', 'Invitation to participate', 'Покана за участие', 'CTA - Badge', 1),
('cta.main_title', 'sections', 'Idea. Team. Action.', 'Идея. Екип. Действие.', 'CTA - Title', 2),
('cta.main_description', 'sections', 'If you have the energy to improve school life — this is the place. We organize, communicate and finish what we started.', 'Ако имаш енергия да подобряваш училищния живот — тук е място. Ние организираме, комуникираме и довършваме започнатото.', 'CTA - Subtitle', 3),
('cta.contact_button', 'sections', 'Contact us', 'Свържи се с нас', 'CTA - Button 1', 4),
('cta.learn_more_button', 'sections', 'Learn more', 'Научи повече', 'CTA - Button 2', 5),
('cta.feature1_title', 'sections', 'Organization', 'Организация', 'CTA - Feature 1 title', 6),
('cta.feature1_desc', 'sections', 'Events, schedules, logistics.', 'Събития, графици, логистика.', 'CTA - Feature 1 desc', 7),
('cta.feature2_title', 'sections', 'Communication', 'Комуникация', 'CTA - Feature 2 title', 8),
('cta.feature2_desc', 'sections', 'News, announcements, transparency.', 'Новини, обяви, прозрачност.', 'CTA - Feature 2 desc', 9),
('cta.feature3_title', 'sections', 'Community', 'Общност', 'CTA - Feature 3 title', 10),
('cta.feature3_desc', 'sections', 'Initiatives with real impact.', 'Инициативи с реален ефект.', 'CTA - Feature 3 desc', 11),

-- GALLERY SECTION
('gallery.section_title', 'gallery', 'Our', 'Нашата', 'Gallery - Section title', 1),
('gallery.section_subtitle', 'gallery', 'Gallery', 'галерия', 'Gallery - Section subtitle', 2),
('gallery.section_description', 'gallery', 'Browse the moments from our events and initiatives', 'Разгледайте моментите от нашите външни и инициативи', 'Gallery - Description', 3),
('gallery.images_label', 'gallery', 'photos', 'снимки', 'Gallery - Images label', 4),
('gallery.open_drive_button', 'gallery', 'Open album in Google Drive', 'Отвори албума в Google Drive', 'Gallery - Open Drive button', 5),
('gallery.view_all_gallery_button', 'gallery', 'View full gallery', 'Виж цялата галерия', 'Gallery - View all button', 6),

-- FOOTER
('footer.copyright', 'footer', '© 2024 Student Council PGTK. All rights reserved.', '© 2024 Ученически Съвет ПГТК. Всички права запазени.', 'Footer - Copyright', 1),
('footer.made_with_love', 'footer', 'Made with ♥ by Student Council', 'Направено с ♥ от Ученическия съвет', 'Footer - Made with love', 2),
('footer.quick_links', 'footer', 'Quick Links', 'Бързи връзки', 'Footer - Quick links', 3),
('footer.contact_info', 'footer', 'Contact Info', 'Контактна информация', 'Footer - Contact info', 4),
('footer.follow_us', 'footer', 'Follow Us', 'Следи ни', 'Footer - Follow us', 5),

-- COMMON
('common.loading', 'common', 'Loading...', 'Зареждане...', 'Common - Loading', 1),
('common.error', 'common', 'Error loading data', 'Грешка при зареждане на данни', 'Common - Error', 2),
('common.no_results', 'common', 'No results found', 'Няма намерени резултати', 'Common - No results', 3),
('common.try_again', 'common', 'Try again', 'Опитай отново', 'Common - Try again', 4)
ON CONFLICT (key, category) DO NOTHING;
