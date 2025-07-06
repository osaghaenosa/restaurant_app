
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Icon } from '../components/Icons';

interface AddressesScreenProps {
    user: UserProfile;
    onUpdateUser: (updatedUser: UserProfile) => void;
    onBack: () => void;
}

export const AddressesScreen: React.FC<AddressesScreenProps> = ({ user, onUpdateUser, onBack }) => {
    const [newAddress, setNewAddress] = useState('');

    const handleAddAddress = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAddress.trim()) {
            const updatedUser = { ...user, addresses: [...user.addresses, newAddress.trim()] };
            onUpdateUser(updatedUser);
            setNewAddress('');
        }
    };

    const handleDeleteAddress = (addressToDelete: string) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            const updatedUser = { ...user, addresses: user.addresses.filter(addr => addr !== addressToDelete) };
            onUpdateUser(updatedUser);
        }
    };

    return (
        <div className="bg-[#F9F9F9] min-h-screen animate-slide-in">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                    <Icon name="chevron-left" className="w-6 h-6 text-[#333333]" />
                </button>
                <h1 className="text-xl font-bold text-[#333333] text-center flex-grow mr-8">Saved Addresses</h1>
            </header>

            <div className="p-4 space-y-6">
                {/* Add Address Form */}
                <form onSubmit={handleAddAddress} className="bg-white border border-[#D6EAF8] rounded-xl p-4 space-y-3 shadow-sm">
                    <h2 className="text-lg font-bold text-[#333333]">Add New Address</h2>
                    <input
                        type="text"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="e.g., 123 Main St, Anytown, 12345"
                        className="w-full px-4 py-3 bg-white border border-[#D6EAF8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DADE2] transition-colors"
                    />
                    <button type="submit" className="w-full bg-[#5DADE2] text-white font-bold py-3 rounded-full shadow-md hover:bg-[#2874A6] transition-colors">
                        Add Address
                    </button>
                </form>

                {/* Saved Addresses List */}
                <div className="space-y-3">
                    <h2 className="text-lg font-bold text-[#333333]">Your Addresses</h2>
                    {user.addresses.length > 0 ? (
                        user.addresses.map((address, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white border border-[#D6EAF8] rounded-lg shadow-sm">
                                <p className="flex-1 text-md text-[#333333] mr-4">{address}</p>
                                <button onClick={() => handleDeleteAddress(address)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors">
                                    <Icon name="trash" className="w-5 h-5"/>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-white rounded-lg border border-[#D6EAF8]">
                            <p className="text-[#666666]">You have no saved addresses.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
