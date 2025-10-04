const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const asaasService = require('../services/asaas');

/**
 * POST /api/v1/payments/create
 * Criar novo pagamento mensal (PIX ou Cartão)
 */
router.post('/create', authenticate, async (req, res) => {
  try {
    const { paymentMethod, creditCard, creditCardHolderInfo } = req.body;
    const userId = req.user.id;

    // Validar método de pagamento
    if (!['PIX', 'CREDIT_CARD'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Método de pagamento inválido. Use PIX ou CREDIT_CARD'
      });
    }

    // Se for cartão, validar dados
    if (paymentMethod === 'CREDIT_CARD') {
      if (!creditCard || !creditCardHolderInfo) {
        return res.status(400).json({
          success: false,
          message: 'Dados do cartão são obrigatórios'
        });
      }
    }

    // Buscar dados do usuário
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Criar customer no Asaas se não existir
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

    // Criar pagamento no Asaas
    const paymentData = {
      userId,
      paymentMethod,
      value: parseFloat(process.env.SUBSCRIPTION_VALUE || 149.90),
      description: 'NeuroGame - Mensalidade Mensal'
    };

    if (paymentMethod === 'CREDIT_CARD') {
      paymentData.creditCard = creditCard;
      paymentData.creditCardHolderInfo = creditCardHolderInfo;
    }

    const asaasPayment = await asaasService.createPayment(
      asaasCustomerId,
      paymentData
    );

    // Calcular data de vencimento (30 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Criar ou atualizar subscription no banco
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    let subscription;

    if (existingSubscription) {
      // Atualizar subscription existente
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
      // Criar nova subscription
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

    // Preparar resposta
    const response = {
      subscription,
      payment: {
        id: asaasPayment.id,
        status: asaasPayment.status,
        value: asaasPayment.value,
        dueDate: asaasPayment.dueDate
      }
    };

    // Se for PIX, buscar QR Code
    if (paymentMethod === 'PIX') {
      try {
        const pixData = await asaasService.getPixQrCode(asaasPayment.id);
        response.pixQrCode = pixData.encodedImage;
        response.pixCopyPaste = pixData.payload;
      } catch (pixError) {
        console.error('Erro ao buscar QR Code PIX:', pixError);
      }
    }

    // Se for cartão e já foi confirmado
    if (paymentMethod === 'CREDIT_CARD' && asaasPayment.status === 'CONFIRMED') {
      response.message = 'Pagamento aprovado! Acesso liberado por 30 dias.';
    }

    res.status(201).json({
      success: true,
      message: 'Pagamento criado com sucesso',
      data: response
    });

  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao criar pagamento'
    });
  }
});

/**
 * POST /api/v1/payments/renew
 * Renovar pagamento (criar novo pagamento para o próximo mês)
 */
router.post('/renew', authenticate, async (req, res) => {
  try {
    const { paymentMethod, creditCard, creditCardHolderInfo } = req.body;
    const userId = req.user.id;

    // Buscar subscription atual
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

    // Usar mesmo fluxo de criação de pagamento
    req.body.paymentMethod = paymentMethod || subscription.payment_method;
    return router.handle(req, res);

  } catch (error) {
    console.error('Erro ao renovar pagamento:', error);
    res.status(500).json({
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

    res.json({
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
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar status do pagamento'
    });
  }
});

module.exports = router;
