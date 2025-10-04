const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { supabase } = require('../config/supabase');
const jwtConfig = require('../config/jwt');

const generateToken = (userId) => {
  return jwt.sign({ userId }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn
  });
};

// Login com código de acesso
exports.loginWithCode = async (req, res) => {
  try {
    const { access_code } = req.body;

    if (!access_code) {
      return res.status(400).json({
        success: false,
        message: 'Código de acesso é obrigatório'
      });
    }

    // Normalizar código (remover espaços e converter para maiúscula)
    const normalizedCode = access_code.trim().toUpperCase();

    // Buscar usuário pelo código
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, full_name, is_admin, is_active, access_code')
      .eq('access_code', normalizedCode)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Código de acesso inválido'
      });
    }

    // Verificar se usuário está ativo
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Usuário inativo. Entre em contato com o suporte.'
      });
    }

    // Atualizar último login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Gerar tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        isAdmin: user.is_admin,
        accessCode: user.access_code
      }
    });
  } catch (error) {
    console.error('Erro no login com código:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login'
    });
  }
};

// Register new user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Check if user already exists
    const { data: existingUsers } = await supabase
      .from('users')
      .select('username, email')
      .or(`username.eq.${username},email.eq.${email}`)
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: existingUsers[0].username === username
          ? 'Username already exists'
          : 'Email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password: hashedPassword,
        full_name: fullName
      })
      .select()
      .single();

    if (error) throw error;

    // Remove password from response
    delete user.password;

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Find user by email or username
    const loginField = email || username;
    const isEmail = loginField && loginField.includes('@');

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq(isEmail ? 'email' : 'username', loginField)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive. Please contact support.'
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Get active subscription
    const { data: activeSubscription } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .gte('end_date', new Date().toISOString())
      .single();

    // Remove password from response
    delete user.password;

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        subscription: activeSubscription,
        token,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);

    // Generate new tokens
    const newToken = generateToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
};

// Validate token
exports.validateToken = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, full_name, is_active, is_admin')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        subscriptions:user_subscriptions!inner(
          *,
          plan:subscription_plans(*)
        )
      `)
      .eq('id', req.user.id)
      .eq('subscriptions.is_active', true)
      .single();

    if (error) throw error;

    // Remove password from response
    delete user.password;

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Logout (client-side token removal)
exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful. Please remove the token from client.'
  });
};
