const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/', authMiddleware, upload.single('media'), postController.createPost);
router.get('/', authMiddleware, postController.getFeed);
router.put('/like/:id', authMiddleware, postController.likePost);
router.post('/comment/:id', authMiddleware, postController.commentPost);

module.exports = router;
