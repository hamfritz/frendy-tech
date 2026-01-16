const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/:id', authMiddleware, userController.getProfile);
router.put('/follow/:id', authMiddleware, userController.followUser);
router.put('/unfollow/:id', authMiddleware, userController.unfollowUser);

module.exports = router;
