const User = require('../models/User');
const Post = require('../models/Post');

exports.getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const postCount = await Post.countDocuments();
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');

        res.json({
            totalUsers: userCount,
            totalPosts: postCount,
            recentUsers
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.deleteOne();
        // Also delete their posts? For now keep it simple.
        await Post.deleteMany({ author: req.params.id });

        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
