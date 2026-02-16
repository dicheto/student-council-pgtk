-- Drop policies one by one with CASCADE
DROP POLICY IF EXISTS "Service role manages user profiles" ON public.user_profiles CASCADE;
DROP POLICY IF EXISTS "User profiles viewable by everyone" ON public.user_profiles CASCADE;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles CASCADE;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles CASCADE;
DROP POLICY IF EXISTS "Users manage own profile" ON public.user_profiles CASCADE;

DROP POLICY IF EXISTS "Service role manages users" ON public.users CASCADE;
DROP POLICY IF EXISTS "Users are viewable by everyone" ON public.users CASCADE;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users CASCADE;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users CASCADE;
DROP POLICY IF EXISTS "Users manage themselves" ON public.users CASCADE;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create NEW simple policies
CREATE POLICY "users_view_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_view_own" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.user_profiles TO service_role;

-- Verify
SELECT '✅ RLS Fixed!' as status;
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('users', 'user_profiles') ORDER BY tablename, policyname;
