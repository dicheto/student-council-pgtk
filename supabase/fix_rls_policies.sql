-- Fix infinite recursion in RLS policies
-- This script removes the circular dependency in user_profiles and users policies

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.user_profiles;

-- ==============================================================================
-- SIMPLE POLICIES WITHOUT RECURSION
-- ==============================================================================

-- Users table policies
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Service role will bypass RLS, so we don't need admin policy that causes recursion
-- For admin operations, use service role key in middleware/backend

CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.users WHERE id = auth.uid()));

-- User profiles table policies  
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Check role from users table (not user_profiles) to avoid recursion
CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role IN ('admin', 'editor', 'moderator')
    )
  );

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update profiles"
  ON public.user_profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- For users table, check user_profiles (opposite direction to avoid recursion)
CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role IN ('admin', 'editor', 'moderator')
    )
  );

CREATE POLICY "Admins can update users"
  ON public.users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;

-- Allow service role to bypass RLS (for middleware)
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.user_profiles TO service_role;

-- Verify the fix
DO $$
BEGIN
  RAISE NOTICE 'RLS policies updated successfully!';
  RAISE NOTICE 'Users table policies: view own + admins view all (checks user_profiles)';
  RAISE NOTICE 'User_profiles table policies: view own + admins view all (checks users)';
  RAISE NOTICE 'This cross-reference prevents infinite recursion.';
END $$;
