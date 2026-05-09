// ============================================
// SmartCheckout — Auth System
// ============================================
console.log('%c CONVIX VERSION 3.0 LOADED ', 'background: #ef4d23; color: #fff; font-weight: bold;');
const DEMO_USER = { name:'Demo User', email:'user@store.com', password:'password', phone:'9876543210', joined:'April 2025' };

function getSession(){ try{ return JSON.parse(localStorage.getItem('ssc_session')); }catch(e){ return null; } }
function getUsers(){ try{ return JSON.parse(localStorage.getItem('ssc_users')) || [DEMO_USER]; }catch(e){ return [DEMO_USER]; } }
function saveUsers(u){ localStorage.setItem('ssc_users', JSON.stringify(u)); }
function setSession(user){ localStorage.setItem('ssc_session', JSON.stringify({ user, ts: Date.now() })); }
function clearSession(){ localStorage.removeItem('ssc_session'); }

// GLOBAL ACTIVITY TRACKER
function logActivity(type, msg) {
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

    // Backend sync can be added here in the future via /api/scans
  } catch (e) { }
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

async function signIn(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.message || 'Login failed');

    setSession(result.user);
    localStorage.setItem('ssc_token', result.token); // Store JWT
    logActivity('LOGIN', `User ${result.user.email} signed in via Backend`);
    return result.user;
  } catch (err) {
    console.error('CONVIX: Auth Failure:', err);
    // Fallback to local for dev if needed, but primarily use API now
    throw err;
  }
}

async function signUp(name, email, password, phone) {
  // 1. VALIDATIONS
  if (!name || name.length < 2) throw new Error('Please enter a valid full name');
  if (!isValidEmail(email)) throw new Error('Please enter a valid email address');
  if (!isValidPhone(phone)) throw new Error('Please enter a 10-digit phone number');
  if (!isStrongPassword(password)) throw new Error('Password must be at least 6 characters long');

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.message || 'Registration failed');

    setSession(result.user);
    localStorage.setItem('ssc_token', result.token); // Store JWT
    logActivity('SIGNUP', `New user registered via Backend: ${email}`);
    return result.user;
  } catch (err) {
    console.error('CONVIX: Signup Failure:', err);
    throw new Error(err.message || 'Network Error: Could not connect to server.');
  }
}


function signOut(){
  clearSession();
  window.location.href = 'login.html';
}
