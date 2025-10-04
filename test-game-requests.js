const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testGameRequests() {
  console.log('🧪 Testando Sistema de Solicitações de Jogos\n');

  try {
    // 1. Registrar usuário teste
    console.log('1️⃣ Registrando usuário teste...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      email: 'teste@neurogame.com',
      password: 'Teste@123',
      full_name: 'Usuário Teste'
    });

    console.log('✅ Usuário registrado:', registerResponse.data.data.user.email);
    const userToken = registerResponse.data.data.token;
    console.log('✅ Token obtido\n');

    // 2. Criar solicitação de jogo
    console.log('2️⃣ Criando solicitação de jogo...');
    const requestResponse = await axios.post(
      `${API_URL}/game-requests`,
      {
        game_name: 'The Witcher 4',
        description: 'Gostaria muito de jogar o próximo jogo da série The Witcher!',
        priority: 'high'
      },
      {
        headers: { Authorization: `Bearer ${userToken}` }
      }
    );

    console.log('✅ Solicitação criada:', requestResponse.data.data);
    const requestId = requestResponse.data.data.id;
    console.log('\n');

    // 3. Listar solicitações do usuário
    console.log('3️⃣ Listando solicitações do usuário...');
    const userRequestsResponse = await axios.get(
      `${API_URL}/game-requests`,
      {
        headers: { Authorization: `Bearer ${userToken}` }
      }
    );

    console.log('✅ Total de solicitações:', userRequestsResponse.data.data.total);
    console.log('Solicitações:', userRequestsResponse.data.data.requests.map(r => ({
      id: r.id,
      game_name: r.game_name,
      status: r.status
    })));
    console.log('\n');

    // 4. Login como admin
    console.log('4️⃣ Fazendo login como admin...');
    const adminLoginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@neurogame.com',
      password: 'Admin@123456'
    });

    const adminToken = adminLoginResponse.data.data.token;
    console.log('✅ Admin logado\n');

    // 5. Contar solicitações pendentes (admin)
    console.log('5️⃣ Contando solicitações pendentes (admin)...');
    const countResponse = await axios.get(
      `${API_URL}/game-requests/pending/count`,
      {
        headers: { Authorization: `Bearer ${adminToken}` }
      }
    );

    console.log('✅ Total de pendentes:', countResponse.data.data.count);
    console.log('\n');

    // 6. Aprovar solicitação (admin)
    console.log('6️⃣ Aprovando solicitação (admin)...');
    const approveResponse = await axios.patch(
      `${API_URL}/game-requests/${requestId}`,
      {
        status: 'approved',
        admin_comment: 'Ótima sugestão! Vamos adicionar este jogo em breve.'
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` }
      }
    );

    console.log('✅ Solicitação aprovada:', approveResponse.data.data);
    console.log('\n');

    // 7. Verificar status atualizado
    console.log('7️⃣ Verificando status atualizado...');
    const updatedRequestsResponse = await axios.get(
      `${API_URL}/game-requests`,
      {
        headers: { Authorization: `Bearer ${userToken}` }
      }
    );

    const updatedRequest = updatedRequestsResponse.data.data.requests[0];
    console.log('✅ Status da solicitação:', updatedRequest.status);
    console.log('✅ Comentário do admin:', updatedRequest.admin_comment);
    console.log('\n');

    console.log('🎉 Todos os testes passaram com sucesso!');

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);

    // Se foi erro de email já cadastrado, tenta logar
    if (error.response?.data?.message?.includes('já está cadastrado')) {
      console.log('\n⚠️ Usuário já existe, tentando login...');
      try {
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
          email: 'teste@neurogame.com',
          password: 'Teste@123'
        });
        console.log('✅ Login realizado com sucesso');
        console.log('Token:', loginResponse.data.data.token);
      } catch (loginError) {
        console.error('❌ Erro no login:', loginError.response?.data || loginError.message);
      }
    }
  }
}

// Executar testes
testGameRequests();
