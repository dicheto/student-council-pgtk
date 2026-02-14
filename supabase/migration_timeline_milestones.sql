-- Create timeline_milestones table for timeline events
CREATE TABLE IF NOT EXISTS public.timeline_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title JSONB NOT NULL, -- {bg: "Начало на учебната година", en: "Start of school year"}
  description JSONB NOT NULL,
  month TEXT NOT NULL, -- "Септември", "Октомври", etc.
  year TEXT NOT NULL, -- "2024", "2025"
  icon TEXT NOT NULL DEFAULT 'Calendar', -- Icon name from lucide-react
  color TEXT NOT NULL DEFAULT 'from-blue-500 to-cyan-500', -- Gradient colors
  is_highlighted BOOLEAN DEFAULT FALSE, -- Show "Не пропускайте!" badge
  display_order INTEGER DEFAULT 0, -- Sort order
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_timeline_milestones_order ON public.timeline_milestones(display_order);

-- Enable RLS
ALTER TABLE public.timeline_milestones ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view milestones
CREATE POLICY "Public can view milestones"
  ON public.timeline_milestones
  FOR SELECT
  USING (true);

-- Policy: Only admins can insert milestones
CREATE POLICY "Admins can insert milestones"
  ON public.timeline_milestones
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy: Only admins can update milestones
CREATE POLICY "Admins can update milestones"
  ON public.timeline_milestones
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy: Only admins can delete milestones
CREATE POLICY "Admins can delete milestones"
  ON public.timeline_milestones
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Insert initial timeline milestones
INSERT INTO public.timeline_milestones (title, description, month, year, icon, color, is_highlighted, display_order)
VALUES
  (
    '{"bg": "Начало на учебната година", "en": "Start of School Year"}'::jsonb,
    '{"bg": "Официално откриване на новата учебна година с тържествена церемония и приветствие от ученическия съвет.", "en": "Official opening of the new school year with a ceremonial event and greetings from the student council."}'::jsonb,
    'Септември',
    '2024',
    'GraduationCap',
    'from-blue-500 to-cyan-500',
    false,
    1
  ),
  (
    '{"bg": "Есенен бал", "en": "Autumn Ball"}'::jsonb,
    '{"bg": "Традиционен есенен бал с музика, танци и много забавления за всички ученици.", "en": "Traditional autumn ball with music, dancing and lots of fun for all students."}'::jsonb,
    'Октомври',
    '2024',
    'PartyPopper',
    'from-purple-500 to-pink-500',
    true,
    2
  ),
  (
    '{"bg": "Благотворителна акция", "en": "Charity Campaign"}'::jsonb,
    '{"bg": "Събиране на дарения за деца в нужда. Всяка помощ е важна!", "en": "Collecting donations for children in need. Every contribution matters!"}'::jsonb,
    'Ноември',
    '2024',
    'Heart',
    'from-red-500 to-orange-500',
    false,
    3
  ),
  (
    '{"bg": "Коледен базар", "en": "Christmas Bazaar"}'::jsonb,
    '{"bg": "Традиционен коледен базар с ръчно изработени изделия и вкусни лакомства.", "en": "Traditional Christmas bazaar with handmade crafts and delicious treats."}'::jsonb,
    'Декември',
    '2024',
    'Sparkles',
    'from-green-500 to-emerald-500',
    true,
    4
  ),
  (
    '{"bg": "Ден на влюбените", "en": "Valentine''s Day"}'::jsonb,
    '{"bg": "Специална инициатива с послания и изненади за всички ученици.", "en": "Special initiative with messages and surprises for all students."}'::jsonb,
    'Февруари',
    '2025',
    'Heart',
    'from-pink-500 to-rose-500',
    false,
    5
  ),
  (
    '{"bg": "Пролетен спортен празник", "en": "Spring Sports Festival"}'::jsonb,
    '{"bg": "Състезания, игри и много спорт за здраво тяло и дух.", "en": "Competitions, games and lots of sports for a healthy body and mind."}'::jsonb,
    'Март',
    '2025',
    'Trophy',
    'from-amber-500 to-yellow-500',
    true,
    6
  ),
  (
    '{"bg": "Абитуриентски бал", "en": "Prom"}'::jsonb,
    '{"bg": "Честване на завършващите ученици с незабравим абитуриентски бал.", "en": "Celebrating graduating students with an unforgettable prom night."}'::jsonb,
    'Май',
    '2025',
    'Star',
    'from-indigo-500 to-purple-500',
    true,
    7
  ),
  (
    '{"bg": "Край на учебната година", "en": "End of School Year"}'::jsonb,
    '{"bg": "Официално закриване на учебната година и награждаване на отличниците.", "en": "Official end of the school year and awards ceremony for top students."}'::jsonb,
    'Юни',
    '2025',
    'Flag',
    'from-teal-500 to-cyan-500',
    false,
    8
  );

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_timeline_milestones_updated_at
  BEFORE UPDATE ON public.timeline_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
