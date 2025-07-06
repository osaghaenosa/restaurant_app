
import React, { useState } from 'react';
import { Icon } from '../components/Icons';
import { UserProfile } from '../types';
interface AuthScreenProps {
    onLogin: (email: string, pass: string) => boolean;
    onSignup: (newUser: Omit<UserProfile, 'addresses' | 'avatarUrl' | 'lastLogin' | 'role'>) => boolean;
    onCancel: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onSignup, onCancel }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let success = false;
        if (isLogin) {
            success = onLogin(email, password);
            if (!success) setError('Invalid email or password.');
        } else {
            if (!name || !email || !password || !phone) {
                setError('All fields are required for signup.');
                return;
            }
            success = onSignup({ name, email, phone, password });
            if (!success) setError('An account with this email already exists.');
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#D6EAF8] to-[#FFFFFF] animate-fade-in">
             <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl m-4 relative">
                <button onClick={onCancel} className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#2874A6]">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-md text-[#666666] mt-2">
                        {isLogin ? 'Sign in to continue your experience' : 'Get started with us today!'}
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DADE2]" required />
                    )}
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DADE2]" required />
                    {!isLogin && (
                        <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DADE2]" required />
                    )}
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DADE2]" required />
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button type="submit" className="w-full bg-[#2874A6] text-white font-bold py-3 mt-2 rounded-full shadow-lg hover:bg-opacity-90 transition-all text-lg active:scale-95">
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center">
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-sm text-[#2874A6] hover:underline font-semibold">
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                    </button>
                </div>
            </div>
        </div>
    );
};
