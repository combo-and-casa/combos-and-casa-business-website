# 🔒 Security Guide - Environment Variables

## Overview

This guide explains how to properly handle sensitive information in your Next.js application to prevent security breaches.

---

## 🚨 Critical Rules

### ❌ NEVER Do This:
```env
# WRONG! Secret key exposed to browser
NEXT_PUBLIC_PAYSTACK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_DATABASE_PASSWORD=mypassword
NEXT_PUBLIC_API_SECRET=secret123
```

### ✅ Always Do This:
```env
# CORRECT! Secret key server-side only
PAYSTACK_SECRET_KEY=sk_test_xxxxx
DATABASE_PASSWORD=mypassword
API_SECRET=secret123

# Public keys are safe with NEXT_PUBLIC_
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 🔑 Understanding `NEXT_PUBLIC_` Prefix

### What Does `NEXT_PUBLIC_` Mean?

When you prefix an environment variable with `NEXT_PUBLIC_`, Next.js **embeds the value directly into the browser JavaScript bundle**. Anyone can see it by:
- Viewing page source
- Opening browser DevTools
- Inspecting the bundled JavaScript files

### When to Use `NEXT_PUBLIC_`:

✅ **Safe to expose publicly:**
- Website URLs
- Public API endpoints
- Public API keys (explicitly marked as "public")
- Supabase anon keys (protected by RLS)
- Analytics IDs (Google Analytics, etc.)
- Feature flags
- Site configuration values

### When NOT to Use `NEXT_PUBLIC_`:

❌ **Must remain secret:**
- Secret API keys
- Database credentials
- Private API tokens
- Service account keys
- JWT secrets
- Encryption keys
- Admin passwords
- OAuth client secrets

---

## 📝 Environment Variable Naming Convention

### Client-Side (Browser-Accessible)
```env
# Naming: NEXT_PUBLIC_[SERVICE]_[TYPE]
NEXT_PUBLIC_SUPABASE_PROJECT_URL=https://xxx.supabase.co
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXX
NEXT_PUBLIC_SITE_URL=https://combosandcasagh.com
```

### Server-Side Only
```env
# Naming: [SERVICE]_[TYPE] (no NEXT_PUBLIC_ prefix)
PAYSTACK_SECRET_KEY=sk_test_xxxxx
DATABASE_URL=postgresql://user:pass@host/db
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
API_SECRET_KEY=secret123
SMTP_PASSWORD=smtp_pass_here
```

---

## 💻 How to Use Environment Variables

### 1. Client Components (`'use client'`)

**Can only access `NEXT_PUBLIC_` variables:**

```typescript
'use client'

export default function PaymentButton() {
  // ✅ CORRECT - Public key
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
  
  // ❌ WRONG - Will be undefined (server-only variable)
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  
  return <button>Pay Now</button>
}
```

### 2. Server Components (Default in App Router)

**Can access ALL environment variables:**

```typescript
// No 'use client' directive = Server Component

export default function OrderConfirmation() {
  // ✅ CORRECT - Can access secret key server-side
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  
  // ✅ Also can access public variables
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
  
  return <div>Order confirmed!</div>
}
```

### 3. API Routes (`app/api/**/route.ts`)

**Can access ALL environment variables:**

```typescript
// app/api/payment/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // ✅ CORRECT - Secret key safe in API route
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  
  // Verify payment with Paystack
  const response = await fetch('https://api.paystack.co/transaction/verify', {
    headers: {
      'Authorization': `Bearer ${secretKey}`
    }
  })
  
  return NextResponse.json({ verified: true })
}
```

### 4. Server Actions

**Can access ALL environment variables:**

```typescript
'use server'

export async function processPayment(amount: number) {
  // ✅ CORRECT - Secret key safe in server action
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  
  // Process payment logic
}
```

---

## 🛡️ Security Checklist

### Before Deployment:

- [ ] **Audit all `NEXT_PUBLIC_` variables** - Ensure no secrets are exposed
- [ ] **Check `.gitignore`** - Verify `.env*` is ignored
- [ ] **Review git history** - Run `git log --all --full-history -- .env`
- [ ] **Scan for hardcoded secrets** - Search codebase for API keys
- [ ] **Use different keys for dev/prod** - Never use production keys in development
- [ ] **Set up secret rotation** - Plan to rotate keys regularly

### In Your Codebase:

```bash
# Search for potentially exposed secrets
grep -r "NEXT_PUBLIC_.*SECRET" .
grep -r "NEXT_PUBLIC_.*PASSWORD" .
grep -r "NEXT_PUBLIC_.*API_KEY" .

# Check if .env was ever committed
git log --all --full-history -- .env
```

---

## 🔄 What to Do If You Exposed a Secret

### 1. **Immediately Rotate the Key**
- Go to your service provider (Paystack, Supabase, etc.)
- Generate a new secret key
- Revoke/delete the old key

### 2. **Update Your Environment Variables**
```bash
# Update .env with new key
PAYSTACK_SECRET_KEY=sk_test_NEW_KEY_HERE

# Update production environment (Vercel/Netlify/etc.)
```

### 3. **Remove from Git History (if committed)**

⚠️ **If you committed secrets to GitHub:**

```bash
# Remove sensitive file from all git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (⚠️ destructive operation!)
git push origin --force --all
```

**Better approach:** Use GitHub's secret scanning and follow their remediation guide.

### 4. **Monitor for Unauthorized Access**
- Check your service dashboards for unusual activity
- Review API usage logs
- Set up alerts for suspicious transactions

---

## 📦 Production Deployment

### Vercel
1. Go to Project Settings → Environment Variables
2. Add each variable individually
3. Select appropriate environments (Production, Preview, Development)
4. **Never** add secrets to Vercel's public Git repository

### Netlify
1. Go to Site Settings → Environment Variables
2. Add key-value pairs
3. Deploy site with new environment variables

### Other Platforms
- AWS: Use AWS Secrets Manager or Parameter Store
- Digital Ocean: Use App Platform environment variables
- Railway: Use Railway's environment variable system

---

## 🧪 Testing Secret Security

### Test 1: Check Browser Bundle
```bash
# Build your app
npm run build

# Search built files for secrets (should find nothing!)
grep -r "sk_test_" .next/
grep -r "your_secret" .next/
```

### Test 2: Inspect Network Tab
1. Open your site in browser
2. Open DevTools → Network tab
3. Check JavaScript files for exposed secrets
4. Search for `sk_`, `secret`, API keys

### Test 3: View Page Source
1. Right-click → View Page Source
2. Search (Ctrl+F) for secret key patterns
3. Nothing should appear

---

## 📚 Additional Resources

- [Next.js Environment Variables Docs](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

---

## 🆘 Quick Reference

| Variable Type | Prefix | Browser Access | Server Access | Use Case |
|--------------|--------|----------------|---------------|----------|
| Public Key | `NEXT_PUBLIC_` | ✅ Yes | ✅ Yes | Paystack public key |
| Site URL | `NEXT_PUBLIC_` | ✅ Yes | ✅ Yes | Website URL |
| Secret Key | None | ❌ No | ✅ Yes | Paystack secret key |
| Database URL | None | ❌ No | ✅ Yes | PostgreSQL connection |
| API Token | None | ❌ No | ✅ Yes | Third-party services |

---

**Remember:** When in doubt, **DON'T** use `NEXT_PUBLIC_`. It's safer to keep variables server-side only unless you specifically need them in the browser.

If you need help determining whether a variable should be public or private, ask yourself:

> "Would I be comfortable posting this value on social media?"

If the answer is no, don't use `NEXT_PUBLIC_`.
