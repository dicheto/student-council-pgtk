-- Manually drop each old policy by exact name

-- User profiles
DROP POLICY "Service role manages user profiles" ON public.user_profiles CASCADE;
DROP POLICY "User profiles viewable by everyone" ON public.user_profiles CASCADE;
DROP POLICY "Users can update their own profile" ON public.user_profiles CASCADE;
DROP POLICY "Users can view their own profile" ON public.user_profiles CASCADE;
DROP POLICY "Users manage own profile" ON public.user_profiles CASCADE;

-- Users
DROP POLICY "Service role manages users" ON public.users CASCADE;
DROP POLICY "Users are viewable by everyone" ON public.users CASCADE;
DROP POLICY "Users can update their own profile" ON public.users CASCADE;
DROP POLICY "Users can view their own profile" ON public.users CASCADE;
DROP POLICY "Users manage themselves" ON public.users CASCADE;

-- Now create ONLY simple policies

-- Users table
CREATE POLICY "view_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "update_own" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "insert_own" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- User profiles table
CREATE POLICY "view_own" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "update_own" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "insert_own" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.user_profiles TO service_role;

SELECT '✅ DONE! Only 3 simple policies per table now.' as status;
