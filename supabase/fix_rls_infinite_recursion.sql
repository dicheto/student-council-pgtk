-- ============================================================================
-- FIX: Infinite Recursion in RLS Policies
-- ============================================================================
-- Problem: Policies that check users.role create recursion
-- Solution: Use SECURITY DEFINER functions that bypass RLS

-- Helper function to check if user is admin/moderator
CREATE OR REPLACE FUNCTION public.is_admin_or_moderator()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users u
    JOIN public.users pu ON pu.id = u.id
    WHERE u.id = auth.uid()
    AND pu.role IN ('admin', 'moderator')
  );
END;
$$;

-- Helper function to check if user is admin only
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users u
    JOIN public.users pu ON pu.id = u.id
    WHERE u.id = auth.uid()
    AND pu.role = 'admin'
  );
END;
$$;

-- ============================================================================
-- Update RLS Policies to use helper functions
-- ============================================================================

-- NEWS POLICIES
DROP POLICY IF EXISTS "Admins can manage news" ON public.news;
CREATE POLICY "Admins can manage news"
  ON public.news FOR ALL
  USING (is_admin_or_moderator());

-- EVENTS POLICIES
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  USING (is_admin_or_moderator());

-- DISCORD SETTINGS POLICIES
DROP POLICY IF EXISTS "Admins can manage discord settings" ON public.discord_settings;
CREATE POLICY "Admins can manage discord settings"
  ON public.discord_settings FOR ALL
  USING (is_admin());

-- CUSTOM PAGES POLICIES
DROP POLICY IF EXISTS "Admins can manage pages" ON public.custom_pages;
CREATE POLICY "Admins can manage pages"
  ON public.custom_pages FOR ALL
  USING (is_admin_or_moderator());

-- LINKS POLICIES
DROP POLICY IF EXISTS "Admins can manage links" ON public.links;
CREATE POLICY "Admins can manage links"
  ON public.links FOR ALL
  USING (is_admin_or_moderator());

-- TEAM MEMBERS POLICIES
DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;
CREATE POLICY "Admins can manage team members"
  ON public.team_members FOR ALL
  USING (is_admin_or_moderator());

-- SITE SETTINGS POLICIES
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (is_admin());

-- GALLERY ALBUMS POLICIES
DROP POLICY IF EXISTS "Admins can manage albums" ON public.gallery_albums;
CREATE POLICY "Admins can manage albums"
  ON public.gallery_albums FOR ALL
  USING (is_admin_or_moderator());

-- GALLERY IMAGES POLICIES
DROP POLICY IF EXISTS "Admins can manage images" ON public.gallery_images;
CREATE POLICY "Admins can manage images"
  ON public.gallery_images FOR ALL
  USING (is_admin_or_moderator());
