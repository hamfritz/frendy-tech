import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, User, LogOut, PlusSquare, Shield } from 'lucide-react';
import { useState } from 'react';
import UploadModal from './UploadModal';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 fixed h-full bg-white border-r border-gray-200 p-6 flex flex-col justify-between hidden md:flex shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-10 tracking-tight">
                        Frenzy
                    </h1>

                    <nav className="space-y-6">
                        <Link to="/" className="flex items-center space-x-3 text-lg font-medium text-gray-700 hover:text-primary transition group">
                            <Home className="group-hover:stroke-primary" /> <span>Feed</span>
                        </Link>
                        <Link to={`/profile/${user?.id}`} className="flex items-center space-x-3 text-lg font-medium text-gray-700 hover:text-primary transition group">
                            <User className="group-hover:stroke-primary" /> <span>Profile</span>
                        </Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="flex items-center space-x-3 text-lg font-medium text-gray-700 hover:text-primary transition group">
                                <Shield className="group-hover:stroke-primary" /> <span>Dashboard</span>
                            </Link>
                        )}
                        <button onClick={() => setIsUploadOpen(true)} className="flex items-center space-x-3 text-lg font-medium text-gray-700 hover:text-primary transition w-full text-left group">
                            <PlusSquare className="group-hover:stroke-primary" /> <span>Create</span>
                        </button>
                    </nav>
                </div>

                <button onClick={handleLogout} className="flex items-center space-x-3 text-lg text-gray-500 hover:text-red-500 transition">
                    <LogOut /> <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 max-w-4xl mx-auto w-full">
                {children}
            </main>

            {/* Upload Modal */}
            {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} />}

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <Link to="/" className="text-gray-600 hover:text-primary"><Home /></Link>
                <button onClick={() => setIsUploadOpen(true)} className="text-gray-600 hover:text-primary"><PlusSquare /></button>
                <Link to={`/profile/${user?.id}`} className="text-gray-600 hover:text-primary"><User /></Link>
            </div>
        </div>
    );
};

export default Layout;
