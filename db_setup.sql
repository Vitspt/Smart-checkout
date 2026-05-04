-- 0. Ensure Users table has wallet_balance (Run this first)
ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_balance NUMERIC DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;

-- 1. Create ORDERS table if not exists
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    items JSONB NOT NULL,
    total NUMERIC NOT NULL,
    method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'paid', -- 'paid', 'cancelled', 'exited'
    exited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for orders
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 2. Create COUPONS table if not exists
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL DEFAULT 'percent', -- 'percent', 'flat'
    value NUMERIC NOT NULL,
    min_order NUMERIC DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for coupons
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- 3. Seed some coupons
INSERT INTO coupons (code, type, value, min_order) 
VALUES 
('WELCOME20', 'percent', 20, 500),
('SAVE10', 'percent', 10, 200),
('FLAT50', 'flat', 50, 400),
('CONVIX5', 'percent', 5, 0)
ON CONFLICT (code) DO NOTHING;

-- 4. Create ACTIVITY_LOG if missing (referenced in controllers)
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT NOT NULL,
    type TEXT NOT NULL,
    msg TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create SECURITY_VERIFICATIONS (as seen in separate file)
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
-- 6. Disable Row Level Security (RLS)
-- Since the Backend API handles security and filtering by user_id/email, 
-- we disable RLS to allow the Backend's Service/Anon key to manage data.

ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE security_verifications DISABLE ROW LEVEL SECURITY;
