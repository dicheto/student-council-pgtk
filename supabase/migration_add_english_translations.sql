-- ============================================================================
-- Add Missing English Translations
-- ============================================================================
-- Run this in Supabase SQL Editor to update all dictionary entries with English translations

-- Update Events Section
UPDATE public.dictionary SET value_en = 'Events' WHERE key = 'events.title';
UPDATE public.dictionary SET value_en = 'Upcoming' WHERE key = 'events.title_highlight';
UPDATE public.dictionary SET value_en = 'Events' WHERE key = 'events.subtitle';
UPDATE public.dictionary SET value_en = 'Recommended' WHERE key = 'events.featured_badge';
UPDATE public.dictionary SET value_en = 'Upcoming' WHERE key = 'events.status_upcoming';
UPDATE public.dictionary SET value_en = 'Ended' WHERE key = 'events.status_ended';
UPDATE public.dictionary SET value_en = 'Details' WHERE key = 'events.details_btn';
UPDATE public.dictionary SET value_en = 'View all events' WHERE key = 'events.view_all_btn';

-- Update News Section
UPDATE public.dictionary SET value_en = 'Latest News' WHERE key = 'news.title';
UPDATE public.dictionary SET value_en = 'News' WHERE key = 'news.title_highlight';
UPDATE public.dictionary SET value_en = 'News' WHERE key = 'news.subtitle';
UPDATE public.dictionary SET value_en = 'Read' WHERE key = 'news.read_btn';
UPDATE public.dictionary SET value_en = 'View all news' WHERE key = 'news.view_all_btn';

-- Update Team Section
UPDATE public.dictionary SET value_en = 'Our Team' WHERE key = 'team.title';
UPDATE public.dictionary SET value_en = 'Team' WHERE key = 'team.title_highlight';
UPDATE public.dictionary SET value_en = 'Meet the team' WHERE key = 'team.subtitle';
UPDATE public.dictionary SET value_en = 'Contact us' WHERE key = 'team.join_btn';

-- Update Gallery Section
UPDATE public.dictionary SET value_en = 'Our Gallery' WHERE key = 'gallery.title';
UPDATE public.dictionary SET value_en = 'Gallery' WHERE key = 'gallery.title_highlight';
UPDATE public.dictionary SET value_en = 'Gallery' WHERE key = 'gallery.subtitle';
UPDATE public.dictionary SET value_en = 'View full gallery' WHERE key = 'gallery.view_all_btn';

-- Update CTA Section
UPDATE public.dictionary SET value_en = 'Invitation to participate' WHERE key = 'cta.badge';
UPDATE public.dictionary SET value_en = 'Idea. Team. Action.' WHERE key = 'cta.title';
UPDATE public.dictionary SET value_en = 'If you have the energy to improve school life — this is the place. We organize, communicate and finish what we started.' WHERE key = 'cta.subtitle';
UPDATE public.dictionary SET value_en = 'Contact us' WHERE key = 'cta.cta1_btn';
UPDATE public.dictionary SET value_en = 'Learn more' WHERE key = 'cta.cta2_btn';

-- Update About Section (if not already updated)
UPDATE public.dictionary SET value_en = 'PGTK' WHERE key = 'about.badge' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'About Us' WHERE key = 'about.title' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'The PGTK Student Council is an organization by students for students. We are the voice of every student and work to improve school life.' WHERE key = 'about.hero_description' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Members' WHERE key = 'about.stats.members' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Events/year' WHERE key = 'about.stats.events' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Years of history' WHERE key = 'about.stats.years' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Active projects' WHERE key = 'about.stats.projects' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Our Mission' WHERE key = 'about.mission_title' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'The Student Council works to create a dynamic and inclusive environment where every student can develop their potential, be heard, and contribute to school life.' WHERE key = 'about.mission_text1' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'We are the voice of the students and partners with the administration in creating a positive school community. We organize events, support initiatives, and make the school a place where everyone wants to be.' WHERE key = 'about.mission_text2' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Together we can achieve more than individually. The Student Council is proof of this.' WHERE key = 'about.quote' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Student Council President' WHERE key = 'about.quote_author' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Our Values' WHERE key = 'about.values_title' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'The principles that guide us in everything we do' WHERE key = 'about.values_subtitle' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Heart and Spirit' WHERE key = 'about.value1_title' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'We believe in the power of community and collective spirit. Every student matters.' WHERE key = 'about.value1_desc' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Goal and Focus' WHERE key = 'about.value2_title' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'We set clear goals and work hard to achieve them.' WHERE key = 'about.value2_desc' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Collaboration' WHERE key = 'about.value3_title' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'We work together as one team for the common good of all students.' WHERE key = 'about.value3_desc' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Excellence' WHERE key = 'about.value4_title' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'We strive for the highest standards and recognize outstanding achievements.' WHERE key = 'about.value4_desc' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Innovation' WHERE key = 'about.value5_title' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'We seek new and creative approaches to problem solving.' WHERE key = 'about.value5_desc' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Development' WHERE key = 'about.value6_title' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'We support the personal and professional development of every member.' WHERE key = 'about.value6_desc' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Our History' WHERE key = 'about.history_title' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'The journey we took together' WHERE key = 'about.history_subtitle' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Founding of the Student Council' WHERE key = 'about.timeline_2014' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'First charity campaign' WHERE key = 'about.timeline_2016' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Creation of the traditional autumn ball' WHERE key = 'about.timeline_2018' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Transition to online format' WHERE key = 'about.timeline_2020' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Most members in history' WHERE key = 'about.timeline_2022' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'New modern website' WHERE key = 'about.timeline_2024' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Join Us!' WHERE key = 'about.cta_title' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'The Student Council is open to all students who want to make a difference. Whether you want to organize events or just help out, there is a place for you!' WHERE key = 'about.cta_description' AND value_en IS NULL;
UPDATE public.dictionary SET value_en = 'Contact Us' WHERE key = 'about.cta_button' AND value_en IS NULL;

-- Verify the update by checking how many entries now have both translations
SELECT COUNT(*) as entries_with_both_languages FROM public.dictionary WHERE value_en IS NOT NULL AND value_bg IS NOT NULL;
