import React from 'react';
import { Order, OrderStatus } from '../types';
import { Icon } from '../components/Icons';

interface TrackOrderScreenProps {
  order: Order;
  onBack: () => void;
  onCompleteOrder: (orderId: string) => void;
}

const TimelineStep = ({ step, title, isCompleted, isCurrent }: { step: number; title: string; isCompleted: boolean; isCurrent: boolean; }) => (
    <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${isCompleted ? 'bg-[#2874A6] text-white' : 'bg-[#D6EAF8] text-[#2874A6]'}`}>
            {isCompleted ? <Icon name="home" className="w-6 h-6"/> : step}
        </div>
        <div className="ml-4">
            <h3 className={`font-bold text-md ${isCurrent ? 'text-[#2874A6]' : 'text-[#333333]'}`}>{title}</h3>
        </div>
    </div>
);


export const TrackOrderScreen: React.FC<TrackOrderScreenProps> = ({ order, onBack, onCompleteOrder }) => {
    // This would be dynamic in a real app
    const currentStep: number = 2; // "Preparing"
    const mapUrl = `https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d12613.080514868515!2d-122.42540384198183!3d37.778732066164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x8085809c6b8f10c3%3A0x23fb77953513689b!2sRoux%2C%201554%20Fillmore%20St%2C%20San%20Francisco%2C%20CA%2094115!3m2!1d37.784401!2d-122.432363!4m5!1s0x808580a64b953281%3A0x6283d582348a274c!2s${encodeURIComponent(order.deliveryAddress || 'City Hall, San Francisco, CA')}!3m2!1d37.779264!2d-122.41927!5e0!3m2!1sen!2sus!4v1663363343991!5m2!1sen!2sus`

    return (
        <div className="bg-white min-h-screen animate-slide-in">
             <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-20">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                    <Icon name="chevron-left" className="w-6 h-6 text-[#333333]" />
                </button>
                <h1 className="text-xl font-bold text-[#333333] text-center flex-grow">Track Order</h1>
            </header>
            
            <div className="p-4 space-y-6">
                <div className="bg-white border border-[#D6EAF8] rounded-xl p-4 text-center shadow-sm">
                    <p className="text-md text-[#666666]">Estimated Delivery</p>
                    <p className="text-2xl font-bold text-[#2874A6]">15-20 Minutes</p>
                    <p className="text-sm text-[#666666] mt-1">Order ID: #{order.id}</p>
                </div>

                <div className="relative pl-5 py-4">
                    {/* Connecting line */}
                    <div className="absolute top-10 bottom-10 left-10 w-0.5 bg-[#D6EAF8]"></div>
                     <div className="absolute top-10 left-10 w-0.5 bg-[#2874A6]" style={{height: `${(currentStep - 1) * 33.33}%`}}></div>
                    
                    <div className="space-y-8 relative">
                       <TimelineStep step={1} title="Order Placed" isCompleted={currentStep > 1} isCurrent={currentStep === 1} />
                       <TimelineStep step={2} title="Preparing Your Meal" isCompleted={currentStep > 2} isCurrent={currentStep === 2} />
                       <TimelineStep step={3} title="Out for Delivery" isCompleted={currentStep > 3} isCurrent={currentStep === 3} />
                       <TimelineStep step={4} title="Delivered" isCompleted={order.status === OrderStatus.Completed} isCurrent={currentStep === 4} />
                    </div>
                </div>

                {order.deliveryType === 'Home Delivery' && (
                    <div>
                        <h3 className="text-lg font-bold text-[#333333] mb-2">Live Location</h3>
                        <div className="h-64 w-full rounded-2xl overflow-hidden border-2 border-[#D6EAF8]">
                            <iframe
                                src={mapUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>
            
             <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t border-[#D6EAF8]">
                <button 
                    onClick={() => onCompleteOrder(order.id)} 
                    disabled={order.status === OrderStatus.Completed}
                    className="w-full bg-[#2874A6] text-white font-bold py-4 rounded-full shadow-lg hover:bg-opacity-90 transition-all text-lg active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {order.status === OrderStatus.Completed ? 'Order Completed' : 'Mark as Delivered'}
                </button>
            </div>
        </div>
    );
}