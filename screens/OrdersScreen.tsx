

import React from 'react';
import { Order, OrderStatus } from '../types';

const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const baseClasses = 'text-xs font-bold py-1 px-3 rounded-full text-white';
    const statusMap = {
        [OrderStatus.Completed]: { text: 'Completed', color: 'bg-[#2874A6]' },
        [OrderStatus.Pending]: { text: 'Pending', color: 'bg-[#5DADE2]' },
        [OrderStatus.Cancelled]: { text: 'Cancelled', color: 'bg-gray-400' },
    };
    const { text, color } = statusMap[status];

    return <div className={`${baseClasses} ${color}`}>{text}</div>;
};


const OrderItem: React.FC<{ order: Order; onTrackOrder: (id: string) => void; }> = ({ order, onTrackOrder }) => (
    <div className="bg-white border border-[#D6EAF8] rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="font-bold text-md text-[#333333]">Order #{order.id}</h3>
                <p className="text-sm text-[#666666]">{order.date}</p>
            </div>
            <OrderStatusBadge status={order.status} />
        </div>
        <div className="border-t border-[#D6EAF8] my-2"></div>
        <div className="space-y-1">
             {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm text-[#333333]">
                    <span>{item.quantity} x {item.name}</span>
                    <span>₦{(item.price * item.quantity).toFixed(0)}</span>
                </div>
             ))}
        </div>
        <div className="border-t border-[#D6EAF8] my-2"></div>
        <div className="flex justify-between items-center">
            <span className="font-semibold text-md text-[#333333]">Total</span>
            <span className="font-bold text-lg text-[#2874A6]">₦{order.total.toFixed(0)}</span>
        </div>
         {order.status === OrderStatus.Pending && (
             <button onClick={() => onTrackOrder(order.id)} className="mt-4 w-full bg-[#5DADE2] text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-[#2874A6] transition-colors">
                 Track Order
             </button>
         )}
         {order.status === OrderStatus.Completed && (
             <button className="mt-4 w-full bg-transparent border-2 border-[#5DADE2] text-[#5DADE2] font-bold py-2 px-4 rounded-full hover:bg-[#D6EAF8] transition-colors">
                 Reorder
             </button>
         )}
    </div>
);

export const OrdersScreen = ({ orders, onTrackOrder }: { orders: Order[], onTrackOrder: (id: string) => void }) => {
    const [activeTab, setActiveTab] = React.useState('Active');

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'Active') return order.status === OrderStatus.Pending;
        if (activeTab === 'Past') return order.status !== OrderStatus.Pending;
        return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-[#333333] mb-4">My Orders</h1>

            <div className="flex bg-[#D6EAF8] p-1 rounded-full mb-4">
                <button
                    onClick={() => setActiveTab('Active')}
                    className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === 'Active' ? 'bg-[#2874A6] text-white shadow' : 'text-[#333333]'}`}
                >
                    Active
                </button>
                <button
                    onClick={() => setActiveTab('Past')}
                    className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === 'Past' ? 'bg-[#2874A6] text-white shadow' : 'text-[#333333]'}`}
                >
                    Past
                </button>
            </div>

            <div>
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => <OrderItem key={order.id} order={order} onTrackOrder={onTrackOrder} />)
                ) : (
                    <div className="text-center py-12">
                        <p className="text-[#666666]">No orders in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};