-- ============================================================================
-- FITNESS MODULE DATABASE SCHEMA
-- ============================================================================

-- ============================================================================
-- Table: fitness_plans
-- Description: Stores available gym membership plans
-- ============================================================================
CREATE TABLE IF NOT EXISTS fitness_plans (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  duration text NOT NULL,
  features jsonb,
  is_popular boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Insert default plans (matching the application constants)
INSERT INTO fitness_plans (id, name, price, duration, features, is_popular, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Basic', 29, 'month', 
 '["Access to all gym equipment", "1 personal training session", "Access to group classes"]'::jsonb, false, true),
('550e8400-e29b-41d4-a716-446655440002', 'Standard', 49, 'month',
 '["Access to all gym equipment", "4 personal training sessions", "Access to group classes", "1 guest pass per month"]'::jsonb, true, true),
('550e8400-e29b-41d4-a716-446655440003', 'Premium', 79, 'month',
 '["Unlimited access to all gym equipment", "8 personal training sessions", "Access to group classes", "5 guest passes per month", "Free merchandise pack"]'::jsonb, false, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Table: fitness_memberships
-- Description: Stores user gym memberships with payment details
-- ============================================================================
CREATE TABLE IF NOT EXISTS fitness_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  plan_id uuid REFERENCES fitness_plans(id),

  start_date date NOT NULL,
  end_date date NOT NULL,

  status text DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),

  -- Payment details
  payment_reference text,
  payment_method text
    CHECK (payment_method IN ('momo', 'card')),
  payment_status text DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed')),

  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS
ALTER TABLE fitness_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_memberships ENABLE ROW LEVEL SECURITY;

-- fitness_plans policies (public read access)
CREATE POLICY "Allow public read access to fitness plans" ON fitness_plans
FOR SELECT
TO public
USING (true);

-- fitness_memberships policies
CREATE POLICY "Allow authenticated users to insert memberships" ON fitness_memberships
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own memberships" ON fitness_memberships
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own memberships" ON fitness_memberships
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_fitness_memberships_user_id ON fitness_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_fitness_memberships_status ON fitness_memberships(status);
CREATE INDEX IF NOT EXISTS idx_fitness_memberships_payment_ref ON fitness_memberships(payment_reference);

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. User must be authenticated to purchase a membership
-- 2. Payment must be verified through Paystack before membership is activated
-- 3. Membership status is set to 'active' only after successful payment
-- 4. Plan IDs must match the IDs in utils/constents/index.ts
