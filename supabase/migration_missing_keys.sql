-- ============================================================================
-- Add Missing Dictionary Keys (Based on Actual Database Keys)
-- ============================================================================
-- Run this in Supabase SQL Editor to add remaining missing keys

INSERT INTO public.dictionary (key, category, value_en, value_bg, description, sort_order) VALUES

-- MISSING EVENTS KEYS (using different naming convention than expected)
('events.title', 'events', 'Events', 'События', 'Events - Title', 9),
('events.title_highlight', 'events', 'Upcoming', 'Предстоящи', 'Events - Title highlight', 10),
('events.subtitle', 'events', 'Events', 'събития', 'Events - Subtitle', 11),
('events.status_ended', 'events', 'Ended', 'Приключило', 'Events - Status ended', 12),
('events.details_btn', 'events', 'Details', 'Детайли', 'Events - Details button', 13),
('events.view_all_btn', 'events', 'View all events', 'Виж всички събития', 'Events - View all button', 14),

-- MISSING NEWS KEYS
('news.title', 'news', 'Latest News', 'Последни новини', 'News - Title', 7),
('news.title_highlight', 'news', 'News', 'новини', 'News - Title highlight', 8),
('news.subtitle', 'news', 'News', 'новини', 'News - Subtitle', 9),
('news.read_btn', 'news', 'Read', 'Прочети', 'News - Read button', 10),
('news.view_all_btn', 'news', 'View all news', 'Виж всички новини', 'News - View all button', 11),

-- MISSING TEAM KEYS
('team.title', 'team', 'Our Team', 'Нашия екип', 'Team - Title', 7),
('team.title_highlight', 'team', 'Team', 'екип', 'Team - Title highlight', 8),
('team.subtitle', 'team', 'Meet the team', 'Запознайте се с екипа', 'Team - Subtitle', 9),
('team.join_btn', 'team', 'Contact us', 'Свържи се', 'Team - Join button', 10),

-- MISSING GALLERY KEYS  
('gallery.title', 'gallery', 'Our Gallery', 'Нашата галерия', 'Gallery - Title', 7),
('gallery.title_highlight', 'gallery', 'Gallery', 'галерия', 'Gallery - Title highlight', 8),
('gallery.subtitle', 'gallery', 'Gallery', 'галерия', 'Gallery - Subtitle', 9),
('gallery.view_all_btn', 'gallery', 'View full gallery', 'Виж цялата галерия', 'Gallery - View all button', 10),

-- MISSING CTA KEYS (using different naming)
('cta.badge', 'sections', 'Invitation to participate', 'Покана за участие', 'CTA - Badge', 12),
('cta.title', 'sections', 'Idea. Team. Action.', 'Идея. Екип. Действие.', 'CTA - Title', 13),
('cta.subtitle', 'sections', 'If you have the energy to improve school life — this is the place. We organize, communicate and finish what we started.', 'Ако имаш енергия да подобряваш училищния живот — тук е място. Ние организираме, комуникираме и довършваме започнатото.', 'CTA - Subtitle', 14),
('cta.cta1_btn', 'sections', 'Contact us', 'Свържи се с нас', 'CTA - Button 1', 15),
('cta.cta2_btn', 'sections', 'Learn more', 'Научи повече', 'CTA - Button 2', 16)

ON CONFLICT (key, category) DO NOTHING;
