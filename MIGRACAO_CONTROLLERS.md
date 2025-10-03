# 🔄 Guia de Migração dos Controllers para Supabase

Este documento mostra como adaptar os controllers de Sequelize para Supabase.

## 📝 Padrões de Migração

### De Sequelize → Para Supabase

| Operação Sequelize | Operação Supabase |
|-------------------|-------------------|
| `Model.findAll()` | `SupabaseHelper.findAll('table')` |
| `Model.findByPk(id)` | `SupabaseHelper.findByPk('table', id)` |
| `Model.findOne({ where })` | `SupabaseHelper.findOne('table', where)` |
| `Model.create(data)` | `SupabaseHelper.create('table', data)` |
| `model.update(data)` | `SupabaseHelper.update('table', id, data)` |
| `model.destroy()` | `SupabaseHelper.delete('table', id)` |
| `Model.count({ where })` | `SupabaseHelper.count('table', where)` |

## 🔐 authController.js (Adaptado)

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SupabaseHelper = require('../utils/supabaseHelper');
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

// Register new user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Check if user already exists
    const { data: userByUsername } = await SupabaseHelper.findOne('users', { username });
    const { data: userByEmail } = await SupabaseHelper.findOne('users', { email });

    if (userByUsername || userByEmail) {
      return res.status(409).json({
        success: false,
        message: userByUsername ? 'Username already exists' : 'Email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const { data: user } = await SupabaseHelper.create('users', {
      username,
      email,
      password: hashedPassword,
      full_name: fullName
    });

    // Remove password from response
    delete user.password;

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user, token, refreshToken }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user
    const { data: user } = await SupabaseHelper.findOne('users', { username });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
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
        message: 'Invalid username or password'
      });
    }

    // Update last login
    await SupabaseHelper.update('users', user.id, {
      last_login: new Date().toISOString()
    });

    // Get active subscription
    const { data: subscriptions } = await SupabaseHelper.findWithRelations(
      'user_subscriptions',
      '*, subscription_plans(*)',
      {
        user_id: user.id,
        is_active: true
      }
    );

    const activeSubscription = subscriptions?.find(sub =>
      new Date(sub.end_date) >= new Date()
    );

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

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    const { data: user } = await SupabaseHelper.findByPk('users', req.user.id);

    // Get active subscriptions with plan details
    const { data: subscriptions } = await SupabaseHelper.findWithRelations(
      'user_subscriptions',
      '*, subscription_plans(*)',
      {
        user_id: req.user.id,
        is_active: true
      }
    );

    delete user.password;

    res.json({
      success: true,
      data: { user: { ...user, subscriptions } }
    });
  } catch (error) {
    next(error);
  }
};

// Logout
exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful. Please remove the token from client.'
  });
};
```

## 🎮 gameController.js (Exemplo Adaptado)

```javascript
const SupabaseHelper = require('../utils/supabaseHelper');

