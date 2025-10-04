const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const jwtConfig = require('../config/jwt');
const asaasService = require('../services/asaas');

/**
 * POST /api/v1/auth/register
 * Registro de novo usuário (email + senha)
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    // Validação
    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, senha e nome completo são obrigatórios'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }

    // Validar senha (mínimo 6 caracteres)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter no mínimo 6 caracteres'
      });
    }

    // Verificar se email já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este email já está cadastrado'
      });
    }

    // Hash da senha
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Criar usuário no banco
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert([{
        email: email.toLowerCase(),
        password_hash,
        full_name,
        is_active: true,
        is_admin: false
      }])
      .select()
      .single();

    if (userError) throw userError;

    // Criar customer no Asaas
    try {
      const asaasCustomer = await asaasService.createCustomer({
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name
      });

      // Atualizar usuário com asaas_customer_id
      await supabase
        .from('users')
        .update({ asaas_customer_id: asaasCustomer.id })
        .eq('id', newUser.id);

      newUser.asaas_customer_id = asaasCustomer.id;
    } catch (asaasError) {
      console.error('Erro ao criar customer no Asaas:', asaasError.message);
      // Continua mesmo se falhar - pode criar depois
    }

    // Gerar JWT
    const token = jwt.sign(
      { userId: newUser.id },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          asaas_customer_id: newUser.asaas_customer_id
        },
        token,
        hasActiveSubscription: false // Novo usuário não tem assinatura
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário'
    });
  }
});

/**
 * POST /api/v1/auth/login
 * Login com email e senha
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário por email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar se usuário está ativo
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Usuário desativado. Entre em contato com o suporte.'
      });
    }

    // Buscar assinatura ativa
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    const hasActiveSubscription = !!subscription;

    // Atualizar last_login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Gerar JWT com subscription info
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isAdmin: user.is_admin,
        hasActiveSubscription,
        subscriptionId: subscription?.id || null
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          is_admin: user.is_admin
        },
        subscription: subscription ? {
          id: subscription.id,
          status: subscription.status,
          plan_value: subscription.plan_value,
          next_due_date: subscription.next_due_date
        } : null,
        token,
        hasActiveSubscription
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login'
    });
  }
});

/**
 * POST /api/v1/auth/heartbeat
 * Validação periódica de sessão e subscription
 */
router.post('/heartbeat', authenticate, async (req, res) => {
  try {
    const { deviceId, deviceName, osInfo, launcherVersion } = req.body;
    const userId = req.user.id;

    // Buscar subscription ativa mais recente
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const subscriptionStatus = subscription?.status || 'none';
    const hasActiveSubscription = subscriptionStatus === 'active';

    // Atualizar ou criar launcher_session
    const sessionData = {
      user_id: userId,
      device_id: deviceId,
      device_name: deviceName || 'Unknown Device',
      os_info: osInfo,
      launcher_version: launcherVersion,
      token_hash: req.headers.authorization?.split(' ')[1],
      last_heartbeat: new Date().toISOString(),
      subscription_status_cache: subscriptionStatus,
      ip_address: req.ip
    };

    const { data: existingSession } = await supabase
      .from('launcher_sessions')
      .select('id')
      .eq('user_id', userId)
      .eq('device_id', deviceId)
      .single();

    if (existingSession) {
      await supabase
        .from('launcher_sessions')
        .update(sessionData)
        .eq('id', existingSession.id);
    } else {
      await supabase
        .from('launcher_sessions')
        .insert([sessionData]);
    }

    res.json({
      success: true,
      data: {
        hasActiveSubscription,
        subscription: subscription ? {
          id: subscription.id,
          status: subscription.status,
          next_due_date: subscription.next_due_date,
          plan_value: subscription.plan_value
        } : null,
        serverTime: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erro no heartbeat:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar sessão'
    });
  }
});

module.exports = router;
