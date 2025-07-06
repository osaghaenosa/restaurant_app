

import React, { useState, useEffect, useRef } from 'react';
import { Tab, FoodItem, Order, CartItem, OrderStatus, DeliveryType, UserProfile, Reel, AppSettings, CustomPage } from './types';
import { MOCK_FOOD_ITEMS, MOCK_ORDERS, MOCK_USER_PROFILE, MOCK_REELS, DEFAULT_APP_SETTINGS } from './constants';
import { SplashScreen } from './components/SplashScreen';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { CartScreen } from './screens/CartScreen';
import { DealsScreen } from './screens/DealsScreen';
import { AccountScreen } from './screens/AccountScreen';
import { AdminScreen } from './screens/AdminScreen';
import { ProductScreen } from './screens/ProductScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OrderConfirmationScreen } from './screens/OrderConfirmationScreen';
import { TrackOrderScreen } from './screens/TrackOrderScreen';
import { ToastNotification } from './components/ToastNotification';
import { PromoModal } from './components/PromoModal';
import { ReelsScreen } from './screens/ReelsScreen';
import { AuthScreen } from './screens/AuthScreen';
import { EditProfileScreen } from './screens/EditProfileScreen';
import { AddressesScreen } from './screens/AddressesScreen';
import { PaymentsScreen } from './screens/PaymentsScreen';
import { CustomPageScreen } from './screens/CustomPageScreen';


type View =
  | { name: 'main' }
  | { name: 'product'; id: string }
  | { name: 'admin' }
  | { name: 'checkout' }
  | { name: 'confirmation' }
  | { name: 'track'; id: string }
  | { name: 'deals' }
  | { name: 'auth'; from?: View }
  | { name: 'editProfile' }
  | { name: 'addresses' }
  | { name: 'payments' }
  | { name: 'customPage'; id: string };

function useLocalStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
      }
    }
  }, [key, state]);

  return [state, setState];
}


