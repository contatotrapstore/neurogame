const { supabase } = require('../config/supabase');

// Get all subscription plans
exports.getAllPlans = async (req, res, next) => {
  try {
    const { isActive } = req.query;

    let query = supabase
      .from('subscription_plans')
      .select(`
        *,
        games:plan_games(
          game:games(*)
        )
      `);

    if (isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data: plans, error } = await query.order('price', { ascending: true });

    if (error) throw error;

    // Transform the data to match the expected structure
    const transformedPlans = plans?.map(plan => ({
      ...plan,
      games: plan.games?.map(pg => pg.game).filter(Boolean) || []
    })) || [];

    res.json({
      success: true,
      data: { plans: transformedPlans, count: transformedPlans.length }
    });
  } catch (error) {
    next(error);
  }
};

// Get single plan by ID
exports.getPlanById = async (req, res, next) => {
  try {
    const { data: plan, error } = await supabase
      .from('subscription_plans')
      .select(`
        *,
        games:plan_games(
          game:games(*)
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    // Transform the data to match the expected structure
    const transformedPlan = {
      ...plan,
      games: plan.games?.map(pg => pg.game).filter(Boolean) || []
    };

    res.json({
      success: true,
      data: { plan: transformedPlan }
    });
  } catch (error) {
    next(error);
  }
};

// Create subscription plan (Admin only)
exports.createPlan = async (req, res, next) => {
  try {
    const { name, description, price, durationDays, gameIds, features } = req.body;

    const { data: plan, error } = await supabase
      .from('subscription_plans')
      .insert({
        name,
        description,
        price,
        duration_days: durationDays,
        features: features || []
      })
      .select()
      .single();

    if (error) throw error;

    // Associate games if provided
    if (gameIds && Array.isArray(gameIds) && gameIds.length > 0) {
      const planGames = gameIds.map(gameId => ({
        plan_id: plan.id,
        game_id: gameId
      }));

      const { error: planGamesError } = await supabase
        .from('plan_games')
        .insert(planGames);

      if (planGamesError) throw planGamesError;
    }

    // Fetch the plan with games
    const { data: planWithGames } = await supabase
      .from('subscription_plans')
      .select(`
        *,
        games:plan_games(
          game:games(*)
        )
      `)
      .eq('id', plan.id)
      .single();

    // Transform the data
    const transformedPlan = {
      ...planWithGames,
      games: planWithGames.games?.map(pg => pg.game).filter(Boolean) || []
    };

    res.status(201).json({
      success: true,
      message: 'Subscription plan created successfully',
      data: { plan: transformedPlan }
    });
  } catch (error) {
    next(error);
  }
};

// Update subscription plan (Admin only)
exports.updatePlan = async (req, res, next) => {
  try {
    const { data: plan, error: findError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (findError || !plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    const { name, description, price, durationDays, gameIds, features, isActive } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (durationDays) updateData.duration_days = durationDays;
    if (features) updateData.features = features;
    if (isActive !== undefined) updateData.is_active = isActive;

    const { error } = await supabase
      .from('subscription_plans')
      .update(updateData)
      .eq('id', req.params.id);

    if (error) throw error;

    // Update associated games if provided
    if (gameIds && Array.isArray(gameIds)) {
      // Remove existing associations
      await supabase
        .from('plan_games')
        .delete()
        .eq('plan_id', plan.id);

      // Create new associations
      if (gameIds.length > 0) {
        const planGames = gameIds.map(gameId => ({
          plan_id: plan.id,
          game_id: gameId
        }));

        const { error: planGamesError } = await supabase
          .from('plan_games')
          .insert(planGames);

        if (planGamesError) throw planGamesError;
      }
    }

    // Fetch updated plan with games
    const { data: updatedPlan } = await supabase
      .from('subscription_plans')
      .select(`
        *,
        games:plan_games(
          game:games(*)
        )
      `)
      .eq('id', plan.id)
      .single();

    // Transform the data
    const transformedPlan = {
      ...updatedPlan,
      games: updatedPlan.games?.map(pg => pg.game).filter(Boolean) || []
    };

    res.json({
      success: true,
      message: 'Subscription plan updated successfully',
      data: { plan: transformedPlan }
    });
  } catch (error) {
    next(error);
  }
};

// Delete subscription plan (Admin only)
exports.deletePlan = async (req, res, next) => {
  try {
    const { data: plan, error: findError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (findError || !plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    // Check if any active subscriptions exist
    const { data: activeSubscriptions, error: countError } = await supabase
      .from('user_subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('plan_id', plan.id)
      .eq('is_active', true)
      .gte('end_date', new Date().toISOString());

    if (countError) throw countError;

    const count = activeSubscriptions?.length || 0;

    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete plan. ${count} active subscription(s) exist.`
      });
    }

    const { error } = await supabase
      .from('subscription_plans')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Subscription plan deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Assign subscription to user (Admin only)
exports.assignSubscription = async (req, res, next) => {
  try {
    const { userId, planId, durationDays, autoRenew } = req.body;

    // Verify user exists
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

    // Verify plan exists
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    // Deactivate existing active subscriptions
    await supabase
      .from('user_subscriptions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('is_active', true);

    // Create new subscription
    const startDate = new Date();
    const duration = durationDays || plan.duration_days;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);

    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        is_active: true,
        auto_renew: autoRenew || false
      })
      .select()
      .single();

    if (error) throw error;

    // Fetch subscription with user and plan
    const { data: subscriptionWithPlan } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        user:users(*),
        plan:subscription_plans(
          *,
          games:plan_games(
            game:games(*)
          )
        )
      `)
      .eq('id', subscription.id)
      .single();

    // Transform the plan games data
    if (subscriptionWithPlan?.plan) {
      subscriptionWithPlan.plan.games = subscriptionWithPlan.plan.games?.map(pg => pg.game).filter(Boolean) || [];
    }

    res.status(201).json({
      success: true,
      message: 'Subscription assigned successfully',
      data: { subscription: subscriptionWithPlan }
    });
  } catch (error) {
    next(error);
  }
};

// Cancel user subscription (Admin only)
exports.cancelSubscription = async (req, res, next) => {
  try {
    const { id: subscriptionId } = req.params;

    const { data: subscription, error: findError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (findError || !subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    const { data: updatedSubscription, error } = await supabase
      .from('user_subscriptions')
      .update({ is_active: false })
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: { subscription: updatedSubscription }
    });
  } catch (error) {
    next(error);
  }
};

// Get all user subscriptions (Admin only)
exports.getAllSubscriptions = async (req, res, next) => {
  try {
    const { isActive, page = 1, limit = 50 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('user_subscriptions')
      .select(`
        *,
        user:users(*),
        plan:subscription_plans(*)
      `, { count: 'exact' });

    if (isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data: subscriptions, error, count } = await query
      .range(offset, offset + parseInt(limit) - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: {
        subscriptions: subscriptions || [],
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

// Get user's current subscription
exports.getUserSubscription = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        plan:subscription_plans(
          *,
          games:plan_games(
            game:games(*)
          )
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .gte('end_date', new Date().toISOString())
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    // Transform the plan games data if subscription exists
    if (subscription?.plan) {
      subscription.plan.games = subscription.plan.games?.map(pg => pg.game).filter(Boolean) || [];
    }

    res.json({
      success: true,
      data: { subscription: subscription || null }
    });
  } catch (error) {
    next(error);
  }
};
