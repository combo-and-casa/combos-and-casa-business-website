# 🔐 Security Checklist

Use this checklist to ensure your application is secure before deploying to production.

---

## ✅ Environment Variables Security

### Before You Deploy:

- [ ] **Audit all `NEXT_PUBLIC_` variables**
  ```bash
  # Check for exposed secrets
  grep -E "NEXT_PUBLIC_.*(SECRET|PASSWORD|PRIVATE)" .env
  ```
  - ✅ Should return **empty** (no results)
  - ❌ If matches found → Remove `NEXT_PUBLIC_` prefix immediately

- [ ] **Verify `.env` is in `.gitignore`**
  ```bash
  cat .gitignore | grep "\.env"
  ```
  - ✅ Should show: `.env*`

- [ ] **Check `.env` was never committed**
  ```bash
  git log --all --full-history -- .env
  ```
  - ✅ Should return **empty** (no commits)
  - ❌ If commits found → Follow remediation steps in [SECURITY-GUIDE.md](SECURITY-GUIDE.md)

- [ ] **Verify `.env.example` has no real secrets**
  ```bash
  cat .env.example
  ```
  - ✅ Should only contain placeholder values
  - ❌ If real keys found → Replace with placeholders

---

## 🔑 Key-Specific Checks

### Paystack Keys:

- [ ] **Public key uses `NEXT_PUBLIC_` prefix**
  ```env
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx  ✅
  ```

- [ ] **Secret key does NOT use `NEXT_PUBLIC_` prefix**
  ```env
  PAYSTACK_SECRET_KEY=sk_test_xxxxx  ✅
  ```
  
  **NOT:**
  ```env
  NEXT_PUBLIC_PAYSTACK_SECRET_KEY=sk_test_xxxxx  ❌ EXPOSED!
  ```

- [ ] **Secret key only used in API routes or server components**
  ```bash
  # Search for secret key usage
  grep -r "PAYSTACK_SECRET_KEY" app/ components/
  ```
  - ✅ Should only appear in `app/api/*` files
  - ❌ If in client components → Move to API route

### Supabase Keys:

- [ ] **Project URL and anon key use `NEXT_PUBLIC_`**
  ```env
  NEXT_PUBLIC_SUPABASE_PROJECT_URL=https://xxx.supabase.co  ✅
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...  ✅
  ```
  - These are safe because they're protected by Row Level Security (RLS)

- [ ] **Service role key (if used) does NOT use `NEXT_PUBLIC_`**
  ```env
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  ✅ (server-side only)
  ```

---

## 🧪 Testing

### Test 1: Check Build Output

```bash
# Build production bundle
npm run build

# Search for exposed secrets in built files
grep -r "sk_test_" .next/static/
grep -r "sk_live_" .next/static/
```
- ✅ Should return **empty**
- ❌ If found → Secret key is exposed, review your code

### Test 2: Inspect Browser Bundle

1. Run dev server: `npm run dev`
2. Open browser DevTools (F12)
3. Go to **Sources** tab
4. Search (`Ctrl+Shift+F`) for:
   - `sk_test_`
   - `sk_live_`
   - `secret_key`
   - Your actual secret key value
5. ✅ Should find **nothing**
6. ❌ If found → Secret is exposed

### Test 3: Environment Variable Access

Run this test file to verify which variables are accessible:

```typescript
// test-env-access.ts
'use client'

export function TestEnvAccess() {
  console.log('=== CLIENT-SIDE ENVIRONMENT TEST ===');
  
  // Should be defined (NEXT_PUBLIC_)
  console.log('PUBLIC_KEY:', process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY); // ✅ Defined
  console.log('SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL); // ✅ Defined
  
  // Should be undefined (no NEXT_PUBLIC_)
  console.log('SECRET_KEY:', process.env.PAYSTACK_SECRET_KEY); // ✅ Should be undefined
  
  // WARNING: If secret shows up here, IT'S EXPOSED!
  if (process.env.PAYSTACK_SECRET_KEY) {
    console.error('🚨 SECURITY BREACH: Secret key exposed to browser!');
  }
  
  return <div>Check console for results</div>;
}
```

---

## 📝 Code Review Checklist

### Client Components (`'use client'`):

- [ ] **No direct secret key access**
  ```typescript
  // ❌ BAD - Will expose if you add NEXT_PUBLIC_ by mistake
  const secret = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY;
  
  // ✅ GOOD - Call API route instead
  await fetch('/api/payments/verify', { ... });
  ```

### API Routes:

- [ ] **Secrets accessed without `NEXT_PUBLIC_`**
  ```typescript
  // ✅ CORRECT
  const secret = process.env.PAYSTACK_SECRET_KEY;
  ```

- [ ] **No secrets returned to client**
  ```typescript
  // ❌ BAD
  return NextResponse.json({ secretKey: process.env.PAYSTACK_SECRET_KEY });
  
  // ✅ GOOD
  return NextResponse.json({ success: true });
  ```

### Hardcoded Secrets:

