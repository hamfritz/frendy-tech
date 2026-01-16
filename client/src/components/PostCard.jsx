import { Heart, MessageCircle } from 'lucide-react';
import MediaPlayer from './MediaPlayer';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
    const { user } = useAuth();
    const [likes, setLikes] = useState(post.likes);
    const [isLiked, setIsLiked] = useState(post.likes.includes(user.id));
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(post.comments || []);
    const [commentText, setCommentText] = useState('');

    const handleLike = async () => {
        try {
            const res = await axios.put(`http://localhost:5000/api/posts/like/${post._id}`);
            setLikes(res.data);
            setIsLiked(res.data.includes(user.id));
        } catch (err) {
            console.error("Like failed", err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            const res = await axios.post(`http://localhost:5000/api/posts/comment/${post._id}`, { text: commentText });
            setComments(res.data);
            setCommentText('');
        } catch (err) {
            console.error("Comment failed", err);
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center mr-3 font-bold text-white uppercase text-sm shadow-sm">
                    {post.author.username?.[0] || 'U'}
                </div>
                <div>
                    <Link to={`/profile/${post.author._id}`} className="font-semibold text-gray-900 hover:text-primary transition">{post.author.username}</Link>
                    <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="mb-4">
                <p className="mb-3 text-gray-800">{post.caption}</p>
                <MediaPlayer url={post.mediaUrl} type={post.mediaType} />
            </div>

            <div className="flex items-center space-x-6 text-gray-500">
                <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 transition ${isLiked ? 'text-primary' : 'hover:text-primary'}`}
                >
                    <Heart fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} />
                    <span className="font-medium">{likes.length}</span>
                </button>
                <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-2 hover:text-primary transition">
                    <MessageCircle />
                    <span className="font-medium">{comments.length}</span>
                </button>
            </div>

            {showComments && (
                <div className="mt-4 border-t border-gray-100 pt-4 bg-gray-50 -mx-6 px-6 -mb-6 pb-6 rounded-b-xl">
                    <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {comments.map((comment, idx) => (
                            <div key={idx} className="text-sm">
                                <span className="font-bold text-gray-900">{comment.user?.username || 'User'}</span> <span className="text-gray-700">{comment.text}</span>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleComment} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-1 bg-white border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-primary text-sm shadow-sm"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button type="submit" className="text-sm bg-primary hover:bg-orange-600 px-4 rounded-lg text-white font-medium transition">Post</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PostCard;
