-- Drop ALL policies from both tables to start completely fresh

-- User profiles policies
DROP POLICY IF EXISTS "Service role manages user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "User profiles viewable by everyone" ON public.user_profiles;
DROP POLICY IF EXISTS "Users manage own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.user_profiles;

-- Users table policies
DROP POLICY IF EXISTS "Service role manages users" ON public.users;
DROP POLICY IF EXISTS "Users viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Users manage own account" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;

-- Create ONLY these two simple policies per table
-- NO admin policies that check other tables = NO recursion

CREATE POLICY "Users view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Profiles view own"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Profiles update own"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.user_profiles TO service_role;

SELECT 'RLS policies reset successfully!' AS status;
