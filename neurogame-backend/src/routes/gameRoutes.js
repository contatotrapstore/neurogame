const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { validateCreateGame, validateUpdateGame, validateUUID } = require('../middleware/validator');

// Protected user routes
router.get('/user/games', authenticate, gameController.getUserGames);
router.get('/:id/validate', authenticate, validateUUID, gameController.validateAccess);

// Public/Admin routes
router.get('/', authenticate, gameController.getAllGames);
router.get('/categories', authenticate, gameController.getCategories);
router.get('/:id', authenticate, validateUUID, gameController.getGameById);

// Admin only routes
router.post('/', authenticate, authorizeAdmin, validateCreateGame, gameController.createGame);
router.put('/:id', authenticate, authorizeAdmin, validateUUID, validateUpdateGame, gameController.updateGame);
router.delete('/:id', authenticate, authorizeAdmin, validateUUID, gameController.deleteGame);

module.exports = router;
