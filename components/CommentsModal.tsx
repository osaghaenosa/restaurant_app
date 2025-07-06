import React, { useState } from 'react';
import { Comment, UserProfile } from '../types';
import { Icon } from './Icons';

interface CommentsModalProps {
    comments: Comment[];
    currentUser: UserProfile | null;
    onClose: () => void;
    onAddComment: (text: string) => void;
}

const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "min";
    return Math.floor(seconds) + "s";
};

export const CommentsModal: React.FC<CommentsModalProps> = ({ comments, currentUser, onClose, onAddComment }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment.trim());
            setNewComment('');
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-white rounded-t-2xl shadow-2xl w-full max-h-[80vh] flex flex-col animate-slide-in-up"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-[#D6EAF8] text-center relative">
                    <h2 className="text-lg font-bold text-[#333]">Comments ({comments.length})</h2>
                    <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 right-3 p-2 rounded-full hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.length > 0 ? (
                        comments.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((comment, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <img src={comment.user.avatar} alt={comment.user.name} className="w-9 h-9 rounded-full object-cover" />
                                <div className="flex-1">
                                    <p className="text-sm">
                                        <span className="font-bold text-[#333]">{comment.user.name}</span>
                                        <span className="text-[#666] ml-2">{comment.text}</span>
                                    </p>
                                    <span className="text-xs text-gray-400">{timeSince(comment.timestamp)} ago</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-8">No comments yet. Be the first!</p>
                    )}
                </div>

                <footer className="p-4 border-t border-[#D6EAF8] bg-white">
                    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                         <img src={currentUser?.avatarUrl} alt="Your avatar" className="w-10 h-10 rounded-full object-cover" />
                         <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-[#F9F9F9] border border-[#D6EAF8] rounded-full py-2.5 px-4 text-[#333] focus:outline-none focus:ring-2 focus:ring-[#5DADE2]"
                            />
                        <button type="submit" disabled={!newComment.trim()} className="bg-[#2874A6] text-white font-bold p-2.5 rounded-full shadow-md hover:bg-opacity-90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};
