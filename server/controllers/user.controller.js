const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.followUser = async (req, res) => {
    if (req.user.id === req.params.id) {
        return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.followers.includes(req.user.id)) {
            await user.updateOne({ $push: { followers: req.user.id } });
            await currentUser.updateOne({ $push: { following: req.params.id } });

            // TODO: Notification here

            res.json({ message: 'User followed' });
        } else {
            res.status(400).json({ message: 'You already follow this user' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.unfollowUser = async (req, res) => {
    if (req.user.id === req.params.id) {
        return res.status(400).json({ message: 'Cannot unfollow yourself' });
    }

    try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.followers.includes(req.user.id)) {
            await user.updateOne({ $pull: { followers: req.user.id } });
            await currentUser.updateOne({ $pull: { following: req.params.id } });
            res.json({ message: 'User unfollowed' });
        } else {
            res.status(400).json({ message: 'You do not follow this user' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
