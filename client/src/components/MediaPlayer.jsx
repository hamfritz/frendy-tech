const MediaPlayer = ({ url, type }) => {
    if (type === 'video') {
        return (
            <video controls className="w-full rounded-lg max-h-[500px] object-cover bg-black">
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        );
    }

    return (
        <img src={url} alt="Post content" className="w-full rounded-lg max-h-[500px] object-cover" />
    );
};

export default MediaPlayer;
