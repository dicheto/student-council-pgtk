-- Copy-paste този код в Supabase SQL Editor
-- (Database -> SQL Editor -> New Query)

-- === Users Table ===
CREATE POLICY "users_view_own" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "users_update_own" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "users_insert_own" 
  ON public.users FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- === User Profiles Table ===
CREATE POLICY "profiles_view_own" 
  ON public.user_profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" 
  ON public.user_profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" 
  ON public.user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
