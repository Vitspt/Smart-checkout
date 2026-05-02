// ============================================
// SmartCheckout — Supabase Connection
// ============================================

// PASTE YOUR KEYS HERE FROM SUPABASE DASHBOARD
const SUPABASE_URL = 'https://lxqcefozawxvclclzuhaj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_xnUCNkbwqzxF1A6DYYe8pw_NS5Fcxtt';

// Initialize the Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('CONVIX: Supabase Connection Initialized');

// Helper to check if connection is active
async function checkDbConnection() {
  try {
    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('CONVIX: Database Connection Success');
    return true;
  } catch (err) {
    console.warn('CONVIX: Database Connection Failed. Ensure your keys are correct and "products" table exists.', err.message);
    return false;
  }
}
