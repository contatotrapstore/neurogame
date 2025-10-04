const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const asaasService = require('../services/asaas');

/**
 * POST /api/v1/subscriptions/create
 * Criar nova assinatura
 */
router.post('/create', authenticate, async (req, res) => {
  try {
    const { paymentMethod, creditCard, creditCardHolder } = req.body;
    const userId = req.user.id;

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

    // Verificar se já tem assinatura ativa
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'Você já possui uma assinatura ativa'
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

    // Criar assinatura no Asaas
    const subscriptionData = {
      userId,
      paymentMethod: paymentMethod || 'PIX',
      value: parseFloat(process.env.SUBSCRIPTION_VALUE || 149.90),
      description: 'NeuroGame - Assinatura Mensal Completa'
    };

    if (paymentMethod === 'CREDIT_CARD' && creditCard) {
      subscriptionData.creditCard = creditCard;
      subscriptionData.creditCardHolder = creditCardHolder;
    }

    const asaasSubscription = await asaasService.createSubscription(
      asaasCustomerId,
      subscriptionData
    );

    // Salvar subscription no banco
    const { data: newSubscription, error: subError } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: userId,
        asaas_subscription_id: asaasSubscription.id,
        status: 'pending',
        plan_value: subscriptionData.value,
        billing_cycle: 'MONTHLY',
        payment_method: paymentMethod,
        next_due_date: asaasSubscription.nextDueDate
      }])
      .select()
      .single();

    if (subError) throw subError;

    // Se for PIX, buscar QR Code
    let pixQrCode = null;
    let pixCopyPaste = null;

    if (paymentMethod === 'PIX') {
      try {
        // Buscar primeiro pagamento da assinatura
        const payments = await asaasService.listPayments(asaasSubscription.id, { limit: 1 });

        if (payments.data && payments.data.length > 0) {
          const firstPayment = payments.data[0];

          // Buscar QR Code
          const pixData = await asaasService.getPixQrCode(firstPayment.id);
          pixQrCode = pixData.encodedImage;
          pixCopyPaste = pixData.payload;

          // Salvar payment no banco
          await supabase
            .from('payments')
            .insert([{
              subscription_id: newSubscription.id,
              asaas_payment_id: firstPayment.id,
              asaas_invoice_url: firstPayment.invoiceUrl,
              value: firstPayment.value,
              status: 'pending',
              payment_method: 'PIX',
              due_date: firstPayment.dueDate,
              description: 'Primeiro pagamento - NeuroGame'
            }]);
        }
      } catch (pixError) {
        console.error('Erro ao buscar QR Code PIX:', pixError.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Assinatura criada com sucesso',
      data: {
        subscription: {
          id: newSubscription.id,
          asaas_subscription_id: asaasSubscription.id,
          status: newSubscription.status,
          plan_value: newSubscription.plan_value,
          payment_method: paymentMethod,
          next_due_date: newSubscription.next_due_date
        },
        payment: paymentMethod === 'PIX' ? {
          pixQrCode,
          pixCopyPaste,
          expiresIn: '15 minutos'
        } : null
      }
    });
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao criar assinatura'
    });
  }
});

/**
 * GET /api/v1/subscriptions/status
 * Consultar status da assinatura do usuário
 */
router.get('/status', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar assinatura mais recente
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !subscription) {
      return res.json({
        success: true,
        data: {
          hasSubscription: false,
          subscription: null
        }
      });
    }

    // Se tiver asaas_subscription_id, sincronizar com Asaas
    if (subscription.asaas_subscription_id) {
      try {
        const asaasSubscription = await asaasService.getSubscription(subscription.asaas_subscription_id);
        const newStatus = asaasService.mapSubscriptionStatus(asaasSubscription.status);

        // Atualizar se status mudou
        if (newStatus !== subscription.status) {
          await supabase
            .from('subscriptions')
            .update({ status: newStatus })
            .eq('id', subscription.id);

          subscription.status = newStatus;
        }
      } catch (asaasError) {
        console.error('Erro ao sincronizar com Asaas:', asaasError.message);
        // Usa o status do banco se falhar
      }
    }

    res.json({
      success: true,
      data: {
        hasSubscription: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          plan_value: subscription.plan_value,
          billing_cycle: subscription.billing_cycle,
          next_due_date: subscription.next_due_date,
          payment_method: subscription.payment_method,
          started_at: subscription.started_at,
          isActive: subscription.status === 'active'
        }
      }
    });
  } catch (error) {
    console.error('Erro ao consultar assinatura:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao consultar status da assinatura'
    });
  }
});

/**
 * DELETE /api/v1/subscriptions/cancel
 * Cancelar assinatura
 */
router.delete('/cancel', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar assinatura ativa
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error || !subscription) {
      return res.status(404).json({
        success: false,
        message: 'Nenhuma assinatura ativa encontrada'
      });
    }

    // Cancelar no Asaas
    if (subscription.asaas_subscription_id) {
      try {
        await asaasService.cancelSubscription(subscription.asaas_subscription_id);
      } catch (asaasError) {
        console.error('Erro ao cancelar no Asaas:', asaasError.message);
        // Continua e cancela localmente mesmo se falhar no Asaas
      }
    }

    // Atualizar no banco
    await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', subscription.id);

    res.json({
      success: true,
      message: 'Assinatura cancelada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar assinatura'
    });
  }
});

/**
 * GET /api/v1/subscriptions/payments
 * Listar pagamentos da assinatura
 */
router.get('/payments', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar subscription do usuário
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!subscription) {
      return res.json({
        success: true,
        data: { payments: [] }
      });
    }

    // Buscar payments
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('subscription_id', subscription.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: { payments: payments || [] }
    });
  } catch (error) {
    console.error('Erro ao listar pagamentos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar pagamentos'
    });
  }
});

module.exports = router;
