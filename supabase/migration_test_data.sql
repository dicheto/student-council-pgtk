-- ============================================================================
-- ТЕСТОВИ ДАННИ ЗА ДЕМОНСТРАЦИЯ
-- ============================================================================
-- Това са тестови данни за новини, събития и галерия
-- Можеш да ги изтриеш след като покажеш на екипа
-- ============================================================================

-- Изчисти съществуващите тестови данни (ако има)
DELETE FROM public.news WHERE slug LIKE 'test-%' OR slug LIKE 'demo-%' OR slug LIKE 'dobре-%' OR slug LIKE 'esen-%' OR slug LIKE 'prisaedini-%';
DELETE FROM public.events WHERE slug LIKE 'test-%' OR slug LIKE 'demo-%' OR slug LIKE 'koleden-%' OR slug LIKE 'den-otvoreni-%';
DELETE FROM public.gallery_albums WHERE title LIKE 'Тестов%' OR title LIKE 'Demo%' OR title LIKE 'Есенен%' OR title LIKE 'Спортни%' OR title LIKE 'Културни%';

-- ============================================================================
-- НОВИНИ (NEWS)
-- ============================================================================

INSERT INTO public.news (title, slug, content, excerpt, images_urls, status, featured, published_at, created_at)
VALUES
  -- Новина 1: Добре дошли
  (
    '{"bg": "Добре дошли в новия сайт на Ученическия съвет!", "en": "Welcome to the new Student Council website!"}'::jsonb,
    'dobре-doshli-nov-sait',
    '{"bg": "<p>Здравейте, скъпи ученици и преподаватели!</p><p>С огромна радост ви представяме обновения сайт на Ученическия съвет на ПГТК \"\". Новата платформа е създадена с цел да ви предоставя бърз и лесен достъп до всички новини, събития и инициативи на съвета.</p><h2>Какво е ново?</h2><ul><li>Модерен и интуитивен дизайн</li><li>Календар с предстоящи събития</li><li>Галерия със снимки от нашите инициативи</li><li>Възможност за директна връзка с членовете на съвета</li></ul><p>Очакваме с нетърпение да споделяме с вас новините и да работим заедно за по-доброто училищно преживяване!</p><p>С уважение,<br/>Екипът на Ученическия съвет</p>", "en": "<p>Hello, dear students and teachers!</p><p>We are thrilled to present the updated Student Council website of PGTK \"Georgi Izmirlie\". The new platform is designed to provide you with quick and easy access to all council news, events, and initiatives.</p><h2>What''s new?</h2><ul><li>Modern and intuitive design</li><li>Event calendar</li><li>Photo gallery of our initiatives</li><li>Direct contact with council members</li></ul><p>We look forward to sharing news with you and working together for a better school experience!</p><p>Sincerely,<br/>The Student Council Team</p>"}'::jsonb,
    '{"bg": "Представяме ви новия модерен сайт на Ученическия съвет с календар, галерия и много нови функции!", "en": "Introducing the new modern Student Council website with calendar, gallery and many new features!"}'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'],
    'published',
    true,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),

  -- Новина 2: Есенен бал
  (
    '{"bg": "Есенният бал 2024 беше грандиозен успех!", "en": "Autumn Ball 2024 was a huge success!"}'::jsonb,
    'esen-bal-2024-uspeh',
    '{"bg": "<p>В събота, 26 октомври, проведохме традиционния Есенен бал - едно от най-очакваните събития на годината!</p><h2>Атмосферата беше невероятна</h2><p>Над 250 ученици се включиха в празненството, което се проведе в училищната зала. Музиката, организирана от DJ Енергия, създаде страхотно настроение за танци през цялата вечер.</p><h2>Специални моменти</h2><ul><li>Конкурс за най-добър костюм - победител Мария Димитрова, 11В клас</li><li>Фотобудка със забавни аксесоари</li><li>Томбола с награди от местни спонсори</li><li>Специално изпълнение от училищния хор</li></ul><p>Благодарим на всички, които участваха и направиха вечерта незабравима! Не пропускайте следващото ни събитие - Коледният базар през декември!</p>", "en": "<p>On Saturday, October 26, we held the traditional Autumn Ball - one of the most anticipated events of the year!</p><h2>The atmosphere was amazing</h2><p>Over 250 students participated in the celebration, which took place in the school hall. Music by DJ Energy created a great mood for dancing all night long.</p><h2>Special moments</h2><ul><li>Best costume contest - winner Maria Dimitrova, 11V class</li><li>Photo booth with fun accessories</li><li>Raffle with prizes from local sponsors</li><li>Special performance by the school choir</li></ul><p>Thank you to everyone who participated and made the evening unforgettable! Don''t miss our next event - the Christmas Bazaar in December!</p>"}'::jsonb,
    '{"bg": "Над 250 ученици танцуваха и се забавляваха на традиционния Есенен бал. Вижте какво се случи!", "en": "Over 250 students danced and had fun at the traditional Autumn Ball. See what happened!"}'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'],
    'published',
    true,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
  ),

  -- Новина 3: Благотворителна акция
  (
    '{"bg": "Присъедини се към благотворителната ни кампания", "en": "Join our charity campaign"}'::jsonb,
    'prisaedini-se',
    '{"bg": "<p>Скъпи съученици и преподаватели,</p><p>Ученическият съвет стартира благотворителна кампания за подпомагане на децата от Дом \"Надежда\" в София. Нашата цел е да съберем книги, играчки, дрехи и училищни пособия за 30-те деца, които живеят там.</p><h2>Как можеш да помогнеш?</h2><ul><li><strong>Дарение на вещи</strong> - Донеси в кутията до канцеларията на директора</li><li><strong>Финансово подпомагане</strong> - Банкова сметка: BG12 UNCR 7630 3300 1234 56</li><li><strong>Доброволчество</strong> - Запиши се за посещение на 15 декември</li></ul><h2>Какво се нуждае?</h2><p>В момента има най-голяма нужда от:</p><ul><li>Детски книги (4-12 години)</li><li>Образователни играчки</li><li>Зимни дрехи</li><li>Ученически пособия</li></ul><p>Всеки жест е важен! Нека заедно направим Коледа по-специална за тези деца.</p><p><em>Кампанията продължава до 20 декември.</em></p>", "en": "<p>Dear fellow students and teachers,</p><p>The Student Council is launching a charity campaign to support the children from Home \"Hope\" in Sofia. Our goal is to collect books, toys, clothes and school supplies for the 30 children living there.</p><h2>How can you help?</h2><ul><li><strong>Donate items</strong> - Bring to the box near the principal''s office</li><li><strong>Financial support</strong> - Bank account: BG12 UNCR 7630 3300 1234 56</li><li><strong>Volunteering</strong> - Sign up for a visit on December 15</li></ul><h2>What is needed?</h2><p>There is currently the greatest need for:</p><ul><li>Children''s books (ages 4-12)</li><li>Educational toys</li><li>Winter clothes</li><li>School supplies</li></ul><p>Every gesture matters! Let''s make Christmas more special for these children together.</p><p><em>Campaign continues until December 20.</em></p>"}'::jsonb,
    '{"bg": "Помогни на децата от Дом \"Надежда\" - дари книги, играчки или доброволческо време.", "en": "Help the children from Home \"Hope\" - donate books, toys or volunteer time."}'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800'],
    'published',
    true,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  ),

  -- Новина 4: Спортен турнир
  (
    '{"bg": "Училищен турнир по волейбол - записвания отворени", "en": "School volleyball tournament - registrations open"}'::jsonb,
    'volejbol-turnir-2024',
    '{"bg": "<p>Ученическият съвет организира традиционния междукласен турнир по волейбол, който ще се проведе между 15-22 ноември.</p><h2>Детайли за турнира</h2><ul><li><strong>Категории:</strong> Момчета и момичета (отделно)</li><li><strong>Отбори:</strong> 6 играчи + 2 резерви</li><li><strong>Награди:</strong> Купи и медали за топ 3</li><li><strong>Дата:</strong> Всяка събота от 10:00 до 16:00</li></ul><h2>Как да се запишеш?</h2><p>Попълни формуляра при Иван Петров (12А клас) или изпрати имейл на studentcouncil@pgtk.bg с имената на играчите до 10 ноември.</p><p>Очакваме оспорвани мачове и страхотна атмосфера! Ела да подкрепиш своя клас!</p>", "en": "<p>The Student Council is organizing the traditional inter-class volleyball tournament, which will take place between November 15-22.</p><h2>Tournament details</h2><ul><li><strong>Categories:</strong> Boys and girls (separate)</li><li><strong>Teams:</strong> 6 players + 2 substitutes</li><li><strong>Prizes:</strong> Cups and medals for top 3</li><li><strong>Date:</strong> Every Saturday from 10:00 to 16:00</li></ul><h2>How to register?</h2><p>Fill out the form with Ivan Petrov (12A class) or send an email to studentcouncil@pgtk.bg with player names by November 10.</p><p>We expect competitive matches and a great atmosphere! Come support your class!</p>"}'::jsonb,
    '{"bg": "Записвания за междукласния турнир по волейбол до 10 ноември. Спечели купа за своя клас!", "en": "Registrations for inter-class volleyball tournament until November 10. Win a cup for your class!"}'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800'],
    'published',
    false,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  ),

  -- Новина 5: Нови членове
  (
    '{"bg": "Запознайте се с новите членове на Ученическия съвет", "en": "Meet the new Student Council members"}'::jsonb,
    'novi-chlenove-2024',
    '{"bg": "<p>След проведените избори през септември, имаме удоволствието да ви представим новия състав на Ученическия съвет за учебната 2024/2025 година!</p><h2>Ръководен екип</h2><ul><li><strong>Председател:</strong> Мария Георгиева (12Б)</li><li><strong>Зам.-председател:</strong> Георги Стоянов (11А)</li><li><strong>Секретар:</strong> Елена Димитрова (10В)</li></ul><h2>Комисии</h2><p><strong>Комисия \"Култура\":</strong> 5 ученици, отговорни за организация на културни събития</p><p><strong>Комисия \"Спорт\":</strong> 4 ученици, организиращи спортни инициативи</p><p><strong>Комисия \"Медии\":</strong> 3 ученици, управляващи социалните мрежи и сайта</p><p>Общо 25 активни ученици ще работят през годината за подобряване на училищния живот. Всеки от вас може да се свърже с нас с идеи и предложения!</p><p>Благодарим на всички, които гласуваха и се довериха на новия екип!</p>", "en": "<p>After the elections held in September, we are pleased to introduce the new Student Council composition for the 2024/2025 school year!</p><h2>Leadership team</h2><ul><li><strong>President:</strong> Maria Georgieva (12B)</li><li><strong>Vice President:</strong> Georgi Stoyanov (11A)</li><li><strong>Secretary:</strong> Elena Dimitrova (10V)</li></ul><h2>Committees</h2><p><strong>Culture Committee:</strong> 5 students responsible for organizing cultural events</p><p><strong>Sports Committee:</strong> 4 students organizing sports initiatives</p><p><strong>Media Committee:</strong> 3 students managing social media and website</p><p>A total of 25 active students will work throughout the year to improve school life. Each of you can contact us with ideas and suggestions!</p><p>Thank you to everyone who voted and trusted the new team!</p>"}'::jsonb,
    '{"bg": "25 активни ученици ще работят през годината за подобряване на училищния живот.", "en": "25 active students will work throughout the year to improve school life."}'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800'],
    'published',
    false,
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '7 days'
  );

