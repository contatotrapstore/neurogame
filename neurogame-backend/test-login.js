const { supabase } = require('./src/config/supabase');
const bcrypt = require('bcrypt');

(async () => {
  console.log('Testing login...\n');

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', 'admin')
    .single();

  console.log('Error:', error);
  console.log('User found:', !!user);

  if (user) {
    console.log('Username:', user.username);
    console.log('Email:', user.email);
    console.log('Is Active:', user.is_active);
    console.log('Is Admin:', user.is_admin);
    console.log('Password hash preview:', user.password.substring(0, 20));

    const match = await bcrypt.compare('Admin@123456', user.password);
    console.log('\nPassword match:', match);
  }
})();
