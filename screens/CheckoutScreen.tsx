
import React, { useState, useMemo } from 'react';
import { CartItem, UserProfile, DeliveryType } from '../types';
import { Icon } from '../components/Icons';

interface CheckoutScreenProps {
  cartItems: CartItem[];
  user: UserProfile;
  onPlaceOrder: (deliveryType: DeliveryType, deliveryAddress?: string) => void;
  onBack: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ cartItems, user, onPlaceOrder, onBack }) => {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(DeliveryType.Delivery);
  const [selectedAddress, setSelectedAddress] = useState<string>(user.addresses[0] || '');

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

  const handlePlaceOrderClick = () => {
    if (deliveryType === DeliveryType.Delivery && !selectedAddress) {
      alert('Please select or add a delivery address.');
      return;
    }
    onPlaceOrder(deliveryType, deliveryType === DeliveryType.Delivery ? selectedAddress : undefined);
  };
  
  const RadioButton = ({ value, selected, label }: {value: DeliveryType, selected: boolean, label: React.ReactNode}) => (
      <button onClick={() => setDeliveryType(value)} className={`w-full p-4 rounded-lg border-2 text-left transition-all ${selected ? 'bg-[#D6EAF8] border-[#2874A6] shadow-md' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${selected ? 'border-[#2874A6] bg-[#2874A6]' : 'border-gray-400'}`}>
                 {selected && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
              <span className={`font-semibold ${selected ? 'text-[#2874A6]' : 'text-[#333333]'}`}>{label}</span>
          </div>
      </button>
  );

  return (
    <div className="bg-[#F9F9F9] min-h-screen animate-slide-in">
      <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <Icon name="chevron-left" className="w-6 h-6 text-[#333333]" />
        </button>
        <h1 className="text-xl font-bold text-[#333333] text-center flex-grow">Checkout</h1>
      </header>

      <div className="p-4 space-y-6 pb-28">
        {/* Order Summary */}
        <div className="bg-white border border-[#D6EAF8] rounded-xl p-4 space-y-3 shadow-sm">
            <h2 className="text-lg font-bold text-[#333333] mb-2">Order Summary</h2>
            {cartItems.map(item => {
                const price = item.foodItem.discountPercent 
                    ? item.foodItem.price * (1 - item.foodItem.discountPercent / 100) 
                    : item.foodItem.price;
                return (
                 <div key={item.foodItem.id} className="flex justify-between items-center text-sm">
                    <span className="text-[#666666]">{item.quantity} x {item.foodItem.name}</span>
                    <span className="font-medium text-[#333333]">₦{(price * item.quantity).toFixed(0)}</span>
                </div>
                )
            })}
            <div className="border-t border-[#D6EAF8] my-2"></div>
             <div className="flex justify-between text-md text-[#666666]">
                <span>Subtotal</span>
                <span>₦{subtotal.toFixed(0)}</span>
            </div>
             <div className="flex justify-between text-md text-[#666666]">
                <span>Delivery Fee</span>
                <span>₦{deliveryFee.toFixed(0)}</span>
            </div>
            <div className="border-t-2 border-dashed border-gray-200 my-2"></div>
            <div className="flex justify-between font-bold text-lg text-[#333333]">
                <span>Total</span>
                <span className="text-[#2874A6]">₦{total.toFixed(0)}</span>
            </div>
        </div>
        
        {/* Delivery Options */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#333333]">Fulfillment Option</h2>
          <div className="space-y-3">
            <RadioButton value={DeliveryType.Delivery} selected={deliveryType === DeliveryType.Delivery} label={DeliveryType.Delivery} />
            <RadioButton value={DeliveryType.Pickup} selected={deliveryType === DeliveryType.Pickup} label={DeliveryType.Pickup} />
          </div>
        </div>

        {deliveryType === DeliveryType.Delivery && (
             <div className="space-y-4">
                <h2 className="text-lg font-bold text-[#333333]">Delivery Address</h2>
                {user.addresses.length > 0 ? (
                  <select 
                      value={selectedAddress} 
                      onChange={e => setSelectedAddress(e.target.value)}
                      className="w-full bg-white p-4 rounded-lg border-2 border-gray-200 focus:border-[#2874A6] focus:ring-0 outline-none"
                  >
                      {user.addresses.map((address, index) => (
                          <option key={index} value={address}>{address}</option>
                      ))}
                  </select>
                ) : (
                  <div className="text-center p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <p className="text-yellow-800">No addresses saved. Please add an address in your account settings.</p>
                  </div>
                )}
            </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t border-[#D6EAF8]">
        <button 
            onClick={handlePlaceOrderClick} 
            disabled={cartItems.length === 0 || (deliveryType === DeliveryType.Delivery && user.addresses.length === 0)}
            className="w-full bg-[#2874A6] text-white font-bold py-4 rounded-full shadow-lg hover:bg-opacity-90 transition-all text-lg active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed">
            Place Order
        </button>
      </div>
    </div>
  );
};
