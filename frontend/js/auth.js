// ============================================
// SmartCheckout — Auth System
// ============================================
const DEMO_USER = { name:'Demo User', email:'user@store.com', password:'password', phone:'9876543210', joined:'April 2025' };

function getSession(){ try{ return JSON.parse(localStorage.getItem('ssc_session')); }catch(e){ return null; } }
function getUsers(){ try{ return JSON.parse(localStorage.getItem('ssc_users')) || [DEMO_USER]; }catch(e){ return [DEMO_USER]; } }
function saveUsers(u){ localStorage.setItem('ssc_users', JSON.stringify(u)); }
function setSession(user){ localStorage.setItem('ssc_session', JSON.stringify({ user, ts: Date.now() })); }
function clearSession(){ localStorage.removeItem('ssc_session'); }

// GLOBAL ACTIVITY TRACKER
function logActivity(type, msg){
  try {
    const session = getSession();
    const email = session ? session.user.email : 'Guest';
    const log = JSON.parse(localStorage.getItem('ssc_global_activity') || '[]');
    log.unshift({
      ts: new Date().toISOString(),
      user: email,
      type: type,
      msg: msg
    });
    localStorage.setItem('ssc_global_activity', JSON.stringify(log.slice(0, 1000)));

    // SYNC TO SUPABASE
    if (typeof isSupabaseReady !== 'undefined' && isSupabaseReady()) {
      window.supabase.from('activity_log').insert([{
        type,
        msg,
        user_email: email
      }]).then(({ error }) => {
        if (error) console.error('CONVIX: Activity Sync Error:', error.message);
      });
    }
  } catch(e){}
}

// HELPERS FOR MULTI-USER DATA ISOLATION
function ukey(key){
  const session = getSession();
  const userId = session ? session.user.email.replace(/[^a-zA-Z0-9]/g, '_') : 'guest';
  return `ssc_${userId}_${key}`;
}

async function authGuard(){
  if(!getSession()){ window.location.href='login.html'; return false; }
  return true;
}

// VALIDATION HELPERS
function isValidEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function isValidPhone(p){ return /^[0-9]{10}$/.test(p); }
function isStrongPassword(p){ return p.length >= 6; }

async function signIn(email, password){
  if (isSupabaseReady()) {
    try {
      const { data, error } = await window.supabase.from('users').select('*').eq('email', email).eq('password', password).single();
      if (error) {
        console.error('CONVIX: Supabase SignIn Error:', error);
        throw new Error('Invalid email or password (DB)');
      }
      if (!data) throw new Error('Invalid email or password');
      setSession(data);
      logActivity('LOGIN', `User ${data.email} signed in via Cloud`);
      return data;
    } catch(err) {
      console.error('CONVIX: Auth Fetch Failure:', err);
      throw err;
    }
  }

  // Fallback to local
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if(!user) throw new Error('Invalid credentials');
  setSession(user);
  logActivity('LOGIN', `User ${user.email} signed in`);
  return user;
}

async function signUp(name, email, password, phone){
  // 1. VALIDATIONS
  if(!name || name.length < 2) throw new Error('Please enter a valid full name');
  if(!isValidEmail(email)) throw new Error('Please enter a valid email address');
  if(!isValidPhone(phone)) throw new Error('Please enter a 10-digit phone number');
  if(!isStrongPassword(password)) throw new Error('Password must be at least 6 characters long');

  const userData = { 
    name, 
    email, 
    password, 
    phone, 
    joined: new Date().toLocaleDateString('en-IN',{month:'long',year:'numeric'}) 
  };

  if (isSupabaseReady()) {
    try {
      console.log('CONVIX: Attempting Cloud Signup for', email);
      const { error } = await window.supabase.from('users').insert([userData]);
      if (error) {
        console.error('CONVIX: Supabase Signup Error Details:', error);
        if (error.message.includes('unique')) throw new Error('Email already registered');
        throw new Error('Cloud registration failed: ' + error.message);
      }
      setSession(userData);
      logActivity('SIGNUP', `New user registered via Cloud: ${email}`);
      return userData;
    } catch(err) {
      console.error('CONVIX: Signup Fetch Failure:', err);
      throw new Error('Network Error: Could not reach Database. Please check connection.');
    }
  }

  // Fallback to local
  const users = getUsers();
  if(users.find(u => u.email === email)) throw new Error('Email already registered');
  users.push(userData);
  saveUsers(users);
  setSession(userData);
  logActivity('SIGNUP', `New user registered: ${email}`);
  return userData;
}

function signOut(){
  clearSession();
  window.location.href = 'login.html';
}
