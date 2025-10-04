/**
 * Serviço de Integração com Asaas
 * Documentação: https://docs.asaas.com
 */

const axios = require('axios');

const ASAAS_API_URL = process.env.ASAAS_ENVIRONMENT === 'production'
  ? 'https://api.asaas.com/v3'
  : 'https://sandbox.asaas.com/api/v3';

const asaasClient = axios.create({
  baseURL: ASAAS_API_URL,
  headers: {
    'access_token': process.env.ASAAS_API_KEY,
    'Content-Type': 'application/json'
  }
});

/**
 * Criar cliente no Asaas
 */
const createCustomer = async (userData) => {
  try {
    const response = await asaasClient.post('/customers', {
      name: userData.full_name,
      email: userData.email,
      cpfCnpj: userData.cpf || undefined, // Opcional
      phone: userData.phone || undefined, // Opcional
      externalReference: userData.id // ID do nosso sistema
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao criar customer no Asaas:', error.response?.data || error.message);
    throw new Error(error.response?.data?.errors?.[0]?.description || 'Falha ao criar cliente no Asaas');
  }
};

/**
 * Criar cobrança única (pagamento mensal não recorrente)
 */
const createPayment = async (customerId, paymentData) => {
  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1); // Vencimento para amanhã

    const response = await asaasClient.post('/payments', {
      customer: customerId,
      billingType: paymentData.paymentMethod || 'PIX',
      value: parseFloat(paymentData.value || process.env.SUBSCRIPTION_VALUE || 149.90),
      dueDate: dueDate.toISOString().split('T')[0],
      description: paymentData.description || 'NeuroGame - Mensalidade',

      // Dados do cartão (se for CREDIT_CARD)
      creditCard: paymentData.creditCard || undefined,
      creditCardHolderInfo: paymentData.creditCardHolder || undefined,

      // Configurações adicionais
      externalReference: paymentData.userId, // ID do usuário
      postalService: false
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao criar payment no Asaas:', error.response?.data || error.message);
    throw new Error(error.response?.data?.errors?.[0]?.description || 'Falha ao criar cobrança');
  }
};

/**
 * Criar assinatura mensal (DEPRECATED - usar createPayment)
 */
const createSubscription = async (customerId, subscriptionData) => {
  try {
    const response = await asaasClient.post('/subscriptions', {
      customer: customerId,
      billingType: subscriptionData.paymentMethod || 'CREDIT_CARD',
      value: parseFloat(subscriptionData.value || process.env.SUBSCRIPTION_VALUE || 149.90),
      nextDueDate: subscriptionData.nextDueDate || getNextDueDate(),
      cycle: 'MONTHLY',
      description: subscriptionData.description || 'NeuroGame - Assinatura Mensal',

      // Dados do cartão (se for CREDIT_CARD)
      creditCard: subscriptionData.creditCard || undefined,
      creditCardHolderInfo: subscriptionData.creditCardHolder || undefined,

      // Configurações adicionais
      updatePaymentValue: false,
      externalReference: subscriptionData.userId // ID do usuário
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao criar subscription no Asaas:', error.response?.data || error.message);
    throw new Error(error.response?.data?.errors?.[0]?.description || 'Falha ao criar assinatura');
  }
};

/**
 * Consultar assinatura
 */
const getSubscription = async (subscriptionId) => {
  try {
    const response = await asaasClient.get(`/subscriptions/${subscriptionId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao consultar subscription:', error.response?.data || error.message);
    throw new Error('Falha ao consultar assinatura');
  }
};

/**
 * Cancelar assinatura
 */
const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await asaasClient.delete(`/subscriptions/${subscriptionId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao cancelar subscription:', error.response?.data || error.message);
    throw new Error('Falha ao cancelar assinatura');
  }
};

/**
 * Listar pagamentos de uma assinatura
 */
const listPayments = async (subscriptionId, options = {}) => {
  try {
    const response = await asaasClient.get('/payments', {
      params: {
        subscription: subscriptionId,
        limit: options.limit || 100,
        offset: options.offset || 0
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao listar payments:', error.response?.data || error.message);
    throw new Error('Falha ao listar pagamentos');
  }
};

/**
 * Consultar pagamento específico
 */
const getPayment = async (paymentId) => {
  try {
    const response = await asaasClient.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao consultar payment:', error.response?.data || error.message);
    throw new Error('Falha ao consultar pagamento');
  }
};

/**
 * Gerar link de pagamento PIX ou Boleto
 */
const getPaymentLink = async (paymentId) => {
  try {
    const response = await asaasClient.get(`/payments/${paymentId}/identificationField`);
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar link de pagamento:', error.response?.data || error.message);
    throw new Error('Falha ao gerar link de pagamento');
  }
};

/**
 * Obter QR Code do PIX
 */
const getPixQrCode = async (paymentId) => {
  try {
    const response = await asaasClient.get(`/payments/${paymentId}/pixQrCode`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter QR Code PIX:', error.response?.data || error.message);
    throw new Error('Falha ao obter QR Code PIX');
  }
};

/**
 * Validar webhook do Asaas
 */
const validateWebhook = (payload, signature) => {
  // TODO: Implementar validação de assinatura do webhook
  // Por enquanto, apenas retorna true
  return true;
};

/**
 * Processar evento de webhook
 */
const processWebhookEvent = async (event) => {
  const eventType = event.event;
  const payment = event.payment;

  console.log(`[Asaas Webhook] Processando evento: ${eventType}`);

  switch (eventType) {
    case 'PAYMENT_CREATED':
      console.log(`Pagamento criado: ${payment.id}`);
      break;

    case 'PAYMENT_CONFIRMED':
    case 'PAYMENT_RECEIVED':
      console.log(`Pagamento confirmado: ${payment.id}`);
      // Atualizar subscription no banco para 'active'
      break;

    case 'PAYMENT_OVERDUE':
      console.log(`Pagamento atrasado: ${payment.id}`);
      // Atualizar subscription para 'past_due'
      break;

    case 'PAYMENT_DELETED':
      console.log(`Pagamento deletado: ${payment.id}`);
      break;

    default:
      console.log(`Evento não tratado: ${eventType}`);
  }

  return { processed: true, eventType };
};

/**
 * Calcular próxima data de vencimento
 */
const getNextDueDate = () => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  return nextMonth.toISOString().split('T')[0]; // YYYY-MM-DD
};

/**
 * Mapear status do Asaas para nosso sistema
 */
const mapSubscriptionStatus = (asaasStatus) => {
  const statusMap = {
    'ACTIVE': 'active',
    'INACTIVE': 'cancelled',
    'EXPIRED': 'cancelled',
    'OVERDUE': 'past_due'
  };

  return statusMap[asaasStatus] || 'pending';
};

const mapPaymentStatus = (asaasStatus) => {
  const statusMap = {
    'PENDING': 'pending',
    'RECEIVED': 'received',
    'CONFIRMED': 'confirmed',
    'OVERDUE': 'overdue',
    'REFUNDED': 'refunded',
    'RECEIVED_IN_CASH': 'received',
    'REFUND_REQUESTED': 'refund_requested',
    'CHARGEBACK_REQUESTED': 'chargeback_requested',
    'CHARGEBACK_DISPUTE': 'chargeback_dispute',
    'AWAITING_CHARGEBACK_REVERSAL': 'awaiting_reversal',
    'DUNNING_REQUESTED': 'dunning_requested',
    'DUNNING_RECEIVED': 'dunning_received',
    'AWAITING_RISK_ANALYSIS': 'awaiting_analysis'
  };

  return statusMap[asaasStatus] || 'pending';
};

module.exports = {
  createCustomer,
  createPayment, // Nova função para pagamento único
  createSubscription,
  getSubscription,
  cancelSubscription,
  listPayments,
  getPayment,
  getPaymentLink,
  getPixQrCode,
  validateWebhook,
  processWebhookEvent,
  getNextDueDate,
  mapSubscriptionStatus,
  mapPaymentStatus
};
