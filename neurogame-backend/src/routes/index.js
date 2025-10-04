const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const gameRoutes = require('./gameRoutes');
const userRoutes = require('./userRoutes');
const subscriptionRoutes = require('./subscriptions');
const webhookRoutes = require('./webhooks');
const gameRequestRoutes = require('./gameRequests');
const downloadsRoutes = require('./downloads');

// API routes
router.use('/auth', authRoutes);
router.use('/games', gameRoutes);
router.use('/users', userRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/game-requests', gameRequestRoutes);
router.use('/downloads', downloadsRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'NeuroGame API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
