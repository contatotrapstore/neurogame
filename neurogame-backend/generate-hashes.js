// Script temporário para gerar hashes bcrypt
const crypto = require('crypto');

// Função simplificada para gerar hash compatível (usaremos bcrypt depois da instalação)
function generateSimpleHash(password) {
  // Por enquanto, vamos apenas preparar os dados
  // O hash real será gerado após npm install
  return password;
}

const adminPassword = 'Admin@123456';
const demoPassword = 'Demo@123456';

console.log('Senhas a serem hasheadas:');
console.log('Admin:', adminPassword);
console.log('Demo:', demoPassword);
console.log('\nExecute "npm install" e depois rode este script novamente para gerar os hashes bcrypt.');