-- ============================================================================
-- СЪБИТИЯ (EVENTS)
-- ============================================================================

INSERT INTO public.events (title, slug, description, start_date, end_date, location, location_url, image_url, status, featured, created_at)
VALUES
  -- Събитие 1: Коледен базар
  (
    '{"bg": "Коледен базар 2024", "en": "Christmas Bazaar 2024"}'::jsonb,
    'koleden-bazar-2024',
    '{"bg": "Традиционният коледен базар на училището с ръчно изработени изделия, домашни сладки и топли напитки. Всички приходи отиват за благотворителна кампания.", "en": "Traditional school Christmas bazaar with handmade crafts, homemade sweets and hot drinks. All proceeds go to charity campaign."}'::jsonb,
    (NOW() + INTERVAL '15 days')::timestamp,
    (NOW() + INTERVAL '15 days' + INTERVAL '5 hours')::timestamp,
    'Училищен двор',
    null,
    'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800',
    'published',
    true,
    NOW()
  ),

  -- Събитие 2: Ден отворени врати
  (
    '{"bg": "Ден на отворените врати", "en": "Open Day"}'::jsonb,
    'den-otvoreni-vrati-2024',
    '{"bg": "Покани бъдещите ученици и родители да разгледат училището, да се запознаят с преподавателите и да научат повече за учебните програми.", "en": "Invite prospective students and parents to tour the school, meet teachers and learn more about academic programs."}'::jsonb,
    (NOW() + INTERVAL '25 days')::timestamp,
    (NOW() + INTERVAL '25 days' + INTERVAL '4 hours')::timestamp,
    'ПГТК ""',
    'https://maps.google.com',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
    'published',
    true,
    NOW()
  ),

  -- Събитие 3: Новогодишен концерт
  (
    '{"bg": "Новогодишен благотворителен концерт", "en": "New Year Charity Concert"}'::jsonb,
    'novogodishen-koncert-2024',
    '{"bg": "Специален концерт с изпълнения на училищния хор, оркестър и танцови групи. Вход: 5 лв, които отиват за довършване на спортната зала.", "en": "Special concert featuring school choir, orchestra and dance groups. Entrance: 5 BGN, which goes towards completing the sports hall."}'::jsonb,
    (NOW() + INTERVAL '40 days')::timestamp,
    (NOW() + INTERVAL '40 days' + INTERVAL '3 hours')::timestamp,
    'Актова зала',
    null,
    'https://images.unsplash.com/photo-1501742306-0c2c62daadb8?w=800',
    'published',
    true,
    NOW()
  ),

  -- Събитие 4: Лекция за кариера
  (
    '{"bg": "Лекция: \"Избор на професия и кариерно развитие\"", "en": "Lecture: \"Career Choice and Development\""}'::jsonb,
    'lekcia-kariera-2024',
    '{"bg": "Специален гост - кариерен консултант Иван Иванов ще сподели опит и съвети за избор на университет и професионално развитие.", "en": "Special guest - career consultant Ivan Ivanov will share experience and advice on university selection and professional development."}'::jsonb,
    (NOW() + INTERVAL '10 days')::timestamp,
    (NOW() + INTERVAL '10 days' + INTERVAL '2 hours')::timestamp,
    'Зала 205',
    null,
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    'published',
    false,
    NOW()
  ),

  -- Събитие 5: Еко инициатива
  (
    '{"bg": "Еко ден - засаждане на дръвчета", "en": "Eco Day - tree planting"}'::jsonb,
    'eko-den-2024',
    '{"bg": "Присъедини се към еко инициативата на училището! Ще засадим 50 дръвчета в училищния парк. Носи работни ръкавици.", "en": "Join the school''s eco initiative! We will plant 50 trees in the school park. Bring work gloves."}'::jsonb,
    (NOW() + INTERVAL '20 days')::timestamp,
    (NOW() + INTERVAL '20 days' + INTERVAL '3 hours')::timestamp,
    'Училищен парк',
    null,
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
    'published',
    false,
    NOW()
  ),

  -- Събитие 6: Абитуриентско парти (минало)
  (
    '{"bg": "Абитуриентски бал 2024", "en": "Prom 2024"}'::jsonb,
    'abiturientski-bal-2024',
    '{"bg": "Незабравима вечер за абитуренти с официална церемония, коктейл и парти до зори.", "en": "Unforgettable evening for graduates with official ceremony, cocktail and party till dawn."}'::jsonb,
    (NOW() - INTERVAL '30 days')::timestamp,
    (NOW() - INTERVAL '30 days' + INTERVAL '6 hours')::timestamp,
    'Хотел Гранд',
    'https://maps.google.com',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
    'published',
    false,
    NOW() - INTERVAL '35 days'
  );

