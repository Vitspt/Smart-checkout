// backend/seed_admin.js
const { supabase } = require('./config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
  const password = 'manager123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const adminUser = {
    name: 'Smart Manager',
    email: 'manager@smart.com',
    password: hashedPassword,
    role: 'manager',
    joined: new Date().toISOString(),
    points: 9999
  };

  console.log('Seeding admin user...');
  const { data, error } = await supabase.from('users').upsert([adminUser], { onConflict: 'email' }).select();
  
  if (error) {
    console.error('Error seeding admin:', error);
  } else {
    console.log('Admin user seeded successfully:', data[0].email);
  }
}

seed();
