-- ── Mr Brush & Co — Supabase RLS Configuration ──────────────────────────────
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- https://supabase.com/dashboard/project/evbhucoaxcudjtlrhjfw/sql

-- ─── 1. Enable Row Level Security on quote_requests ───────────────────────────
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- ─── 2. Public INSERT policy ──────────────────────────────────────────────────
-- Anyone (anon key) can submit a quote request — this is the public form.
-- No SELECT, UPDATE, or DELETE is granted to anon users.
CREATE POLICY "public_insert_quote_requests"
  ON public.quote_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ─── 3. Authenticated admin SELECT policy ─────────────────────────────────────
-- Only authenticated users (e.g. admin login via Supabase Auth) can read rows.
-- Adjust the role check once you add admin auth.
CREATE POLICY "authenticated_select_quote_requests"
  ON public.quote_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- ─── 4. Block everything else ─────────────────────────────────────────────────
-- With RLS enabled and no other policies, UPDATE and DELETE are implicitly
-- denied for all roles. No additional policy needed.

-- ─── 5. Verify RLS is enabled ─────────────────────────────────────────────────
-- Run this to confirm — should return relrowsecurity = true
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'quote_requests';
