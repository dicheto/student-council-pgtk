-- Fix infinite recursion by using SIMPLE policies only
-- Admin operations will use service role key (bypasses RLS)

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.user_profiles;

-- ==============================================================================
-- SIMPLE POLICIES - NO CROSS-TABLE CHECKS
-- ==============================================================================

-- Users table: Only allow users to see/update their OWN profile
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- User profiles table: Only allow users to see/update their OWN profile
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- ==============================================================================
-- IMPORTANT: Admin operations MUST use service role key
-- The middleware already uses service role key which bypasses RLS
-- ==============================================================================

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;

-- Service role can do everything (bypasses RLS)
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.user_profiles TO service_role;

-- Verify
DO $$
BEGIN
  RAISE NOTICE '✅ RLS policies simplified!';
  RAISE NOTICE '📝 Users can only view/update their own profiles';
  RAISE NOTICE '🔑 Admin operations use service role key (bypass RLS)';
  RAISE NOTICE '🚫 No cross-table checks = No recursion';
END $$;
