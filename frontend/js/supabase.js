// ============================================
// SmartCheckout — Supabase Connection
// ============================================

const SUPABASE_URL = 'https://lxqcefozawxvclclzuhaj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4cWNlZm96YXd4dmxjbHp1aGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2OTU2MTIsImV4cCI6MjA5MzI3MTYxMn0.AQByvnkZP3wb3Qzn2qELAcb9g5TT_k1dQFX4nRBGOug';

// Helper to check if Supabase is configured and ready
function isSupabaseReady() {
  return typeof supabase !== 'undefined' && 
         SUPABASE_URL && SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE' &&
         SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY_HERE';
}

// Initialize the Supabase client if keys are present
if (isSupabaseReady()) {
  const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.supabase = client;
  console.log('CONVIX: Supabase Connection Initialized');
} else {
  console.warn('CONVIX: Supabase Keys missing or using placeholders. Running in LocalStorage mode.');
}

// Helper to check if connection is active
async function checkDbConnection() {
  if (!isSupabaseReady()) return false;
  try {
    const { data, error } = await window.supabase.from('products').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('CONVIX: Database Connection Success');
    return true;
  } catch (err) {
    console.warn('CONVIX: Database Connection Failed.', err.message);
    return false;
  }
}
