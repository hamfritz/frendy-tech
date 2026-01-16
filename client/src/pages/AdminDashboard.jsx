import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Image, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/stats');
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
            fetchStats(); // Refresh stats/list
        } catch (err) {
            console.error(err);
            alert('Failed to delete user');
        }
    }

    if (loading) return <div className="text-center mt-10 text-gray-500">Loading dashboard...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-900 border-l-4 border-primary pl-4">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center hover:shadow-lg transition">
                    <div className="p-4 bg-orange-100 rounded-full mr-4 text-primary">
                        <Users size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center hover:shadow-lg transition">
                    <div className="p-4 bg-yellow-100 rounded-full mr-4 text-yellow-600">
                        <Image size={32} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Posts</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Username</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats.recentUsers.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role !== 'admin' && (
                                            <button onClick={() => handleDeleteUser(user._id)} className="text-red-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-full">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
