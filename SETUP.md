# 🚀 Quick Setup Guide

## Environment Configuration

To run this project, you need to set up your environment variables. Follow these steps:

### 1. Create `.env.local` file

In the root of your project, create a file named `.env.local`:

```bash
# Copy the example file
cp .env.example .env.local
```

### 2. Set up Supabase (Required)

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Once created, go to **Project Settings** → **API**
4. Copy the following values to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_PROJECT_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_long_anon_key_here
```

### 3. Set up Paystack (Required for payments)

1. Go to [https://paystack.com](https://paystack.com) and create an account
2. Get your API keys from **Settings** → **API Keys & Webhooks**
3. Add to your `.env.local`:

```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_PAYSTACK_CURRENCY=GHS
```

**Note:** Use test keys during development!

### 4. Set up Database Tables

Run the SQL scripts in the `docs/` folder in your Supabase SQL Editor:

1. **[docs/FITNESS-SCHEMA.sql](docs/FITNESS-SCHEMA.sql)** - Creates fitness_plans and fitness_memberships tables
2. **[docs/EVENT-BOOKINGS-SCHEMA.sql](docs/EVENT-BOOKINGS-SCHEMA.sql)** - Creates event_bookings and event_spaces tables

**To run the scripts:**
1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Create a new query
4. Copy and paste the SQL from each file
5. Click **Run** to execute

### 5. Configure Row Level Security (RLS)

The SQL scripts include RLS policies, but verify they're enabled:

1. Go to **Database** → **Tables** in Supabase
2. For each table (orders, order_items, fitness_memberships, event_bookings):
   - Click on the table
   - Enable RLS if not already enabled
   - Verify policies are created

### 6. Optional: Additional Configuration

```env
# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google Analytics (optional)
# NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## Verify Setup

After configuration, restart your development server:

```bash
npm run dev
```

Check the console for any error messages. You should see:
- ✅ No Supabase environment warnings
- ✅ No payment initialization errors
- ✅ Application loads without errors

## Troubleshooting

### "Failed to fetch" error from Supabase

**Solution:** 
- Verify your `.env.local` file exists and has correct values
- Check that `NEXT_PUBLIC_SUPABASE_PROJECT_URL` starts with `https://`
- Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the full anon key (starts with `eyJ...`)
- Restart the development server after adding environment variables

### "Currency not supported" error from Paystack

**Solution:**
- Ensure `NEXT_PUBLIC_PAYSTACK_CURRENCY` matches your Paystack account currency
- For testing, use `NGN` (Nigerian Naira) as it's always supported in test mode
- In production, use your actual business currency: `GHS`, `ZAR`, or `USD`

### Database insertion errors

**Solution:**
- Check that all SQL schema files have been run in Supabase
- Verify RLS policies are enabled
- Check Supabase logs for detailed error messages

### Payment verification fails

**Solution:**
- Ensure `PAYSTACK_SECRET_KEY` is set (NOT prefixed with `NEXT_PUBLIC_`)
- Verify the secret key matches your public key environment (test/live)
- Check that your Paystack account is verified

## Database Schema Overview

### Core Tables:
- **orders** - Restaurant food orders
- **order_items** - Individual items in orders
- **fitness_plans** - Gym membership plans
- **fitness_plan_features** - Features for each plan
- **fitness_memberships** - User gym memberships
- **event_spaces** - Available event venues
- **event_bookings** - Event space reservations

### Important Notes:
- All tables have RLS enabled for security
- User authentication is handled by Supabase Auth
- Payment references are stored for all paid transactions

## Next Steps

Once configured:
1. ✅ Test user registration/login
2. ✅ Test food ordering with payment
3. ✅ Test gym membership purchase
4. ✅ Test event space booking
5. ✅ Check dashboard displays correctly

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Paystack Docs: https://paystack.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Security Reminder:**
- Never commit `.env.local` to version control
- Use test keys during development
- Switch to live keys only in production
- Keep secret keys secure and never expose them in client-side code
