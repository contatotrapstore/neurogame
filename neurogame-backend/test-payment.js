/**
 * Script de teste para validar pagamentos
 *
 * Uso:
 * node test-payment.js pix
 * node test-payment.js card
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'https://neurogame-7av9.onrender.com/api/v1';

// Dados de teste
const testUser = {
  email: 'teste@neurogame.com',
  password: 'Teste123!',
  name: 'Usuario Teste'
};

// Cartão de teste Asaas (Sandbox)
const testCard = {
  holderName: 'TESTE DA SILVA',
  number: '5162306219378829',
  expiryMonth: '12',
  expiryYear: '2028',
  ccv: '318'
};

async function registerUser() {
  try {
    console.log('📝 Registrando usuário de teste...');
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('✅ Usuário registrado:', response.data.data.user.email);
    return response.data.data.token;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('já existe')) {
      console.log('ℹ️  Usuário já existe, fazendo login...');
      return loginUser();
    }
    throw error;
  }
}

async function loginUser() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login realizado com sucesso');
    return response.data.data.token;
  } catch (error) {
    console.error('❌ Erro no login:', error.response?.data || error.message);
    throw error;
  }
}

async function testPixPayment(token) {
  try {
    console.log('\n💰 Testando pagamento PIX...');
    const response = await axios.post(
      `${API_URL}/payments/create`,
      { paymentMethod: 'PIX' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { payment, pixQrCode, pixCopyPaste } = response.data.data;

    console.log('✅ Pagamento PIX criado com sucesso!');
    console.log('📄 Payment ID:', payment.id);
    console.log('📊 Status:', payment.status);
    console.log('💵 Valor:', payment.value);
    console.log('📅 Vencimento:', payment.dueDate);

    if (pixQrCode) {
      console.log('✅ QR Code gerado');
    }
    if (pixCopyPaste) {
      console.log('✅ Código Copia e Cola gerado');
      console.log('📋 Código (primeiros 50 chars):', pixCopyPaste.substring(0, 50) + '...');
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao criar pagamento PIX:');
    console.error('Status:', error.response?.status);
    console.error('Mensagem:', error.response?.data?.message || error.message);
    if (error.response?.data?.errors) {
      console.error('Erros:', error.response.data.errors);
    }
    return false;
  }
}

async function testCardPayment(token) {
  try {
    console.log('\n💳 Testando pagamento com Cartão...');
    const response = await axios.post(
      `${API_URL}/payments/create`,
      {
        paymentMethod: 'CREDIT_CARD',
        creditCard: testCard,
        creditCardHolderInfo: {
          name: testCard.holderName
        }
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { payment, message } = response.data.data;

    console.log('✅ Pagamento com Cartão criado com sucesso!');
    console.log('📄 Payment ID:', payment.id);
    console.log('📊 Status:', payment.status);
    console.log('💵 Valor:', payment.value);
    console.log('📅 Vencimento:', payment.dueDate);

    if (message) {
      console.log('📝 Mensagem:', message);
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao criar pagamento com Cartão:');
    console.error('Status:', error.response?.status);
    console.error('Mensagem:', error.response?.data?.message || error.message);
    if (error.response?.data?.errors) {
      console.error('Erros:', error.response.data.errors);
    }
    return false;
  }
}

async function checkSubscriptionStatus(token) {
  try {
    console.log('\n🔍 Verificando status da assinatura...');
    const response = await axios.get(
      `${API_URL}/payments/status`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { subscription, hasActivePayment } = response.data.data;

    console.log('✅ Status consultado com sucesso!');
    console.log('📊 Tem pagamento ativo?', hasActivePayment ? 'Sim' : 'Não');

    if (subscription) {
      console.log('📅 Expira em:', subscription.expiresAt);
      console.log('⏰ Dias até expiração:', subscription.daysUntilExpiry);
      console.log('⚠️  Precisa renovar?', subscription.needsRenewal ? 'Sim' : 'Não');
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar status:');
    console.error('Mensagem:', error.response?.data?.message || error.message);
    return false;
  }
}

async function main() {
  const testType = process.argv[2] || 'pix';

  console.log('🎮 NeuroGame - Teste de Pagamentos');
  console.log('====================================\n');
  console.log('🌐 API URL:', API_URL);
  console.log('🧪 Tipo de teste:', testType.toUpperCase());
  console.log('');

  try {
    // 1. Registrar/Login
    const token = await registerUser();

    // 2. Testar pagamento
    let success = false;
    if (testType === 'pix') {
      success = await testPixPayment(token);
    } else if (testType === 'card') {
      success = await testCardPayment(token);
    } else {
      console.error('❌ Tipo de teste inválido. Use: pix ou card');
      process.exit(1);
    }

    if (!success) {
      console.error('\n❌ Teste de pagamento falhou!');
      process.exit(1);
    }

    // 3. Verificar status
    await checkSubscriptionStatus(token);

    console.log('\n✅ Todos os testes concluídos com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro no teste:', error.message);
    process.exit(1);
  }
}

main();
