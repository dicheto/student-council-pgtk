-- Dynamically drop ALL policies on users and user_profiles tables

DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on user_profiles
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_profiles' AND schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_profiles', r.policyname);
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
    
    -- Drop all policies on users
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'users' AND schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', r.policyname);
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- Create ONLY these simple policies - NO cross-table checks

CREATE POLICY "view_own_profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "update_own_profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "view_own_profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "update_own_profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow INSERT for new users (during signup)
CREATE POLICY "allow_insert_own"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_insert_own"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.user_profiles TO service_role;

-- Verify
SELECT 'All old policies dropped, new simple policies created!' AS status;
SELECT policyname, tablename FROM pg_policies WHERE tablename IN ('users', 'user_profiles') AND schemaname = 'public';
