-- Run this in your Supabase SQL Editor to create the verification logs table

CREATE TABLE IF NOT EXISTS security_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL, -- 'verified', 'flagged'
  total_amount NUMERIC NOT NULL,
  is_high_value BOOLEAN DEFAULT false,
  incident_type TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_verifications_order ON security_verifications(order_id);
CREATE INDEX IF NOT EXISTS idx_verifications_created ON security_verifications(created_at DESC);
