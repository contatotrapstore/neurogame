// Script para atualizar senhas dos usuários com hash bcrypt correto
const bcrypt = require('bcrypt');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ SUPABASE_URL e SUPABASE_SERVICE_KEY são necessários no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function updatePasswords() {
  try {
    console.log('🔐 Gerando hashes bcrypt para as senhas...\n');

    // Gerar hashes
    const adminHash = await bcrypt.hash('Admin@123456', 10);
    const demoHash = await bcrypt.hash('Demo@123456', 10);

    console.log('Admin hash:', adminHash);
    console.log('Demo hash:', demoHash);
    console.log('');

    // Atualizar usuário admin
    const { error: adminError } = await supabase
      .from('users')
      .update({ password: adminHash })
      .eq('username', 'admin');

    if (adminError) {
      console.error('❌ Erro ao atualizar senha do admin:', adminError);
    } else {
      console.log('✅ Senha do admin atualizada com sucesso!');
    }

    // Atualizar usuário demo
    const { error: demoError } = await supabase
      .from('users')
      .update({ password: demoHash })
      .eq('username', 'demo');

    if (demoError) {
      console.error('❌ Erro ao atualizar senha do demo:', demoError);
    } else {
      console.log('✅ Senha do demo atualizada com sucesso!');
    }

    console.log('\n✅ Atualização de senhas concluída!');
    console.log('\nCredenciais de acesso:');
    console.log('  Admin: admin / Admin@123456');
    console.log('  Demo:  demo / Demo@123456');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

updatePasswords();
