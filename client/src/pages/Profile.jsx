import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { UserPlus, UserMinus } from 'lucide-react';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userRes = await axios.get(`http://localhost:5000/api/users/${id}`);
                setProfileUser(userRes.data);
                setIsFollowing(userRes.data.followers.includes(currentUser.id));

                const allPostsRes = await axios.get('http://localhost:5000/api/posts');
                const userPosts = allPostsRes.data.filter(p => p.author._id === id);
                setPosts(userPosts);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id, currentUser.id]);

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await axios.put(`http://localhost:5000/api/users/unfollow/${id}`);
                setIsFollowing(false);
                setProfileUser(prev => ({ ...prev, followers: prev.followers.filter(f => f !== currentUser.id) }));
            } else {
                await axios.put(`http://localhost:5000/api/users/follow/${id}`);
                setIsFollowing(true);
                setProfileUser(prev => ({ ...prev, followers: [...prev.followers, currentUser.id] }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
    if (!profileUser) return <div className="text-center mt-10 text-gray-500">User not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 mb-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>

                <div className="flex items-center mb-6 md:mb-0">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white uppercase mr-6 shadow-lg border-4 border-white">
                        {profileUser.username[0]}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-1 text-gray-900">{profileUser.username}</h1>
                        <p className="text-gray-500 mb-4">{profileUser.email}</p>
                        <div className="flex space-x-6 text-sm">
                            <div className="text-center">
                                <span className="block font-bold text-xl text-gray-900">{posts.length}</span>
                                <span className="text-gray-500">Posts</span>
                            </div>
                            <div className="text-center">
                                <span className="block font-bold text-xl text-gray-900">{profileUser.followers.length}</span>
                                <span className="text-gray-500">Followers</span>
                            </div>
                            <div className="text-center">
                                <span className="block font-bold text-xl text-gray-900">{profileUser.following.length}</span>
                                <span className="text-gray-500">Following</span>
                            </div>
                        </div>
                    </div>
                </div>
                {currentUser.id !== id && (
                    <button
                        onClick={handleFollow}
                        className={`px-6 py-2 rounded-lg flex items-center gap-2 transition shadow-sm font-medium ${isFollowing ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-primary text-white hover:bg-orange-600'}`}
                    >
                        {isFollowing ? <><UserMinus size={18} /> Unfollow</> : <><UserPlus size={18} /> Follow</>}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>
            {posts.length === 0 && (
                <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center text-gray-400">
                    <p>No posts shared yet.</p>
                </div>
            )}
        </div>
    );
};

export default Profile;
