
import React, { useState } from 'react';
import { Reel, UserProfile, Comment } from '../types';
import { Icon } from '../components/Icons';
import { CommentsModal } from '../components/CommentsModal';

interface ReelsScreenProps {
    reels: Reel[];
    setReels: React.Dispatch<React.SetStateAction<Reel[]>>;
    currentUser: UserProfile | null;
    onRequestLogin: () => void;
}

const ReelCard: React.FC<{
    reel: Reel;
    isLiked: boolean;
    onLike: () => void;
    onComment: () => void;
}> = ({ reel, isLiked, onLike, onComment }) => (
    <div className="relative h-full w-full snap-start bg-black rounded-xl overflow-hidden shadow-lg">
        <video
            src={reel.videoUrl}
            loop
            autoPlay
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10"></div>
        <div className="relative z-20 flex flex-col justify-end h-full p-4 text-white">
            <div className="flex items-center mb-2">
                <img src={reel.user.avatar} alt={reel.user.name} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                <p className="ml-3 font-bold text-lg">{reel.user.name}</p>
            </div>
            <p className="text-md mb-4">{reel.title}</p>
        </div>
        <div className="absolute right-2 bottom-4 z-20 flex flex-col items-center space-y-4 text-white">
            <button onClick={onLike} className="flex flex-col items-center">
                <Icon name={isLiked ? 'heart-filled' : 'heart'} className={`w-8 h-8 transition-colors ${isLiked ? 'text-red-500' : 'text-white'}`} />
                <span className="text-sm font-semibold">{reel.likedBy.length}</span>
            </button>
            <button onClick={onComment} className="flex flex-col items-center">
                <Icon name="comment" className="w-8 h-8" />
                <span className="text-sm font-semibold">{reel.comments.length}</span>
            </button>
        </div>
    </div>
);

export const ReelsScreen: React.FC<ReelsScreenProps> = ({ reels, setReels, currentUser, onRequestLogin }) => {
    const [commentsModalReelId, setCommentsModalReelId] = useState<string | null>(null);

    const activeReelForComments = reels.find(r => r.id === commentsModalReelId);

    const handleLike = (reelId: string) => {
        if (!currentUser) {
            onRequestLogin();
            return;
        }
        setReels(currentReels =>
            currentReels.map(reel => {
                if (reel.id === reelId) {
                    const isLiked = reel.likedBy.includes(currentUser.email);
                    const newLikedBy = isLiked
                        ? reel.likedBy.filter(email => email !== currentUser.email)
                        : [...reel.likedBy, currentUser.email];
                    return { ...reel, likedBy: newLikedBy };
                }
                return reel;
            })
        );
    };

    const handleCommentClick = (reelId: string) => {
        if (!currentUser) {
            onRequestLogin();
        } else {
            setCommentsModalReelId(reelId);
        }
    };
    
    const handleAddComment = (text: string) => {
        if (!currentUser || !commentsModalReelId) return;

        const newComment: Comment = {
            user: {
                email: currentUser.email,
                name: currentUser.name,
                avatar: currentUser.avatarUrl,
            },
            text,
            timestamp: new Date().toISOString(),
        };

        setReels(currentReels =>
            currentReels.map(reel => {
                if (reel.id === commentsModalReelId) {
                    return { ...reel, comments: [...reel.comments, newComment] };
                }
                return reel;
            })
        );
    };

    const handleCloseComments = () => {
        setCommentsModalReelId(null);
    };

    return (
        <>
            <div className="h-[calc(100vh-5rem)] w-full bg-black">
                <div className="relative h-full w-full rounded-lg snap-y snap-mandatory overflow-y-scroll">
                    {reels.map(reel => (
                        <ReelCard
                            key={reel.id}
                            reel={reel}
                            isLiked={!!currentUser && reel.likedBy.includes(currentUser.email)}
                            onLike={() => handleLike(reel.id)}
                            onComment={() => handleCommentClick(reel.id)}
                        />
                    ))}
                </div>
            </div>
            {activeReelForComments && (
                <CommentsModal
                    comments={activeReelForComments.comments}
                    currentUser={currentUser}
                    onClose={handleCloseComments}
                    onAddComment={handleAddComment}
                />
            )}
        </>
    );
};
