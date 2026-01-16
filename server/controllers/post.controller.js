const Post = require('../models/Post');
const Notification = require('../models/Notification');

exports.createPost = async (req, res) => {
    try {
        const { caption } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Media file is required' });
        }

        const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
        // Construct local URL - In prod use S3 URL
        const mediaUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const newPost = new Post({
            author: req.user.id,
            caption,
            mediaUrl,
            mediaType
        });

        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getFeed = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('author', 'username profilePicture');
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if post has already been liked
        if (post.likes.includes(req.user.id)) {
            // Unlike
            post.likes = post.likes.filter(id => id.toString() !== req.user.id);
        } else {
            // Like
            post.likes.push(req.user.id);

            // Notification
            if (post.author.toString() !== req.user.id) {
                const notification = new Notification({
                    recipient: post.author,
                    sender: req.user.id,
                    type: 'like',
                    post: post.id
                });
                await notification.save();
            }
        }

        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.commentPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = {
            user: req.user.id,
            text: req.body.text
        };

        post.comments.unshift(newComment);
        await post.save();

        // Notification
        if (post.author.toString() !== req.user.id) {
            const notification = new Notification({
                recipient: post.author,
                sender: req.user.id,
                type: 'comment',
                post: post.id
            });
            await notification.save();
        }

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