- [ ] **No secrets in source code**
  ```bash
  # Search for potential hardcoded secrets
  grep -r "sk_test_" app/ components/
  grep -r "sk_live_" app/ components/
  ```
  - ✅ Should only find references to `process.env.PAYSTACK_SECRET_KEY`
  - ❌ If actual key values found → Move to `.env`

---

## 🚀 Production Deployment Checklist

### Before Deploying:

- [ ] **Use production keys, not test keys**
  ```env
  # Development (.env.local)
  PAYSTACK_SECRET_KEY=sk_test_xxxxx
  
  # Production (Vercel/Netlify dashboard)
  PAYSTACK_SECRET_KEY=sk_live_xxxxx
  ```

- [ ] **All environment variables set in hosting platform**
  - Vercel: Project Settings → Environment Variables
  - Netlify: Site Settings → Environment Variables
  - Others: Platform-specific configuration

- [ ] **`.env` file NOT deployed**
  - ✅ Hosting platforms use their own env var systems
  - ❌ Never upload `.env` to server

- [ ] **Different keys for different environments**
  - Development: Test keys
  - Staging: Test keys
  - Production: Live keys

### After Deploying:

- [ ] **Test payment flow end-to-end**
- [ ] **Verify no secrets in browser DevTools**
- [ ] **Check Network tab for exposed secrets in responses**
- [ ] **Monitor for unusual API activity**

---

## 🔄 Key Rotation Schedule

Set up regular key rotation:

- [ ] **Monthly:** Rotate Paystack test keys (development)
- [ ] **Quarterly:** Rotate Paystack live keys (production)
- [ ] **Annually:** Rotate Supabase keys
- [ ] **Immediately:** If breach suspected

### How to Rotate Keys:

1. Generate new key in service dashboard
2. Update `.env` locally
3. Test thoroughly
4. Update production environment variables
5. Deploy changes
6. Revoke old key (after confirming new one works)

---

## 📊 Security Monitoring

### Set Up Alerts:

- [ ] **Paystack dashboard:** Enable email alerts for unusual transactions
- [ ] **Supabase:** Monitor auth logs for suspicious activity
- [ ] **GitHub:** Enable secret scanning
- [ ] **Vercel/Netlify:** Set up error monitoring

### Regular Audits:

- [ ] **Weekly:** Review failed transaction logs
- [ ] **Monthly:** Check API usage patterns
- [ ] **Quarterly:** Full security audit
- [ ] **After any security news:** Update dependencies

---

## 🆘 Emergency Response Plan

### If You Suspect a Breach:

1. **Immediately rotate all keys**
   - Paystack: Dashboard → Settings → API Keys → Regenerate
   - Supabase: Dashboard → Settings → API → Reset keys

2. **Review logs for unauthorized access**
   - Check transaction history
   - Review API call logs
   - Look for unusual patterns

3. **Update all environments**
   - Local `.env`
   - Staging environment
   - Production environment

4. **Notify relevant parties**
   - If customer data affected → Follow data breach procedures
   - If financial transactions affected → Contact payment processor

5. **Document incident**
   - What was exposed
   - When it was discovered
   - Actions taken
   - Lessons learned

---

## 📚 Quick Reference

### Safe to Use `NEXT_PUBLIC_`:
- ✅ URLs
- ✅ Public keys
- ✅ Feature flags
- ✅ Analytics IDs
- ✅ Public configuration

### Must Keep Secret (No `NEXT_PUBLIC_`):
- 🔒 Secret keys
- 🔒 API tokens
- 🔒 Database credentials
- 🔒 Service role keys
- 🔒 Passwords
- 🔒 Private keys

---

## ✅ Final Verification

Run all checks before marking complete:

```bash
# Run complete security audit
echo "=== SECURITY AUDIT ==="

echo "1. Checking for exposed secrets..."
grep -E "NEXT_PUBLIC_.*(SECRET|PASSWORD|PRIVATE)" .env || echo "✅ No exposed secrets"

echo "2. Verifying .env is ignored..."
cat .gitignore | grep "\.env" && echo "✅ .env is ignored" || echo "❌ Add .env* to .gitignore"

echo "3. Checking git history..."
git log --all --full-history -- .env > /dev/null 2>&1 && echo "❌ .env was committed!" || echo "✅ .env never committed"

echo "4. Searching for hardcoded secrets..."
grep -r "sk_test_" app/ components/ 2>/dev/null | grep -v "process.env" && echo "❌ Hardcoded secrets found" || echo "✅ No hardcoded secrets"

echo "5. Checking build output..."
npm run build > /dev/null 2>&1 && grep -r "sk_" .next/static/ 2>/dev/null && echo "❌ Secrets in build" || echo "✅ Build is clean"

echo "=== AUDIT COMPLETE ==="
```

---

**🎯 Goal:** All checks should show ✅

If any show ❌, fix immediately before deploying!

---

**Last Updated:** 2026-02-06
**Review Schedule:** Monthly or after any security incident
