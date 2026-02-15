-- ============================================================================
-- Add About Page Dictionary Entries
-- ============================================================================
-- Run this in Supabase SQL Editor to add all About page translations

INSERT INTO public.dictionary (key, category, value_en, value_bg, description, sort_order) VALUES
-- ABOUT PAGE - HERO
('about.badge', 'sections', 'PGTK', 'ПГТК', 'About - Badge', 1),
('about.title', 'sections', 'About Us', 'За нас', 'About - Page title', 2),
('about.hero_description', 'sections', 'The PGTK Student Council is an organization by students for students. We are the voice of every student and work to improve school life.', 'Ученическият съвет ПГТК е организация на ученици за ученици. Ние сме гласът на всеки ученик и работим за подобряване на училищния живот.', 'About - Hero description', 3),

-- ABOUT PAGE - STATS
('about.stats.members', 'sections', 'Members', 'Членове', 'About - Stats members', 4),
('about.stats.events', 'sections', 'Events/year', 'Събития/година', 'About - Stats events', 5),
('about.stats.years', 'sections', 'Years of history', 'Години история', 'About - Stats years', 6),
('about.stats.projects', 'sections', 'Active projects', 'Активни проекти', 'About - Stats projects', 7),

-- ABOUT PAGE - MISSION
('about.mission_title', 'sections', 'Our Mission', 'Нашата Мисия', 'About - Mission title', 8),
('about.mission_text1', 'sections', 'The Student Council works to create a dynamic and inclusive environment where every student can develop their potential, be heard, and contribute to school life.', 'Ученическият съвет работи да създаде динамична и включваща среда, където всеки ученик може да развие своя потенциал, да бъде чут и да внесе своя принос в живота на училището.', 'About - Mission text 1', 9),
('about.mission_text2', 'sections', 'We are the voice of the students and partners with the administration in creating a positive school community. We organize events, support initiatives, and make the school a place where everyone wants to be.', 'Ние сме гласът на учащите се и партньори на администрацията в създаването на позитивна училищна общност. Организираме събития, подкрепяме инициативи и правим училището място, в което всеки иска да бъде.', 'About - Mission text 2', 10),

-- ABOUT PAGE - QUOTE
('about.quote', 'sections', 'Together we can achieve more than individually. The Student Council is proof of this.', 'Заедно можем да постигнем повече, отколкото поотделно. Ученическият съвет е доказателство за това.', 'About - Quote', 11),
('about.quote_author', 'sections', 'Student Council President', 'Председател на УС', 'About - Quote author', 12),

-- ABOUT PAGE - VALUES
('about.values_title', 'sections', 'Our Values', 'Нашите Ценности', 'About - Values title', 13),
('about.values_subtitle', 'sections', 'The principles that guide us in everything we do', 'Принципите, които ни водят във всичко, което правим', 'About - Values subtitle', 14),

('about.value1_title', 'sections', 'Heart and Spirit', 'Сърце и дух', 'About - Value 1 title', 15),
('about.value1_desc', 'sections', 'We believe in the power of community and collective spirit. Every student matters.', 'Вярваме в силата на общността и колективния дух. Всеки ученик е важен.', 'About - Value 1 description', 16),

('about.value2_title', 'sections', 'Goal and Focus', 'Цел и фокус', 'About - Value 2 title', 17),
('about.value2_desc', 'sections', 'We set clear goals and work hard to achieve them.', 'Поставяме ясни цели и работим упорито за тяхното постигане.', 'About - Value 2 description', 18),

('about.value3_title', 'sections', 'Collaboration', 'Сътрудничество', 'About - Value 3 title', 19),
('about.value3_desc', 'sections', 'We work together as one team for the common good of all students.', 'Работим заедно като един екип за общото благо на всички ученици.', 'About - Value 3 description', 20),

('about.value4_title', 'sections', 'Excellence', 'Отличие', 'About - Value 4 title', 21),
('about.value4_desc', 'sections', 'We strive for the highest standards and recognize outstanding achievements.', 'Стремим се към най-високи стандарти и признаваме отличните постижения.', 'About - Value 4 description', 22),

('about.value5_title', 'sections', 'Innovation', 'Иновации', 'About - Value 5 title', 23),
('about.value5_desc', 'sections', 'We seek new and creative approaches to problem solving.', 'Търсим нови и креативни подходи за решаване на проблеми.', 'About - Value 5 description', 24),

('about.value6_title', 'sections', 'Development', 'Развитие', 'About - Value 6 title', 25),
('about.value6_desc', 'sections', 'We support the personal and professional development of every member.', 'Подкрепяме личностното и професионално развитие на всеки член.', 'About - Value 6 description', 26),

-- ABOUT PAGE - HISTORY
('about.history_title', 'sections', 'Our History', 'Нашата История', 'About - History title', 27),
('about.history_subtitle', 'sections', 'The journey we took together', 'Пътят, който извървяхме заедно', 'About - History subtitle', 28),

('about.timeline_2014', 'sections', 'Founding of the Student Council', 'Основаване на Ученическия съвет', 'About - Timeline 2014', 29),
('about.timeline_2016', 'sections', 'First charity campaign', 'Първа благотворителна кампания', 'About - Timeline 2016', 30),
('about.timeline_2018', 'sections', 'Creation of the traditional autumn ball', 'Създаване на традиционния есенен бал', 'About - Timeline 2018', 31),
('about.timeline_2020', 'sections', 'Transition to online format', 'Преминаване към онлайн формат', 'About - Timeline 2020', 32),
('about.timeline_2022', 'sections', 'Most members in history', 'Най-много членове в историята', 'About - Timeline 2022', 33),
('about.timeline_2024', 'sections', 'New modern website', 'Нов модерен уебсайт', 'About - Timeline 2024', 34),

-- ABOUT PAGE - CTA
('about.cta_title', 'sections', 'Join Us!', 'Присъедини се към нас!', 'About - CTA title', 35),
('about.cta_description', 'sections', 'The Student Council is open to all students who want to make a difference. Whether you want to organize events or just help out, there is a place for you!', 'Ученическият съвет е отворен за всички ученици, които искат да направят разлика. Независимо дали искаш да организираш събития или просто да помогнеш, има място за теб!', 'About - CTA description', 36),
('about.cta_button', 'sections', 'Contact Us', 'Свържи се с нас', 'About - CTA button', 37)

ON CONFLICT (key, category) DO NOTHING;
