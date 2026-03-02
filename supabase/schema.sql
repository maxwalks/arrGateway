-- arrgateway Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

create table public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  email        text not null,
  display_name text not null,
  is_admin     boolean not null default false,
  permissions  jsonb not null default '{
    "view_movies": true,
    "delete_movies": false,
    "view_series": true,
    "delete_series": false,
    "view_downloads": true,
    "view_storage": true
  }'::jsonb,
  created_at   timestamptz not null default now(),
  created_by   uuid references public.profiles(id)
);

-- Helper function to check admin without RLS recursion
create or replace function public.is_admin()
returns boolean as $$
  select is_admin from public.profiles where id = auth.uid()
$$ language sql security definer stable;

-- Enable RLS
alter table public.profiles enable row level security;

-- Users can read their own profile; admins can read all
create policy "select own or admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

-- Only admins can update profiles
create policy "admin update"
  on public.profiles for update
  using (public.is_admin());

-- Only admins can delete profiles
create policy "admin delete"
  on public.profiles for delete
  using (public.is_admin());

-- No INSERT policy — all inserts go through service role key in /api/admin/invite
