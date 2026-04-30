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
    const log = JSON.parse(localStorage.getItem('ssc_global_activity') || '[]');
    log.unshift({
      ts: new Date().toISOString(),
      user: session ? session.user.email : 'Guest',
      type: type,
      msg: msg
    });
    localStorage.setItem('ssc_global_activity', JSON.stringify(log.slice(0, 1000)));
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

async function signIn(email, password){
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if(!user) throw new Error('Invalid credentials');
  setSession(user);
  logActivity('LOGIN', `User ${user.email} signed in`);
  return user;
}

async function signUp(name, email, password, phone){
  const users = getUsers();
  if(users.find(u => u.email === email)) throw new Error('Email already registered');
  const user = { name, email, password, phone, joined: new Date().toLocaleDateString('en-IN',{month:'long',year:'numeric'}) };
  users.push(user);
  saveUsers(users);
  setSession(user);
  logActivity('SIGNUP', `New user registered: ${email}`);
  return user;
}

function signOut(){
  clearSession();
  window.location.href = 'login.html';
}