-- ============================================================================
-- ГАЛЕРИЙНИ АЛБУМИ
-- ============================================================================

INSERT INTO public.gallery_albums (title, description, cover_gradient, order_index, created_at)
VALUES
  (
    'Есенен бал 2024',
    'Снимки от традиционния есенен бал - танци, забавления и страхотни моменти',
    'from-purple-500 to-pink-500',
    1,
    NOW() - INTERVAL '5 days'
  ),
  (
    'Спортни разположення',
    'Най-добрите моменти от спортните турнири и състезания',
    'from-orange-500 to-red-500',
    2,
    NOW() - INTERVAL '10 days'
  ),
  (
    'Културни мероприятия',
    'Концерти, театрални представления и изложби',
    'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800',
    3,
    NOW() - INTERVAL '15 days'
  );

-- ============================================================================
-- ГАЛЕРИЙНИ СНИМКИ
-- ============================================================================

-- Снимки за Есенен бал
INSERT INTO public.gallery_images (album_id, url, caption, order_index, created_at)
SELECT 
  (SELECT id FROM public.gallery_albums WHERE title = 'Есенен бал 2024'),
  image_url,
  caption,
  row_number,
  NOW() - INTERVAL '5 days'
FROM (
  VALUES
    ('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', 'Откриване на бала', 1),
    ('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800', 'DJ енергия създаде атмосфера', 2),
    ('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', 'Танци до зори', 3),
    ('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', 'Фотобудка', 4),
    ('https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800', 'Награждаване', 5)
) AS t(image_url, caption, row_number);

