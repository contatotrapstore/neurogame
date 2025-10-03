const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const gameRoutes = require('./gameRoutes');
const userRoutes = require('./userRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');

// API routes
router.use('/auth', authRoutes);
router.use('/games', gameRoutes);
router.use('/users', userRoutes);
router.use('/subscriptions', subscriptionRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'NeuroGame API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
