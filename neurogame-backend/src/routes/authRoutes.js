const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validator');

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/login-code', authController.loginWithCode);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.get('/validate', authenticate, authController.validateToken);
router.get('/profile', authenticate, authController.getProfile);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
