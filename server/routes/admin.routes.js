const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.get('/stats', authMiddleware, roleMiddleware(['admin']), adminController.getStats);
router.delete('/users/:id', authMiddleware, roleMiddleware(['admin']), adminController.deleteUser);

module.exports = router;
