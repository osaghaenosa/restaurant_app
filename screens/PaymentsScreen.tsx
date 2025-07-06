
import React from 'react';
import { MOCK_PAYMENT_METHODS } from '../constants';
import { Icon } from '../components/Icons';
import { PaymentMethod } from '../types';

interface PaymentsScreenProps {
    onBack: () => void;
}

const PaymentCard: React.FC<{ method: PaymentMethod }> = ({ method }) => {
    const isVisa = method.type === 'visa';
    return (
        <div className={`relative p-6 rounded-2xl shadow-lg text-white overflow-hidden ${isVisa ? 'bg-gradient-to-br from-blue-700 to-blue-900' : 'bg-gradient-to-br from-gray-700 to-gray-900'}`}>
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl capitalize">{method.type}</h3>
                    <div className="w-12 h-8 bg-white/20 rounded-md flex items-center justify-center">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    </div>
                </div>
                <p className="font-mono text-2xl tracking-widest mb-4">**** **** **** {method.last4}</p>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs uppercase opacity-70">Expires End</p>
                        <p className="font-medium">{method.expiry}</p>
                    </div>
                    <div>
                         <p className="text-xs uppercase opacity-70">Card Holder</p>
                         <p className="font-medium">Alex Doe</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const PaymentsScreen: React.FC<PaymentsScreenProps> = ({ onBack }) => {
    const paymentMethods = MOCK_PAYMENT_METHODS;

    return (
        <div className="bg-[#F9F9F9] min-h-screen animate-slide-in">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                    <Icon name="chevron-left" className="w-6 h-6 text-[#333333]" />
                </button>
                <h1 className="text-xl font-bold text-[#333333] text-center flex-grow mr-8">Payment Methods</h1>
            </header>

            <div className="p-4 space-y-4">
                <button className="w-full bg-[#5DADE2] text-white font-bold py-3 rounded-full shadow-md hover:bg-[#2874A6] transition-colors flex items-center justify-center">
                    <Icon name="add" className="w-5 h-5 mr-2"/>
                    Add New Card
                </button>
                
                <div className="space-y-4">
                    {paymentMethods.length > 0 ? (
                        paymentMethods.map((method) => <PaymentCard key={method.id} method={method} />)
                    ) : (
                        <div className="text-center py-10 bg-white rounded-lg border border-[#D6EAF8]">
                            <p className="text-[#666666]">No payment methods saved.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
