-- Event Bookings Table
create table event_bookings (
  id uuid primary key default gen_random_uuid(),

  -- optional user (guest bookings allowed)
  user_id uuid references auth.users on delete set null,

  -- customer details
  customer_name text not null,
  customer_email text,
  customer_phone text not null,

  -- event space
  event_space_id uuid references event_spaces(id),

  event_date date not null,
  start_time time not null,
  end_time time not null,

  guests integer,

  purpose text,
  special_requests text,

  -- payment details
  payment_reference text,
  payment_method text
    check (payment_method in ('cash', 'momo', 'card')),
  payment_status text default 'pending'
    check (payment_status in ('pending', 'paid', 'failed')),

  -- booking lifecycle
  status text default 'pending'
    check (status in ('pending', 'approved', 'paid', 'cancelled', 'completed')),

  created_at timestamp with time zone default now()
);

-- Event Spaces Table (if not exists)
create table if not exists event_spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  capacity text not null,
  description text,
  features jsonb,
  image text,
  price numeric(10, 2) not null,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table event_bookings enable row level security;
alter table event_spaces enable row level security;

-- Policies for event_bookings
create policy "Anyone can create bookings"
  on event_bookings for insert
  with check (true);

create policy "Users can view their own bookings"
  on event_bookings for select
  using (auth.uid() = user_id or user_id is null);

create policy "Admins can view all bookings"
  on event_bookings for select
  using (auth.jwt() ->> 'role' = 'admin');

-- Policies for event_spaces
create policy "Anyone can view active event spaces"
  on event_spaces for select
  using (is_active = true);

create policy "Admins can manage event spaces"
  on event_spaces for all
  using (auth.jwt() ->> 'role' = 'admin');
