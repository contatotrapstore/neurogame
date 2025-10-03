const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { validateCreatePlan, validateUUID } = require('../middleware/validator');

// Public routes (plans list)
router.get('/plans', subscriptionController.getAllPlans);
router.get('/plans/:id', validateUUID, subscriptionController.getPlanById);

// User route to get own subscription
router.get('/user/:userId', authenticate, subscriptionController.getUserSubscription);

// Admin only routes
router.post('/plans', authenticate, authorizeAdmin, validateCreatePlan, subscriptionController.createPlan);
router.put('/plans/:id', authenticate, authorizeAdmin, validateUUID, subscriptionController.updatePlan);
router.delete('/plans/:id', authenticate, authorizeAdmin, validateUUID, subscriptionController.deletePlan);

// Subscription management (Admin only)
router.get('/', authenticate, authorizeAdmin, subscriptionController.getAllSubscriptions);
router.post('/assign', authenticate, authorizeAdmin, subscriptionController.assignSubscription);
router.put('/:id/cancel', authenticate, authorizeAdmin, validateUUID, subscriptionController.cancelSubscription);

module.exports = router;
