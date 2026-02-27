# Security & Session Management Guide

## Overview
This guide covers the security improvements implemented for role-based access control and session timeout management.

---

## 1. Admin Role Setup

### Database Setup
Run the SQL script in your Supabase SQL Editor:

```bash
docs/ADMIN-ROLE-SETUP.sql
```

This creates the `is_admin()` function that checks if a user has admin privileges.

### Making a User Admin

After a user signs up, run this SQL in Supabase:

```sql
UPDATE auth.users
SET raw_app_meta_data = 
  raw_app_meta_data || 
  '{"role": "admin"}'::jsonb
WHERE email = 'admin@yourdomain.com';
```

### Verify Admin Status

```sql
-- As the admin user, run:
SELECT is_admin();
-- Returns: true

-- List all admins:
SELECT 
  id,
  email,
  raw_app_meta_data->>'role' as role,
  created_at
FROM auth.users
WHERE raw_app_meta_data->>'role' = 'admin';
```

---

## 2. Role-Based Access Control

### Admin Dashboard Protection
- ✅ Only users with `role: "admin"` can access `/admin/*` routes
- ✅ Regular users are redirected to homepage with an error message
- ✅ Unauthenticated users are redirected to sign-in page

### User Dashboard Protection
- ✅ Admins cannot access `/dashboard` routes
- ✅ Admins trying to access `/dashboard` are auto-redirected to `/admin`
- ✅ Regular users cannot access `/admin` routes
- ✅ Middleware checks on every request

### Implementation Files
- **`middleware.ts`** - Route protection and role checking
- **`app/dashboard/page.tsx`** - Client-side admin check and redirect
- **`app/admin/page.tsx`** - Admin dashboard (already protected)

---

## 3. Session Timeout (1 Day)

### How It Works
Sessions automatically expire after **24 hours** from creation.

### Features
- ✅ Sessions checked on every request via middleware
- ✅ Expired sessions trigger automatic sign-out
- ✅ User redirected to sign-in with "Session expired" message
- ✅ Only affects protected routes (`/admin`, `/dashboard`)

### Configuration
Located in `middleware.ts`:

```typescript
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // 24 hours

// Session age check
if (session && user) {
  const sessionCreatedAt = new Date(session.created_at || 0).getTime();
  const sessionAge = Date.now() - sessionCreatedAt;
  
  if (sessionAge > ONE_DAY_IN_MS) {
    await supabase.auth.signOut();
    // Redirect to sign-in...
  }
}
```

### Customizing Session Duration
To change from 1 day to a different duration:

```typescript
// Examples:
const ONE_HOUR = 60 * 60 * 1000;
const TWELVE_HOURS = 12 * 60 * 60 * 1000;
const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
```

---

## 4. Navbar Sign-In Button

### Current Behavior
The navbar already shows appropriate buttons based on authentication status:

- **Not Signed In**: Shows "Sign In" button
- **Signed In (Regular User)**: Shows "Dashboard" button
- **Signed In (Admin)**: Shows "Dashboard" button (links to `/admin`)

### Code Location
Located in `components/Navbar.tsx`:

```tsx
{user ? (
  <Link href="/dashboard">
    <User className="w-4 h-4" />
    <span>Dashboard</span>
  </Link>
) : (
  <Link href="/auth/signin">
    Sign In
  </Link>
)}
```

---

## 5. Security Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Access Flow                        │
└─────────────────────────────────────────────────────────────┘

User Visits Protected Route
         │
         ▼
   Middleware Checks
         │
         ├─── Is Authenticated? ──── NO ──► Redirect to /auth/signin
         │                                   
         ▼ YES
         │
    Check Session Age
         │
         ├─── > 24 hours? ──── YES ──► Sign Out & Redirect to /auth/signin
         │                              
         ▼ NO
         │
    Check Route Type
         │
         ├─── /admin/* ──► Check is_admin() ──┬─── TRUE ──► Allow Access
         │                                      │
         │                                      └─── FALSE ──► Redirect Home
         │
         └─── /dashboard/* ──► Check is_admin() ──┬─── TRUE ──► Redirect /admin
                                                   │
                                                   └─── FALSE ──► Allow Access
```

---

## 6. Testing Checklist

### Admin Role Testing
- [ ] Create a test admin user via SQL
- [ ] Verify admin can access `/admin`
- [ ] Verify admin is auto-redirected from `/dashboard` to `/admin`
- [ ] Verify regular user cannot access `/admin`

### Session Timeout Testing
- [ ] Sign in as a user
- [ ] Manually set session timestamp to 25 hours ago (for testing)
- [ ] Visit `/dashboard` - should be signed out and redirected
- [ ] Sign in again - session should work normally

### Navbar Testing
- [ ] Sign out - verify "Sign In" button appears
- [ ] Sign in as regular user - verify "Dashboard" button appears
- [ ] Sign in as admin - verify dashboard redirects to admin panel

---

## 7. Environment Variables

No new environment variables needed. Uses existing:

```env
NEXT_PUBLIC_SUPABASE_PROJECT_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 8. Troubleshooting

### "Access denied. Admin privileges required"
- User doesn't have admin role in `raw_app_meta_data`
- Run the SQL update command to grant admin role

### "is_admin() function does not exist"
- SQL function not created in Supabase
- Run `docs/ADMIN-ROLE-SETUP.sql` in SQL Editor

### Session Not Expiring
- Check middleware.ts is being executed
- Verify `session.created_at` exists in session object
- Check browser console for any errors

### Admin Can Still Access /dashboard
- Clear browser cache and cookies
- Verify middleware.ts changes are deployed
- Check that `is_admin()` returns true for the admin user

---

## 9. Production Deployment

### Before Going Live:
1. ✅ Run `ADMIN-ROLE-SETUP.sql` in production Supabase
2. ✅ Create admin users via SQL
3. ✅ Test all authentication flows
4. ✅ Verify session timeout works correctly
5. ✅ Test role-based redirects
6. ✅ Check middleware.ts is included in build

### Security Best Practices:
- ✅ Never store admin role in `user_metadata` (use `app_metadata`)
- ✅ Keep `SUPABASE_SERVICE_ROLE_KEY` secret and server-side only
- ✅ Regularly audit admin users
- ✅ Monitor failed authentication attempts
- ✅ Use HTTPS in production

---

## 10. File Changes Summary

### New Files:
- `docs/ADMIN-ROLE-SETUP.sql` - Database functions for admin role
- `docs/SECURITY-SESSION-GUIDE.md` - This file

### Modified Files:
- `middleware.ts` (renamed from `proxy.ts`)
  - Added admin check for `/dashboard` route
  - Added 1-day session timeout logic
  - Renamed function from `proxy` to `middleware`

- `app/dashboard/page.tsx`
  - Added admin check on page load
  - Auto-redirects admins to `/admin`

### Unchanged Files:
- `components/Navbar.tsx` - Already has correct sign-in button logic
- `app/admin/*` - Already protected via middleware
- All other authentication flows

---

## Support

For issues or questions:
1. Check Supabase logs for authentication errors
2. Review browser console for client-side errors
3. Verify SQL functions exist in Supabase
4. Test with different user roles
