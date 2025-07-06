
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Icon } from '../components/Icons';

interface EditProfileScreenProps {
    user: UserProfile;
    onSave: (updatedUser: UserProfile) => void;
    onBack: () => void;
}

const InputField = ({ label, value, onChange, type = "text", placeholder }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, placeholder?: string }) => (
    <div>
        <label className="block text-sm font-medium text-[#666666] mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-white border border-[#D6EAF8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DADE2] transition-colors"
        />
    </div>
);

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ user, onSave, onBack }) => {
    const [formData, setFormData] = useState<UserProfile>(user);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');


    const handleChange = (field: keyof UserProfile) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (currentPassword !== user.password) {
            setPasswordError('Your current password is not correct.');
            return;
        }
        if (!newPassword || newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }

        const updatedUser = { ...formData, password: newPassword };
        setFormData(updatedUser);
        onSave(updatedUser);

        setPasswordSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="bg-[#F9F9F9] min-h-screen animate-slide-in">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                    <Icon name="chevron-left" className="w-6 h-6 text-[#333333]" />
                </button>
                <h1 className="text-xl font-bold text-[#333333] text-center flex-grow mr-8">Edit Profile</h1>
            </header>
            
            <div className="p-4 space-y-6">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="flex flex-col items-center space-y-3 p-4 bg-white border border-[#D6EAF8] rounded-xl shadow-sm">
                        <img src={formData.avatarUrl} alt="User" className="w-24 h-24 rounded-full object-cover border-4 border-[#D6EAF8] shadow-md"/>
                        <label htmlFor="avatar-upload" className="relative cursor-pointer bg-[#5DADE2] text-white rounded-lg font-medium py-2 px-4 hover:bg-[#2874A6] transition-colors">
                            <span>Change Picture</span>
                            <input id="avatar-upload" name="avatar-upload" type="file" className="sr-only" accept="image/*" onChange={handleAvatarUpload} />
                        </label>
                    </div>
                    <div className="bg-white border border-[#D6EAF8] rounded-xl p-4 space-y-4 shadow-sm">
                        <InputField label="Full Name" value={formData.name} onChange={handleChange('name')} />
                        <InputField label="Email Address" value={formData.email} onChange={handleChange('email')} type="email" />
                        <InputField label="Phone Number" value={formData.phone} onChange={handleChange('phone')} type="tel" />
                    </div>
                     <button 
                        type="submit"
                        className="w-full bg-[#2874A6] text-white font-bold py-4 rounded-full shadow-lg hover:bg-opacity-90 transition-all text-lg active:scale-95">
                        Save Profile Changes
                    </button>
                </form>

                <form onSubmit={handlePasswordSubmit} className="bg-white border border-[#D6EAF8] rounded-xl p-4 space-y-4 shadow-sm">
                    <h2 className="text-lg font-bold text-[#333333]">Change Password</h2>
                    <InputField label="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" />
                    <InputField label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" />
                    <InputField label="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" />

                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                    {passwordSuccess && <p className="text-green-600 text-sm">{passwordSuccess}</p>}

                    <button 
                        type="submit"
                        className="w-full bg-[#5DADE2] text-white font-bold py-3 rounded-full shadow-md hover:bg-[#2874A6] transition-colors">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};
