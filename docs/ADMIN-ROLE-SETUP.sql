-- Admin Role Setup for Combos & Casa
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- 1. CREATE ADMIN ROLE CHECK FUNCTION
-- ============================================
-- This function checks if the current user has admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role')::text = 'admin',
    false
  );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============================================
-- 2. ADD ADMIN USER (OPTIONAL)
-- ============================================
-- To make a user an admin, run this after they've signed up:
-- Replace 'user-uuid-here' with the actual user ID from auth.users

-- Example: Update user's app_metadata to set admin role
-- UPDATE auth.users
-- SET raw_app_meta_data = 
--   raw_app_meta_data || 
--   '{"role": "admin"}'::jsonb
-- WHERE email = 'admin@yourdomain.com';

-- ============================================
-- 3. VERIFY ADMIN STATUS
-- ============================================
-- To check if a user is admin, run:
-- SELECT is_admin();
-- Returns true if current user is admin, false otherwise

-- ============================================
-- 4. LIST ALL ADMIN USERS
-- ============================================
-- SELECT 
--   id,
--   email,
--   raw_app_meta_data->>'role' as role,
--   created_at
-- FROM auth.users
-- WHERE raw_app_meta_data->>'role' = 'admin';

-- ============================================
-- NOTES:
-- ============================================
-- - Use app_metadata (not user_metadata) for role info
--   as it cannot be modified by the user
-- - Admin role is checked on every request to /admin routes
-- - Regular users will be redirected if they try to access admin routes
-- - To revoke admin access, set role to 'user' or remove the role field