-- Снимки за Спортни събития
INSERT INTO public.gallery_images (album_id, url, caption, order_index, created_at)
SELECT 
  (SELECT id FROM public.gallery_albums WHERE title = 'Спортни разположення'),
  image_url,
  caption,
  row_number,
  NOW() - INTERVAL '10 days'
FROM (
  VALUES
    ('https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800', 'Волейболен турнир', 1),
    ('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', 'Футболно първенство', 2),
    ('https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', 'Баскетбол 3х3', 3),
    ('https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800', 'Награждаване', 4)
) AS t(image_url, caption, row_number);

-- Снимки за Културни мероприятия
INSERT INTO public.gallery_images (album_id, url, caption, order_index, created_at)
SELECT 
  (SELECT id FROM public.gallery_albums WHERE title = 'Културни мероприятия'),
  image_url,
  caption,
  row_number,
  NOW() - INTERVAL '15 days'
FROM (
  VALUES
    ('https://images.unsplash.com/photo-1501612780327-45045538702b?w=800', 'Коледен концерт', 1),
    ('https://images.unsplash.com/photo-1503095396549-807759245b35?w=800', 'Театрална постановка', 2),
    ('https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', 'Изложба', 3),
    ('https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800', 'Музикален фестивал', 4)
) AS t(image_url, caption, row_number);

-- ============================================================================
-- ������!
-- ============================================================================
-- ��������� ����� �� �������� �������.
-- ����� �� �� ����� ��:
-- - /news - ������ � ������
-- - /news/[slug] - ������� ������
-- - /events - �������� ��� �������
-- - /gallery - ������� � ������
-- ============================================================================

