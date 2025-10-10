const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const asaasService = require('../services/asaas');

const ALLOWED_PAYMENT_METHODS = ['PIX', 'CREDIT_CARD'];

const handleCreatePayment = async (req, res) => {
  try {
    const { creditCard, creditCardHolderInfo } = req.body;
    const paymentMethod = req.body.paymentMethod;
    const userId = req.user.id;

    console.log(`[Payment] Iniciando criacao de pagamento - Usuario: ${userId}, Metodo: ${paymentMethod}`);

    if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Metodo de pagamento invalido. Use PIX ou CREDIT_CARD'
      });
    }

    if (paymentMethod === 'CREDIT_CARD') {
      if (!creditCard) {
        return res.status(400).json({
          success: false,
          message: 'Dados do cartao sao obrigatorios'
        });
      }

      // Validar campos do cartão
      const requiredCardFields = ['holderName', 'number', 'expiryMonth', 'expiryYear', 'ccv'];
      const missingFields = requiredCardFields.filter(field => !creditCard[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Campos obrigatorios do cartao faltando: ${missingFields.join(', ')}`
        });
      }
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario nao encontrado'
      });
    }

    let asaasCustomerId = user.asaas_customer_id;

    if (!asaasCustomerId) {
      const asaasCustomer = await asaasService.createCustomer({
        id: user.id,
        email: user.email,
        full_name: user.full_name
      });

      asaasCustomerId = asaasCustomer.id;

      await supabase
        .from('users')
        .update({ asaas_customer_id: asaasCustomerId })
        .eq('id', userId);
    }

    const subscriptionValue = process.env.SUBSCRIPTION_VALUE
      ? parseFloat(process.env.SUBSCRIPTION_VALUE)
      : 149.90;

    const paymentData = {
      userId,
      paymentMethod,
      value: subscriptionValue,
      description: 'NeuroGame - Mensalidade Mensal'
    };

    if (paymentMethod === 'CREDIT_CARD') {
      // Adicionar email do usuário aos dados do titular se não fornecido
      const holderInfo = creditCardHolderInfo || {};
      if (!holderInfo.email) {
        holderInfo.email = user.email;
      }
      if (!holderInfo.name && user.full_name) {
        holderInfo.name = user.full_name;
      }

      paymentData.creditCard = creditCard;
      paymentData.creditCardHolderInfo = holderInfo;
    }

    console.log(`[Payment] Criando pagamento no Asaas - Customer: ${asaasCustomerId}`);

    const asaasPayment = await asaasService.createPayment(
      asaasCustomerId,
      paymentData
    );

    console.log(`[Payment] Pagamento criado no Asaas - ID: ${asaasPayment.id}, Status: ${asaasPayment.status}`);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    let subscription;

    if (existingSubscription) {
      const { data: updatedSub, error: updateError } = await supabase
        .from('subscriptions')
        .update({
          asaas_payment_id: asaasPayment.id,
          status: asaasPayment.status === 'CONFIRMED' ? 'active' : 'pending',
          plan_value: paymentData.value,
          payment_method: paymentMethod,
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubscription.id)
        .select()
        .single();

      if (updateError) throw updateError;
      subscription = updatedSub;
    } else {
      const { data: newSub, error: createError } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: userId,
          asaas_payment_id: asaasPayment.id,
          status: asaasPayment.status === 'CONFIRMED' ? 'active' : 'pending',
          plan_value: paymentData.value,
          billing_cycle: 'MONTHLY',
          payment_method: paymentMethod,
          expires_at: expiresAt.toISOString()
        }])
        .select()
        .single();

      if (createError) throw createError;
      subscription = newSub;
    }

    const response = {
      subscription,
      payment: {
        id: asaasPayment.id,
        status: asaasPayment.status,
        value: asaasPayment.value,
        dueDate: asaasPayment.dueDate
      }
    };

    if (paymentMethod === 'PIX') {
      try {
        console.log(`[Payment] Buscando QR Code PIX - Payment: ${asaasPayment.id}`);
        const pixData = await asaasService.getPixQrCode(asaasPayment.id);
        response.pixQrCode = pixData.encodedImage;
        response.pixCopyPaste = pixData.payload;
        console.log(`[Payment] QR Code PIX gerado com sucesso`);
      } catch (pixError) {
        console.error('[Payment] Erro ao buscar QR Code PIX:', pixError.message);
      }
    }

    if (paymentMethod === 'CREDIT_CARD' && asaasPayment.status === 'CONFIRMED') {
      response.message = 'Pagamento aprovado! Acesso liberado por 30 dias.';
    }

    return res.status(201).json({
      success: true,
      message: 'Pagamento criado com sucesso',
      data: response
    });
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);

    // Extrair mensagem de erro do Asaas se disponível
    let errorMessage = 'Erro ao criar pagamento';

    if (error.response?.data?.errors?.[0]?.description) {
      errorMessage = error.response.data.errors[0].description;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * POST /api/v1/payments/create
 * Criar novo pagamento mensal (PIX ou Cartao)
 */
router.post('/create', authenticate, handleCreatePayment);

/**
 * POST /api/v1/payments/renew
 * Renovar pagamento (criar novo pagamento para o proximo mes)
 */
router.post('/renew', authenticate, async (req, res) => {
  try {
    const { paymentMethod, creditCard, creditCardHolderInfo } = req.body;
    const userId = req.user.id;

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Nenhuma assinatura encontrada'
      });
    }

    req.body.paymentMethod = paymentMethod || subscription.payment_method || 'PIX';

    // Se o usuario nao informar novamente os dados do cartao, mantemos a mesma validacao da criacao
    if (req.body.paymentMethod === 'CREDIT_CARD') {
      req.body.creditCard = creditCard;
      req.body.creditCardHolderInfo = creditCardHolderInfo;
    }

    return handleCreatePayment(req, res);
  } catch (error) {
    console.error('Erro ao renovar pagamento:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao renovar pagamento'
    });
  }
});

/**
 * GET /api/v1/payments/status
 * Verificar status do pagamento atual
 */
router.get('/status', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!subscription) {
      return res.json({
        success: true,
        data: {
          hasActivePayment: false,
          message: 'Nenhum pagamento encontrado'
        }
      });
    }

    const now = new Date();
    const expiresAt = new Date(subscription.expires_at);
    const isExpired = expiresAt < now;
    const daysUntilExpiry = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));

    return res.json({
      success: true,
      data: {
        hasActivePayment: subscription.status === 'active' && !isExpired,
        subscription: {
          status: subscription.status,
          expiresAt: subscription.expires_at,
          daysUntilExpiry: daysUntilExpiry > 0 ? daysUntilExpiry : 0,
          isExpired,
          needsRenewal: daysUntilExpiry <= 5 || isExpired
        }
      }
    });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar status do pagamento'
    });
  }
});

module.exports = router;

