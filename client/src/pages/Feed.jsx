import { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/posts');
                setPosts(res.data);
            } catch (err) {
                console.error("Failed to fetch feed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div className="text-center mt-10 text-gray-500">Loading feed...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            {posts.length === 0 ? (
                <div className="text-center text-gray-400 mt-10 flex flex-col items-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <span className="text-4xl">📭</span>
                    </div>
                    <p className="text-lg font-medium text-gray-600">No posts yet</p>
                    <p className="text-sm">Be the first to share something amazing!</p>
                </div>
            ) : (
                posts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))
            )}
        </div>
    );
};

export default Feed;