const App = () => {
  const [appReady, setAppReady] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Home);
  const [view, setView] = useState<View>({ name: 'main' });
  const viewRef = useRef(view);
  viewRef.current = view;

  // App settings state
  const [appSettings, setAppSettings] = useLocalStorageState<AppSettings>('ruxx_app_settings', DEFAULT_APP_SETTINGS);
  const [customPages, setCustomPages] = useLocalStorageState<CustomPage[]>('ruxx_custom_pages', []);

  // Centralized data state
  const [foodItems, setFoodItems] = useLocalStorageState<FoodItem[]>('ruxx_food_items', MOCK_FOOD_ITEMS);
  const [orders, setOrders] = useLocalStorageState<Order[]>('ruxx_orders', []);
  const [cartItems, setCartItems] = useLocalStorageState<CartItem[]>('ruxx_cart', []);
  const [reels, setReels] = useLocalStorageState<Reel[]>('ruxx_reels', MOCK_REELS);
  
  // Auth state
  const [users, setUsers] = useLocalStorageState<UserProfile[]>('ruxx_users', [MOCK_USER_PROFILE]);
  const [currentUser, setCurrentUser] = useLocalStorageState<UserProfile | null>('ruxx_current_user', null);

  // Overlays state
  const [toast, setToast] = useState<{ key: number; message: string } | null>(null);
  const [isPromoVisible, setIsPromoVisible] = useState(false);
  const promoShownRef = useRef(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAppReady(true), 3500);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    document.title = appSettings.appName;
  }, [appSettings.appName]);

  useEffect(() => {
    if (appReady && !promoShownRef.current) {
      const promoTimerDelay = Math.random() * 20000 + 10000;
      const promoTimer = setTimeout(() => {
        if (!promoShownRef.current) setIsPromoVisible(true);
      }, promoTimerDelay);
      return () => clearTimeout(promoTimer);
    }
  }, [appReady]);

  // --- History and Navigation ---
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // When user navigates back/forward, update the view state.
      if (event.state) {
        setView(event.state);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Replace the initial history state with our view object.
    window.history.replaceState(viewRef.current, '');

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  const navigate = (newView: View, replace = false) => {
    // Only push to history if the view is actually changing
    if (JSON.stringify(newView) === JSON.stringify(viewRef.current)) {
        return;
    }
    
    if (replace) {
        window.history.replaceState(newView, '');
    } else {
        window.history.pushState(newView, '');
    }
    setView(newView);
  };


  // --- Auth & Navigation Logic ---
  const navigateToTab = (tab: Tab) => {
    const protectedTabs = [Tab.Account, Tab.Orders];
    if (protectedTabs.includes(tab) && !currentUser) {
      navigate({ name: 'auth', from: { name: 'main' } });
    } else {
      navigate({ name: 'main' });
      setActiveTab(tab);
    }
  };

  const navigateToView = (newView: View) => {
    const protectedViews = ['admin', 'checkout', 'editProfile', 'addresses', 'payments'];
    if (protectedViews.includes(newView.name) && !currentUser) {
      navigate({ name: 'auth', from: newView });
    } else {
      navigate(newView);
    }
  };

  const handleLogin = (email: string, pass: string) => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
        const updatedUser = { ...user, lastLogin: new Date().toISOString() };
        setCurrentUser(updatedUser);
        // Also update the user in the main users list
        setUsers(currentUsers => currentUsers.map(u => u.email === email ? updatedUser : u));
        const fromView = (view as {name: 'auth', from?: View}).from || { name: 'main' };
        navigate(fromView, true);
        if (fromView.name === 'main' && (fromView as any).tab === undefined) {
           setActiveTab(Tab.Home);
        }
        return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab(Tab.Home);
    navigate({ name: 'main' }, true);
  };

  const handleSignup = (newUser: Omit<UserProfile, 'addresses' | 'avatarUrl' | 'lastLogin' | 'role'>) => {
      if (users.some(u => u.email === newUser.email)) {
          return false;
      }
      const fullNewUser: UserProfile = {
          ...newUser,
          addresses: [],
          avatarUrl: `https://i.pravatar.cc/150?u=${newUser.email}`,
          lastLogin: new Date().toISOString(),
          role: 'user',
      };
      setUsers(currentUsers => [...currentUsers, fullNewUser]);
      setCurrentUser(fullNewUser);
      navigate({ name: 'main' }, true);
      setActiveTab(Tab.Home);
      return true;
  }

  // --- Data mutation logic ---

  const showToast = (message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ key: Date.now(), message });
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (item: FoodItem, quantity: number) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(ci => ci.foodItem.id === item.id);
      if (existingItem) {
        return currentItems.map(ci =>
          ci.foodItem.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      } else {
        return [...currentItems, { foodItem: item, quantity }];
      }
    });
    showToast(`${item.name} added to cart!`);
  };

  const handlePlaceOrder = (deliveryType: DeliveryType, deliveryAddress?: string) => {
    if (!currentUser) {
        showToast("You need to be logged in to place an order.");
        navigate({ name: 'auth' });
        return;
    }
    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.foodItem.discountPercent
            ? item.foodItem.price * (1 - item.foodItem.discountPercent / 100)
            : item.foodItem.price;
        return acc + price * item.quantity;
    }, 0);
    const deliveryFee = subtotal > 0 ? 250 : 0;
    const total = subtotal + deliveryFee;

    const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        items: cartItems.map(ci => ({ name: ci.foodItem.name, quantity: ci.quantity, price: ci.foodItem.price })),
        total: total,
        date: new Date().toISOString().split('T')[0],
        status: OrderStatus.Pending,
        deliveryType,
        deliveryAddress: deliveryType === DeliveryType.Delivery ? deliveryAddress : undefined,
    };
    
    setOrders(currentOrders => [newOrder, ...currentOrders]);
    setCartItems([]);
    navigate({ name: 'confirmation' }, true);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    if (!currentUser) return;
    const finalUser = { ...currentUser, ...updatedUser };
    setCurrentUser(finalUser);
    setUsers(currentUsers => currentUsers.map(u => u.email === finalUser.email ? finalUser : u));
    showToast('Profile updated successfully!');
  };


  // --- Screen Rendering Logic ---

  if (!appReady) {
    return <SplashScreen appSettings={appSettings} />;
  }

  const renderScreen = () => {
    switch (view.name) {
      case 'product': {
        const item = foodItems.find(item => item.id === view.id);
        if (!item) {
          window.history.back();
          return null;
        }
        return <ProductScreen item={item} allFoodItems={foodItems} onAddToCart={handleAddToCart} onBack={() => window.history.back()} onProductClick={(id) => navigateToView({ name: 'product', id })} appSettings={appSettings} />;
      }
      case 'admin':
        return <AdminScreen 
          currentUser={currentUser!}
          onExitAdmin={() => window.history.back()}
          foodItems={foodItems} setFoodItems={setFoodItems}
          orders={orders} setOrders={setOrders}
          reels={reels} setReels={setReels}
          users={users} setUsers={setUsers}
          appSettings={appSettings} setAppSettings={setAppSettings}
          customPages={customPages} setCustomPages={setCustomPages}
        />;
      case 'checkout':
        return <CheckoutScreen cartItems={cartItems} user={currentUser!} onPlaceOrder={handlePlaceOrder} onBack={() => window.history.back()} />;
      case 'confirmation':
        return <OrderConfirmationScreen onAnimationEnd={() => {
            navigate({ name: 'main' }, true);
            setActiveTab(Tab.Orders);
        }} />;
      case 'track': {
        const order = orders.find(o => o.id === view.id);
         if (!order) {
          window.history.back();
          return null;
        }
        return <TrackOrderScreen order={order} onBack={() => window.history.back()} onCompleteOrder={(id) => {
            setOrders(currentOrders => currentOrders.map(o => o.id === id ? {...o, status: OrderStatus.Completed} : o));
            showToast(`Order #${id} marked as completed!`);
        }} />;
      }
      case 'deals':
        return <DealsScreen foodItems={foodItems} onFoodItemClick={(id) => navigateToView({ name: 'product', id })} onAddToCart={handleAddToCart} onBack={() => window.history.back()} appSettings={appSettings} />;
      case 'auth':
          return <AuthScreen 
            onLogin={handleLogin} 
            onSignup={handleSignup}
            onCancel={() => window.history.back()}
          />;
      case 'editProfile':
          return <EditProfileScreen user={currentUser!} onSave={handleUpdateUser} onBack={() => window.history.back()} />;
      case 'addresses':
          return <AddressesScreen user={currentUser!} onUpdateUser={handleUpdateUser} onBack={() => window.history.back()} />;
      case 'payments':
          return <PaymentsScreen onBack={() => window.history.back()} />;
      case 'customPage': {
          const page = customPages.find(p => p.id === view.id);
          if (!page) {
              window.history.back();
              return null;
          }
          return <CustomPageScreen page={page} onBack={() => window.history.back()} />;
      }
      case 'main':
      default:
        switch (activeTab) {
          case Tab.Home:
            return <HomeScreen 
                foodItems={foodItems} 
                onFoodItemClick={(id) => navigateToView({ name: 'product', id })} 
                onAddToCart={handleAddToCart}
                appSettings={appSettings}
            />;
          case Tab.Orders:
            return <OrdersScreen orders={orders.filter(o => o.deliveryType === 'Home Delivery' || o.deliveryType === 'In-Store Pickup')} onTrackOrder={(id) => navigateToView({ name: 'track', id })} />;
          case Tab.Cart:
            return <CartScreen cartItems={cartItems} setCartItems={setCartItems} onCheckout={() => navigateToView({ name: 'checkout' })}/>;
          case Tab.Reels:
              return <ReelsScreen 
                  reels={reels} 
                  setReels={setReels} 
                  currentUser={currentUser} 
                  onRequestLogin={() => navigateToView({ name: 'auth' })}
              />;
          case Tab.Account:
            return <AccountScreen 
                user={currentUser!} 
                customPages={customPages}
                onLogout={handleLogout} 
                onEditProfile={() => navigateToView({ name: 'editProfile' })}
                onShowAddresses={() => navigateToView({ name: 'addresses' })}
                onShowPayments={() => navigateToView({ name: 'payments' })}
                onShowDeals={() => navigateToView({ name: 'deals' })} 
                onShowAdmin={() => navigateToView({ name: 'admin' })}
                onShowCustomPage={(id) => navigateToView({ name: 'customPage', id })}
            />;
          default:
            return null;
        }
    }
  };

  return (
    <div className="h-screen w-screen bg-[#F9F9F9] flex flex-col font-sans overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-20">
            {renderScreen()}
        </main>
        {view.name === 'main' && <BottomNav activeTab={activeTab} setActiveTab={navigateToTab} cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} />}
        
        {/* Overlays */}
        {toast && <ToastNotification key={toast.key} message={toast.message} onClose={() => setToast(null)} />}
        <PromoModal 
          visible={isPromoVisible} 
          onClose={() => {
            setIsPromoVisible(false);
            promoShownRef.current = true;
          }}
          onNavigate={() => {
            setIsPromoVisible(false);
            promoShownRef.current = true;
            navigateToView({ name: 'deals' });
          }}
        />
    </div>
  );
};

export default App;
