-- ============================================================================
-- Complete RLS Fix - Removes ALL old policies and creates only simple ones
-- ============================================================================

DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all existing policies on user_profiles
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'user_profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_profiles', policy_record.policyname);
        RAISE NOTICE 'Dropped policy % from user_profiles', policy_record.policyname;
    END LOOP;

    -- Drop all existing policies on users
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'users'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', policy_record.policyname);
        RAISE NOTICE 'Dropped policy % from users', policy_record.policyname;
    END LOOP;

    RAISE NOTICE '✅ All old policies removed';
END $$;

-- ============================================================================
-- Enable RLS on both tables
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create SIMPLE policies - NO cross-table checks, NO recursion
-- ============================================================================

-- Users Table Policies
CREATE POLICY "users_view_own"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "users_insert_own"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User Profiles Table Policies
CREATE POLICY "profiles_view_own"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- Grant Permissions
-- ============================================================================

-- Allow authenticated users to access their own records
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;

-- Service role bypasses RLS (used by middleware for admin checks)
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.user_profiles TO service_role;

-- ============================================================================
-- Verification
-- ============================================================================

SELECT 
    '✅ RLS Fixed Successfully!' as status,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'user_profiles');

SELECT 
    tablename,
    policyname,
    cmd as "operation"
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'user_profiles')
ORDER BY tablename, policyname;

-- Final message
DO $$ 
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '====================================';
    RAISE NOTICE '✅ RLS Policies Fixed!';
    RAISE NOTICE '====================================';
    RAISE NOTICE '📋 Users table: 3 policies (view, update, insert)';
    RAISE NOTICE '📋 User_profiles table: 3 policies (view, update, insert)';
    RAISE NOTICE '🔒 RLS is now ENABLED';
    RAISE NOTICE '🔑 Admin operations use service_role key in middleware';
    RAISE NOTICE '🚫 NO cross-table checks = NO recursion!';
    RAISE NOTICE '';
END $$;
