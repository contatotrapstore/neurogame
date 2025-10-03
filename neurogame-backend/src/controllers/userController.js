const { supabase } = require('../config/supabase');

// Get all users (Admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { isActive, search, page = 1, limit = 50 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('users')
      .select(`
        *,
        subscriptions:user_subscriptions!inner(
          *,
          plan:subscription_plans(*)
        )
      `, { count: 'exact' });

    if (isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true');
    }

    if (search) {
      query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    query = query.eq('subscriptions.is_active', true);

    const { data: users, error, count } = await query
      .range(offset, offset + parseInt(limit) - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Remove passwords from response
    const sanitizedUsers = users?.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }) || [];

    res.json({
      success: true,
      data: {
        users: sanitizedUsers,
        pagination: {
          total: count || 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil((count || 0) / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single user by ID (Admin only)
exports.getUserById = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        subscriptions:user_subscriptions(
          *,
          plan:subscription_plans(*)
        ),
        accessible_games:user_game_access(
          granted_at,
          expires_at,
          game:games(*)
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

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

// Create new user (Admin only)
exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password, fullName, isAdmin } = req.body;
    const bcrypt = require('bcrypt');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password: hashedPassword,
        full_name: fullName,
        is_admin: isAdmin || false
      })
      .select()
      .single();

    if (error) throw error;

    // Remove password from response
    delete user.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Update user (Admin only)
exports.updateUser = async (req, res, next) => {
  try {
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (findError || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { email, fullName, isActive, isAdmin, password } = req.body;
    const bcrypt = require('bcrypt');

    const updateData = {};
    if (email) updateData.email = email;
    if (fullName !== undefined) updateData.full_name = fullName;
    if (isActive !== undefined) updateData.is_active = isActive;
    if (isAdmin !== undefined) updateData.is_admin = isAdmin;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    // Remove password from response
    delete updatedUser.password;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (findError || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting yourself
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Grant individual game access to user (Admin only)
exports.grantGameAccess = async (req, res, next) => {
  try {
    const { userId, gameId, expiresAt } = req.body;

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if game exists
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('id')
      .eq('id', gameId)
      .single();

    if (gameError || !game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Check if access already exists
    const { data: existingAccess } = await supabase
      .from('user_game_access')
      .select('*')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .single();

    let access;
    let created = false;

    if (existingAccess) {
      // Update existing access
      const { data, error } = await supabase
        .from('user_game_access')
        .update({
          granted_at: new Date().toISOString(),
          expires_at: expiresAt || null,
          granted_by: req.user.id
        })
        .eq('user_id', userId)
        .eq('game_id', gameId)
        .select()
        .single();

      if (error) throw error;
      access = data;
    } else {
      // Create new access
      const { data, error } = await supabase
        .from('user_game_access')
        .insert({
          user_id: userId,
          game_id: gameId,
          granted_at: new Date().toISOString(),
          expires_at: expiresAt || null,
          granted_by: req.user.id
        })
        .select()
        .single();

      if (error) throw error;
      access = data;
      created = true;
    }

    res.status(created ? 201 : 200).json({
      success: true,
      message: created ? 'Game access granted' : 'Game access updated',
      data: { access }
    });
  } catch (error) {
    next(error);
  }
};

// Revoke individual game access (Admin only)
exports.revokeGameAccess = async (req, res, next) => {
  try {
    const { userId, gameId } = req.params;

    const { data: access, error: findError } = await supabase
      .from('user_game_access')
      .select('*')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .single();

    if (findError || !access) {
      return res.status(404).json({
        success: false,
        message: 'Access record not found'
      });
    }

    const { error } = await supabase
      .from('user_game_access')
      .delete()
      .eq('user_id', userId)
      .eq('game_id', gameId);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Game access revoked'
    });
  } catch (error) {
    next(error);
  }
};

// Get user access history (Admin only)
exports.getUserHistory = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const { limit = 50, page = 1 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { data: history, error, count } = await supabase
      .from('access_history')
      .select('*, game:games(*)', { count: 'exact' })
      .eq('user_id', userId)
      .range(offset, offset + parseInt(limit) - 1)
      .order('accessed_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: {
        history: history || [],
        pagination: {
          total: count || 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil((count || 0) / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
