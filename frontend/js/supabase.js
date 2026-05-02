// ============================================
// SmartCheckout — Supabase Connection
// ============================================

// PASTE YOUR KEYS HERE FROM SUPABASE DASHBOARD
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

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
