

import React, { useMemo } from 'react';
import { CartItem } from '../types';
import { Icon } from '../components/Icons';

const CartItemCard: React.FC<{
    item: CartItem;
    onQuantityChange: (id: string, newQuantity: number) => void;
}> = ({ item, onQuantityChange }) => {
    
    const handleIncrease = () => {
        onQuantityChange(item.foodItem.id, item.quantity + 1);
    };

    const handleDecrease = () => {
        onQuantityChange(item.foodItem.id, item.quantity - 1);
    };
    
    const hasDiscount = item.foodItem.discountPercent && item.foodItem.discountPercent > 0;
    const price = hasDiscount 
        ? item.foodItem.price * (1 - (item.foodItem.discountPercent ?? 0) / 100)
        : item.foodItem.price;

    return (
        <div className="flex items-center bg-white border border-[#D6EAF8] rounded-xl p-3 mb-3 shadow-sm">
            <img src={item.foodItem.imageUrl} alt={item.foodItem.name} className="w-20 h-20 rounded-lg object-cover" />
            <div className="flex-grow ml-4">
                <h3 className="font-semibold text-md text-[#333333]">{item.foodItem.name}</h3>
                 {hasDiscount ? (
                    <div>
                        <p className="text-sm text-gray-400 line-through">₦{item.foodItem.price.toFixed(0)}</p>
                        <p className="text-sm font-bold text-red-500">₦{price.toFixed(0)}</p>
                    </div>
                ) : (
                    <p className="text-sm text-[#666666]">₦{item.foodItem.price.toFixed(0)}</p>
                )}
                <div className="flex items-center mt-2">
                    <button onClick={handleDecrease} className="bg-[#D6EAF8] text-[#2874A6] rounded-full p-1.5 hover:bg-[#5DADE2] hover:text-white transition-colors">
                        <Icon name="remove" className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-md text-[#333333]">{item.quantity}</span>
                    <button onClick={handleIncrease} className="bg-[#D6EAF8] text-[#2874A6] rounded-full p-1.5 hover:bg-[#5DADE2] hover:text-white transition-colors">
                        <Icon name="add" className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <p className="font-bold text-lg text-[#2874A6]">
                ₦{(price * item.quantity).toFixed(0)}
            </p>
        </div>
    );
};

export const CartScreen = ({ cartItems, setCartItems, onCheckout }: { cartItems: CartItem[], setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>, onCheckout: () => void }) => {

    const handleQuantityChange = (id: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            setCartItems(currentItems => currentItems.filter(item => item.foodItem.id !== id));
        } else {
            setCartItems(currentItems => currentItems.map(item =>
                item.foodItem.id === id ? { ...item, quantity: newQuantity } : item
            ));
        }
    };
    
    const subtotal = useMemo(() => {
        return cartItems.reduce((acc, item) => {
            const price = item.foodItem.discountPercent
                ? item.foodItem.price * (1 - item.foodItem.discountPercent / 100)
                : item.foodItem.price;
            return acc + price * item.quantity;
        }, 0);
    }, [cartItems]);
    
    const deliveryFee = subtotal > 0 ? 250 : 0;
    const total = subtotal + deliveryFee;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-[#333333] mb-4">My Cart</h1>
            
            {cartItems.length > 0 ? (
                <>
                    <div className="mb-4">
                        {cartItems.map(item => (
                            <CartItemCard key={item.foodItem.id} item={item} onQuantityChange={handleQuantityChange} />
                        ))}
                    </div>
                    
                    <div className="bg-white border border-[#D6EAF8] rounded-xl p-4 space-y-3 shadow-sm">
                        <div className="flex justify-between text-md text-[#666666]">
                            <span>Subtotal</span>
                            <span>₦{subtotal.toFixed(0)}</span>
                        </div>
                         <div className="flex justify-between text-md text-[#666666]">
                            <span>Delivery Fee</span>
                            <span>₦{deliveryFee.toFixed(0)}</span>
                        </div>
                        <div className="border-t border-[#D6EAF8] my-2"></div>
                        <div className="flex justify-between font-bold text-lg text-[#333333]">
                            <span>Total</span>
                            <span className="text-[#2874A6]">₦{total.toFixed(0)}</span>
                        </div>
                    </div>

                    <button onClick={onCheckout} className="w-full bg-[#2874A6] text-white font-bold py-4 mt-4 rounded-full shadow-lg hover:bg-opacity-90 transition-all text-lg active:scale-95">
                        Proceed to Checkout
                    </button>
                </>
            ) : (
                <div className="text-center py-20">
                    <p className="text-lg text-[#666666]">Your cart is empty.</p>
                    <p className="text-sm text-[#666666] mt-2">Add some delicious food to get started!</p>
                </div>
            )}
        </div>
    );
};