// Get all games
exports.getAllGames = async (req, res, next) => {
  try {
    const { category, isActive, search } = req.query;

    const where = {};
    if (category) where.category = category;
    if (isActive !== undefined) where.is_active = isActive === 'true';

    // Search will need custom query in Supabase
    let games;
    if (search) {
      const { supabase } = require('../config/supabase');
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .or(`name.ilike.%${search}%,description.ilike.%${search}%`)
        .order('order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      games = data;
    } else {
      const { data } = await SupabaseHelper.findAll('games', {
        where,
        order: [['order', 'ASC'], ['name', 'ASC']]
      });
      games = data;
    }

    res.json({
      success: true,
      data: { games, count: games.length }
    });
  } catch (error) {
    next(error);
  }
};

// Get games accessible by current user
exports.getUserGames = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all active games
    const { data: allGames } = await SupabaseHelper.findAll('games', {
      where: { is_active: true },
      order: [['order', 'ASC'], ['name', 'ASC']]
    });

    // Get active subscription
    const { data: subscriptions } = await SupabaseHelper.findAll('user_subscriptions', {
      where: { user_id: userId, is_active: true }
    });

    const activeSubscription = subscriptions?.find(sub =>
      new Date(sub.end_date) >= new Date()
    );

    let subscriptionGameIds = [];
    if (activeSubscription) {
      const { data: planGames } = await SupabaseHelper.findAll('plan_games', {
        where: { plan_id: activeSubscription.plan_id }
      });
      subscriptionGameIds = planGames.map(pg => pg.game_id);
    }

    // Get individual game access
    const { supabase } = require('../config/supabase');
    const { data: individualAccess } = await supabase
      .from('user_game_access')
      .select('game_id')
      .eq('user_id', userId)
      .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`);

    const individualGameIds = individualAccess?.map(ug => ug.game_id) || [];

    // Combine and mark accessible games
    const gamesWithAccess = allGames.map(game => ({
      ...game,
      hasAccess: subscriptionGameIds.includes(game.id) || individualGameIds.includes(game.id),
      accessType: subscriptionGameIds.includes(game.id) ? 'subscription' :
                   individualGameIds.includes(game.id) ? 'individual' : null
    }));

    res.json({
      success: true,
      data: {
        games: gamesWithAccess,
        subscription: activeSubscription || null
      }
    });
  } catch (error) {
    next(error);
  }
};

// Validate game access
exports.validateAccess = async (req, res, next) => {
  try {
    const { id: gameId } = req.params;
    const userId = req.user.id;

    // Check if game exists and is active
    const { data: game } = await SupabaseHelper.findOne('games', {
      id: gameId,
      is_active: true
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found or inactive',
        hasAccess: false
      });
    }

    // Check subscription access
    const { data: subscriptions } = await SupabaseHelper.findAll('user_subscriptions', {
      where: { user_id: userId, is_active: true }
    });

    const activeSubscription = subscriptions?.find(sub =>
      new Date(sub.end_date) >= new Date()
    );

    let hasAccess = false;

    if (activeSubscription) {
      const { data: planGame } = await SupabaseHelper.findOne('plan_games', {
        plan_id: activeSubscription.plan_id,
        game_id: gameId
      });
      if (planGame) hasAccess = true;
    }

    // Check individual access
    if (!hasAccess) {
      const { supabase } = require('../config/supabase');
      const { data: individualAccess } = await supabase
        .from('user_game_access')
        .select('*')
        .eq('user_id', userId)
        .eq('game_id', gameId)
        .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`)
        .single();

      if (individualAccess) hasAccess = true;
    }

    // Log access attempt
    if (hasAccess) {
      await SupabaseHelper.create('access_history', {
        user_id: userId,
        game_id: gameId,
        ip_address: req.ip || req.connection.remoteAddress
      });
    }

    res.json({
      success: true,
      data: {
        hasAccess,
        game: hasAccess ? game : null,
        message: hasAccess ? 'Access granted' : 'Access denied'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Demais métodos seguem o mesmo padrão...
```

## 📚 Outras Adaptações Necessárias

### middleware/auth.js

```javascript
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const SupabaseHelper = require('../utils/supabaseHelper');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.'
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, jwtConfig.secret);

      // Fetch user from Supabase
      const { data: user } = await SupabaseHelper.findByPk('users', decoded.userId);

      if (!user || !user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive.'
        });
      }

      // Attach user to request object
      req.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.is_admin
      };

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.'
        });
      }
      throw error;
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Authorization denied.'
    });
  }
};

module.exports = { authenticate, authorizeAdmin };
```

## ✅ Checklist de Migração

- [x] Configurar Supabase client
- [x] Criar SupabaseHelper
- [ ] Adaptar authController.js
- [ ] Adaptar gameController.js
- [ ] Adaptar userController.js
- [ ] Adaptar subscriptionController.js
- [ ] Adaptar middleware/auth.js
- [ ] Atualizar server.js (remover sync do Sequelize)
- [ ] Remover arquivos de modelos Sequelize (ou manter como referência)
- [ ] Testar todos os endpoints

## 🔄 Próximos Passos

1. Copie o código adaptado acima para cada controller
2. Ajuste conforme necessário para casos específicos
3. Teste cada endpoint individualmente
4. Use Postman ou similar para validar responses

---

**Todos os controllers seguem o mesmo padrão de migração!**
