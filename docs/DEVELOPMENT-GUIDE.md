# 👨‍💻 Development Guide

## Combos & Casa - Developer Setup & Contribution Guide

**For:** New developers joining the project  
**Last Updated:** February 2026

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Development Workflow](#development-workflow)
4. [Code Standards & Best Practices](#code-standards--best-practices)
5. [Common Tasks](#common-tasks)
6. [Testing Guide](#testing-guide)
7. [Troubleshooting](#troubleshooting)
8. [Tips & Tricks](#tips--tricks)

---

## 1. Prerequisites

### Required Software

#### Node.js & npm
```bash
# Check if installed
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher

# Install from https://nodejs.org/
# Recommended: Use nvm (Node Version Manager)
nvm install 20
nvm use 20
```

#### Git
```bash
# Check if installed
git --version

# Install from https://git-scm.com/
```

#### Code Editor
**Recommended: Visual Studio Code**
- Download: https://code.visualstudio.com/

**Essential VS Code Extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Path Intellisense
- Auto Rename Tag
- GitLens

**Install all extensions at once:**
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension christian-kohler.path-intellisense
code --install-extension formulahendry.auto-rename-tag
code --install-extension eamodio.gitlens
```

---

### Required Accounts

Before starting, create accounts on:

1. **[Supabase](https://supabase.com/)** - Database & Auth
   - Free tier available
   - No credit card required

2. **[Paystack](https://paystack.com/)** - Payments (Optional for development)
   - Test mode works without verification
   - Free for testing

3. **SMTP Email Provider** (Choose one)
   - Gmail (free, app password required)
   - [SendGrid](https://sendgrid.com/) (free tier: 100 emails/day)
   - [Mailgun](https://www.mailgun.com/) (free tier: 5,000 emails/month)
   - Or use your own domain's SMTP

---

## 2. Initial Setup

### Step 1: Clone the Repository

```bash
# Clone the repo
git clone https://github.com/yourusername/combos-and-casa-business-website.git

# Navigate to project
cd combos-and-casa-business-website

# Create your own branch
git checkout -b feature/your-feature-name
```

---

### Step 2: Install Dependencies

```bash
# Install all packages
npm install

# This installs:
# - Next.js 16.1.6
# - React 19
# - TypeScript 5
# - Tailwind CSS
# - Supabase
# - Paystack
# - Nodemailer
# - Handlebars
# - And many more...
```

**Expected output:**
```
added 450+ packages, and audited 475 packages in 30s
```

---

### Step 3: Set Up Supabase Database

#### 3.1 Create Supabase Project
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - Name: `combos-casa-dev` (or any name)
   - Database Password: Generate strong password
   - Region: Choose closest to you
4. Click "Create new project" (takes ~2 minutes)

#### 3.2 Get Supabase Credentials
1. Go to Project Settings → API
2. Copy:
   - Project URL: `https://xxxxx.supabase.co`
   - Anon/Public Key: `eyJhbGc...` (long string)

#### 3.3 Create Database Tables

Run these SQL commands in Supabase SQL Editor:

**Table 1: fitness_memberships**
```sql
CREATE TABLE fitness_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'active',
  payment_method TEXT NOT NULL,
  payment_reference TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_memberships_user ON fitness_memberships(user_id);
CREATE INDEX idx_memberships_status ON fitness_memberships(status);
```

**Table 2: event_bookings**
```sql
CREATE TABLE event_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  guest_count INTEGER NOT NULL,
  special_requests TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bookings_user ON event_bookings(user_id);
CREATE INDEX idx_bookings_date ON event_bookings(event_date);
```

**Table 3: restaurant_reservations**
```sql
CREATE TABLE restaurant_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guests INTEGER NOT NULL,
  special_requests TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reservations_user ON restaurant_reservations(user_id);
CREATE INDEX idx_reservations_date ON restaurant_reservations(reservation_date);
```

**More tables** (orders, menu_items, etc.) can be added as needed. See [PROJECT-HANDOVER.md](./PROJECT-HANDOVER.md) for complete schemas.

#### 3.4 Enable Row Level Security (Optional for development)
For production, enable RLS:
```sql
ALTER TABLE fitness_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_reservations ENABLE ROW LEVEL SECURITY;
```

Then create appropriate policies.

---

### Step 4: Set Up Paystack (Optional)

1. Go to [paystack.com](https://paystack.com)
2. Sign up for an account
3. Go to Settings → API Keys & Webhooks
4. Copy your **test** keys:
   - Public key: `pk_test_xxxxx`
   - Secret key: `sk_test_xxxxx`

**Note:** Test keys work without account verification.

---

### Step 5: Configure Environment Variables

#### 5.1 Create .env.local file

```bash
# In project root
touch .env.local

# Or on Windows
New-Item .env.local
```

#### 5.2 Add Configuration

Copy this template and fill in your actual values:

```env
# ====================================
# Site Configuration
# ====================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ====================================
# Supabase (REQUIRED)
# ====================================
# Get these from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_PROJECT_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ====================================
# Paystack (Optional - for testing payments)
# ====================================
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# ====================================
# SMTP Email (Optional - for testing emails)
# ====================================
# Option 1: Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Generate at: https://myaccount.google.com/apppasswords
SMTP_FROM=your-email@gmail.com
ADMIN_EMAIL=your-email@gmail.com

# Option 2: SendGrid
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_USER=apikey
# SMTP_PASS=your-sendgrid-api-key
# SMTP_FROM=noreply@yourdomain.com
# ADMIN_EMAIL=admin@yourdomain.com

# ====================================
# Contact Information (Optional)
# ====================================
NEXT_PUBLIC_CONTACT_EMAIL=contact@example.com
NEXT_PUBLIC_CONTACT_PHONE=+1-234-567-8900
```

**⚠️ Security Note:**
- Never commit `.env.local` to Git
- Never use `NEXT_PUBLIC_` prefix for secret keys
- Read [docs/SECURITY-GUIDE.md](./docs/SECURITY-GUIDE.md)

---

### Step 6: Start Development Server

```bash
# Start the dev server
npm run dev
```

**Expected output:**
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

Open http://localhost:3000 in your browser.

---

## 3. Development Workflow

### Daily Workflow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Create/switch to your feature branch
git checkout -b feature/your-feature-name

# 3. Start dev server
npm run dev

# 4. Make your changes...

# 5. Test your changes
npm run build  # Check for build errors

# 6. Commit your changes
git add .
git commit -m "feat: add new feature description"

# 7. Push to your branch
git push origin feature/your-feature-name

# 8. Create Pull Request on GitHub
```

---

### Git Branch Strategy

**Branch Types:**
- `main` - Production-ready code
- `develop` - Development branch (if using)
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

**Example:**
```bash
git checkout -b feature/add-loyalty-program
git checkout -b fix/cart-quantity-bug
git checkout -b hotfix/payment-error
```

---

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <description>

# Examples
feat(fitness): add loyalty points system
fix(cart): resolve quantity update bug
docs(readme): update installation steps
style(navbar): improve mobile responsiveness
refactor(email): extract template logic
test(checkout): add payment flow tests
chore(deps): update dependencies
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Formatting, missing semicolons, etc.
- `refactor` - Code change that neither fixes bug nor adds feature
- `test` - Adding tests
- `chore` - Maintenance tasks

---

## 4. Code Standards & Best Practices

### TypeScript Guidelines

#### Always Use Proper Types
```typescript
// ❌ Bad
const data: any = await fetch('...');

// ✅ Good
interface UserData {
  id: string;
  email: string;
  name: string;
}
const data: UserData = await fetch('...');
```

#### Use Type Inference When Obvious
```typescript
// ❌ Unnecessary
const count: number = 5;
const name: string = 'John';

// ✅ Good
const count = 5;
const name = 'John';
```

#### Define Interfaces for Props
```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  // ...
}
```

---

### React/Next.js Best Practices

#### Use Server Components by Default
```typescript
// ✅ Server Component (default)
export default function ProductList() {
  // Can directly query database
  return <div>...</div>;
}

// Only use 'use client' when needed
'use client'
export default function InteractiveForm() {
  const [state, setState] = useState();
  return <form>...</form>;
}
```

#### Client Components Only When Needed
Use `'use client'` directive when you need:
- `useState`, `useEffect`, other React hooks
- Event handlers (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- Third-party libraries that use hooks

#### Prefer Server Actions for Mutations
```typescript
// app/actions/orders.ts
'use server'

export async function createOrder(formData: FormData) {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('orders')
    .insert({ ... });
  
  revalidatePath('/dashboard');
  return { success: true, data };
}
```

---

### Component Structure

#### File Organization
```typescript
// UserProfile.tsx

// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface UserProfileProps {
  userId: string;
  onUpdate?: () => void;
}

// 3. Component
export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // 4. Hooks
  const [loading, setLoading] = useState(false);
  
  // 5. Functions
  const handleSubmit = async () => {
    // ...
  };
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// 7. Sub-components (if any)
function ProfileHeader() {
  return <header>...</header>;
}
```

---

### Styling Guidelines

#### Use Tailwind CSS Utilities
```typescript
// ✅ Good - Use Tailwind
<button className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90">
  Click Me
</button>

// ❌ Avoid inline styles
<button style={{ padding: '8px 16px', backgroundColor: '#D4AF37' }}>
  Click Me
</button>
```

#### Use Custom Utilities for Repeated Patterns
```typescript
// ✅ Good - Define in globals.css
// Then use: className="btn-primary"
.btn-primary {
  @apply px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors;
}
```

#### Use cn() Utility for Conditional Classes
```typescript
import { cn } from '@/lib/utils';

<button className={cn(
  'px-4 py-2 rounded-lg',
  isPrimary ? 'bg-gold text-white' : 'bg-gray-200 text-gray-800',
  disabled && 'opacity-50 cursor-not-allowed'
)}>
  Submit
</button>
```

---

### Error Handling

#### Always Handle Errors
```typescript
// ✅ Good
try {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData);
  
  if (error) {
    console.error('Order creation failed:', error);
    toast.error('Failed to create order. Please try again.');
    return;
  }
  
  toast.success('Order created successfully!');
} catch (err) {
  console.error('Unexpected error:', err);
  toast.error('An unexpected error occurred.');
}
```

#### Use Toast Notifications for User Feedback
```typescript
import { toast } from 'sonner';

// Success
toast.success('Order placed successfully!');

// Error
toast.error('Failed to process payment');

// Info
toast.info('Processing your request...');

// Warning
toast.warning('Session expiring soon');
```

---

### Database Queries (Supabase)

#### Use Type-Safe Queries
```typescript
// Define types
interface Order {
  id: string;
  customer_name: string;
  total_amount: number;
  status: string;
}

// Query with types
const { data, error } = await supabase
  .from('orders')
  .select('*')
  .eq('status', 'pending')
  .returns<Order[]>();
```

#### Handle Errors Properly
```typescript
const { data, error } = await supabase
  .from('orders')
  .insert(orderData);

if (error) {
  console.error('Database error:', error.message);
  return { success: false, error: error.message };
}

return { success: true, data };
```

---

## 5. Common Tasks

### Task 1: Add a New Page

```bash
# 1. Create page file
# app/new-page/page.tsx

# 2. Add content
export default function NewPage() {
  return (
    <div className="min-h-screen p-8">
      <h1>New Page</h1>
    </div>
  );
}

# 3. Add to navigation (components/Navbar.tsx)
<Link href="/new-page">New Page</Link>
```

---

### Task 2: Add a New Component

```bash
# 1. Create component file
# components/MyComponent.tsx

interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}

# 2. Use in page
import { MyComponent } from '@/components/MyComponent';

<MyComponent title="Hello" />
```

---

### Task 3: Add a New Database Table

```sql
-- 1. Run in Supabase SQL Editor
CREATE TABLE new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Add RLS (if needed)
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- 3. Create policy
CREATE POLICY "Users can view own records"
  ON new_table FOR SELECT
  USING (auth.uid() = user_id);
```

```typescript
// 4. Query in your code
const { data, error } = await supabase
  .from('new_table')
  .select('*');
```

---

### Task 4: Add a New API Route

```typescript
// app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

// For Nodemailer/SMTP - requires Node runtime
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Your logic here
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Usage: POST /api/my-endpoint
```

---

### Task 5: Customize Email Template

```bash
# 1. Find template in lib/email-templates/
# Example: customer-order.hbs

# 2. Edit HTML (all CSS must be inline!)
<div style="background: #fff; padding: 20px;">
  <h1 style="color: #D4AF37;">Order Confirmation</h1>
  <p>Hi {{customerName}},</p>
  <p>Your order #{{orderNumber}} is confirmed!</p>
</div>

# 3. Use Handlebars syntax for dynamic content
{{customerName}}  - Simple variable
{{#if condition}} - Conditional
{{#each items}} - Loop

# 4. Test by triggering the email action
```

---

### Task 6: Add Environment Variable

```bash
# 1. Add to .env.local
NEW_VARIABLE=value

# 2. For client-side access (browser)
NEXT_PUBLIC_NEW_VARIABLE=value

# 3. Access in code
const value = process.env.NEW_VARIABLE;  // Server-side only
const publicValue = process.env.NEXT_PUBLIC_NEW_VARIABLE;  // Client & server
```

---

## 6. Testing Guide

### Manual Testing Checklist

Before submitting a PR, test:

#### Build Test
```bash
npm run build
# Should complete without errors
```

#### Visual Test
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test on mobile (iPhone, Android)
- [ ] Test on tablet (iPad)
- [ ] Check responsive design (resize browser)
- [ ] Test dark mode (if applicable)

#### Functionality Test
- [ ] All links work
- [ ] Forms submit correctly
- [ ] Error messages display properly
- [ ] Success notifications appear
- [ ] Loading states work
- [ ] Data persists in database

#### Authentication Test
- [ ] Login works
- [ ] Logout works
- [ ] Protected routes redirect to login
- [ ] Session persists on refresh

#### Payment Test (Paystack)
Use test cards:
- Success: `5060666666666666666` (CVV: 123, PIN: 1234)
- Declined: `5060666666666666664`

#### Email Test
```bash
# Create test endpoint: app/api/test-email/route.ts
# Visit: http://localhost:3000/api/test-email
```

---

### Automated Testing (To Be Implemented)

```bash
# Unit tests (planned)
npm run test

# E2E tests (planned)
npm run test:e2e

# Coverage report
npm run test:coverage
```

---

## 7. Troubleshooting

### Common Issues & Solutions

#### Issue: "Module not found"
```bash
# Solution 1: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Solution 2: Clear Next.js cache
rm -rf .next
npm run dev
```

#### Issue: "Environment variable is undefined"
```bash
# Check:
# 1. Variable is in .env.local
# 2. Server was restarted after adding variable
# 3. Correct prefix (NEXT_PUBLIC_ for client-side)
# 4. No typos in variable name

# Restart server
# Stop with Ctrl+C
npm run dev
```

#### Issue: Supabase "Not authenticated"
```typescript
// Check:
// 1. User is logged in
const { data: { user } } = await supabase.auth.getUser();

// 2. RLS policies allow the operation
// 3. Correct Supabase credentials in .env.local
```

#### Issue: Paystack payment not working
```bash
# Check:
# 1. NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is set
# 2. Using test credit card for test mode
# 3. No browser console errors
# 4. Payment modal appears
```

#### Issue: Emails not sending
```bash
# Check:
# 1. All SMTP_* variables are set
# 2. SMTP_PASS is correct (use app password for Gmail)
# 3. Port 587 is not blocked by firewall
# 4. Check server logs for error messages

# Test with:
# Visit: /api/test-email
```

#### Issue: TypeScript errors
```bash
# Try:
# 1. Restart TypeScript server in VS Code
#    Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# 2. Delete type cache
rm -rf node_modules/.cache

# 3. Reinstall types
npm install --save-dev @types/node @types/react @types/react-dom
```

---

### Getting Help

**Resources:**
- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev
- Tailwind Docs: https://tailwindcss.com/docs
- Supabase Docs: https://supabase.com/docs
- TypeScript Docs: https://www.typescriptlang.org/docs

**Community:**
- Next.js Discord: https://nextjs.org/discord
- Supabase Discord: https://discord.supabase.com
- Stack Overflow: Tag `next.js` and `supabase`

**Project-Specific:**
- Read [PROJECT-HANDOVER.md](./PROJECT-HANDOVER.md)
- Check `/docs` folder for documentation
- Review existing code for examples

---

## 8. Tips & Tricks

### Performance Tips

#### Use Next.js Image Component
```typescript
import Image from 'next/image';

// ✅ Good - Optimized
<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority  // For above-the-fold images
/>

// ❌ Bad - Not optimized
<img src="/logo.png" alt="Logo" />
```

#### Lazy Load Components
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false,  // Disable SSR if not needed
});
```

---

### Developer Experience Tips

#### Use VS Code Snippets
Create `.vscode/snippets.json`:
```json
{
  "React Component": {
    "prefix": "rfc",
    "body": [
      "interface ${1:Component}Props {",
      "  $2",
      "}",
      "",
      "export function ${1:Component}({ $3 }: ${1:Component}Props) {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  );",
      "}"
    ]
  }
}
```

#### Hot Reload Tips
```bash
# If hot reload stops working:
# 1. Check for syntax errors
# 2. Restart dev server
# 3. Clear .next folder
```

---

### Debugging Tips

#### Use Console Logs Effectively
```typescript
// ✅ Good - Descriptive logs
console.log('User data:', user);
console.log('Order total:', total);

// ✅ Even better - Use labels
console.log('=== Order Submission ===');
console.log('Data:', orderData);
console.log('=======================');

// ❌ Bad - Unclear
console.log(user);
console.log('aaa');
```

#### Use React DevTools
Install browser extension:
- Chrome: https://chrome.google.com/webstore → "React Developer Tools"
- Firefox: https://addons.mozilla.org → "React Developer Tools"

#### Debug API Routes
```typescript
// Add detailed logging
export async function POST(request: NextRequest) {
  console.log('=== API Route Called ===');
  console.log('Method:', request.method);
  console.log('Headers:', request.headers);
  
  const body = await request.json();
  console.log('Body:', body);
  
  // Your logic...
  
  console.log('=== Response ===');
  return NextResponse.json({ ... });
}
```

---

### Git Tips

#### Useful Git Commands
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD

# View changes before committing
git diff

# Stash changes temporarily
git stash
git stash pop  # Restore stashed changes

# Update your branch with main
git checkout main
git pull
git checkout your-branch
git merge main
```

---

## Quick Reference

### Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code (if configured)

# Package Management
npm install <package>      # Install new package
npm uninstall <package>    # Remove package
npm update                 # Update all packages

# Git
git status                 # Check status
git add .                  # Stage all changes
git commit -m "message"    # Commit changes
git push                   # Push to remote
git pull                   # Pull from remote
```

---

### Keyboard Shortcuts (VS Code)

```
Cmd/Ctrl + P          - Quick file open
Cmd/Ctrl + Shift + P  - Command palette
Cmd/Ctrl + B          - Toggle sidebar
Cmd/Ctrl + J          - Toggle terminal
Cmd/Ctrl + `          - Toggle terminal
Cmd/Ctrl + /          - Toggle comment
Cmd/Ctrl + D          - Select next occurrence
Cmd/Ctrl + Shift + F  - Global search
F2                    - Rename symbol
```

---

## Checklist for New Developers

- [ ] Read this entire guide
- [ ] Read [PROJECT-HANDOVER.md](./PROJECT-HANDOVER.md)
- [ ] Set up development environment
- [ ] Clone repository
- [ ] Install dependencies
- [ ] Set up Supabase project
- [ ] Create `.env.local` file
- [ ] Run `npm run dev` successfully
- [ ] Test all pages in browser
- [ ] Read [docs/SECURITY-GUIDE.md](./docs/SECURITY-GUIDE.md)
- [ ] Join team communication channels
- [ ] Review existing codebase (spend 1-2 hours)
- [ ] Make a small test commit
- [ ] Ask questions if anything is unclear!

---

## Welcome to the Team! 🎉

You're all set to start developing! Remember:
- **Ask questions** - No question is too small
- **Read the docs** - Most answers are documented
- **Test thoroughly** - Before submitting PRs
- **Follow conventions** - Keep code consistent
- **Have fun!** - Enjoy building great features

---

**Happy Coding! 🚀**

---

<div align="center">

*Last Updated: February 2026*

</div>
