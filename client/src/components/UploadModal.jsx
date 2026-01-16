import { useState } from 'react';
import axios from 'axios';
import { X, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UploadModal = ({ onClose }) => {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('media', file);
        formData.append('caption', caption);

        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setLoading(false);
            onClose();
            window.location.reload();
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Upload failed');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl relative animate-fadeIn">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition">
                    <X />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Create Post</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-primary hover:bg-orange-50 transition cursor-pointer relative group">
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {file ? (
                            <p className="text-primary font-medium">{file.name}</p>
                        ) : (
                            <div className="flex flex-col items-center text-gray-400 group-hover:text-primary transition">
                                <Upload size={32} className="mb-2" />
                                <p>Drag & drop or click to upload</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <textarea
                            placeholder="Write a caption..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px]"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold p-3 rounded-lg hover:shadow-lg hover:opacity-95 transition disabled:opacity-50"
                    >
                        {loading ? 'Uploading...' : 'Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadModal;
