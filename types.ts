
export enum Tab {
  Home = 'Home',
  Reels = 'Reels',
  Orders = 'Orders',
  Cart = 'Cart',
  Account = 'Account',
}

export enum AdminSection {
  Dashboard = 'Dashboard',
  Menu = 'Menu',
  Orders = 'Orders',
  Reels = 'Reels',
  Users = 'Users',
  SuperAdmin = 'Super Admin',
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string;
  discountPercent?: number;
}

export interface Comment {
  user: {
    email: string;
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
}

export interface Reel {
  id: string;
  videoUrl?: string;
  imageUrl?: string;
  title: string;
  likedBy: string[]; // email of users who liked
  comments: Comment[];
  user: {
    name: string;
    avatar: string;
  };
}

export enum OrderStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export enum DeliveryType {
  Delivery = 'Home Delivery',
  Pickup = 'In-Store Pickup',
}

export interface Order {
  id: string;
  items: { name: string; quantity: number, price: number }[];
  total: number;
  date: string;
  status: OrderStatus;
  deliveryType: DeliveryType;
  deliveryAddress?: string;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  addresses: string[];
  avatarUrl: string;
  password?: string;
  lastLogin?: string;
  role: 'user' | 'admin' | 'superadmin';
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard';
  last4: string;
  expiry: string;
}

export interface AppSettings {
    appName: string;
    appLogoUrl: string;
    promoTitle: string;
    promoSubtitle: string;
}

export interface CustomPage {
    id: string;
    title: string;
    icon: 'home' | 'orders' | 'cart' | 'reels' | 'account' | 'tag' | 'dashboard' | 'edit';
    content: string;
}
