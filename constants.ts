

import { FoodItem, Order, OrderStatus, UserProfile, DeliveryType, Reel, PaymentMethod, Comment, AppSettings } from './types';

export const MOCK_USER_PROFILE: UserProfile = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  phone: '+1 (555) 123-4567',
  addresses: ['123 Flavor St, Foodie City, 12345', '456 Culinary Ave, Gourmet Town, 67890'],
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  password: 'password123',
  lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  role: 'superadmin',
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
    appName: 'Ruxx Restaurants',
    appLogoUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiMyODc0QTYiIGQ9Ik0xNiA3VjNIMThWN0MxOCAxMC4zMSAxNS4zMSAxMyAxMiAxM0M4LjY5IDEzIDYgMTAuMzEgNiA3VjNIOFY3QzggOS4yMSA5Ljc5IDExIDEyIDExUzE2IDkuMjEgMTYgN1ptLTYgOFYxM0g0VjE1SDEwVjIxSDEyVjE1SDE0VjEzSDEyVjExWiIvPjwvc3ZnPg==',
    promoTitle: 'Free Delivery!',
    promoSubtitle: 'on all orders over ₦2500',
};

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
    { id: 'pm_1', type: 'visa', last4: '4242', expiry: '12/26' },
    { id: 'pm_2', type: 'mastercard', last4: '5555', expiry: '08/25' },
];


export const MOCK_FOOD_ITEMS: FoodItem[] = [
  { id: '1', name: 'Gourmet Burger', category: 'Burgers', price: 1599, imageUrl: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', description: 'A juicy, handcrafted beef patty with melted cheddar cheese, crisp lettuce, fresh tomatoes, and our signature sauce, all nestled in a toasted brioche bun.', discountPercent: 20 },
  { id: '2', name: 'Margherita Pizza', category: 'Pizza', price: 1850, imageUrl: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', description: 'Classic Italian pizza with a thin crust, San Marzano tomato sauce, fresh mozzarella, basil leaves, and a drizzle of extra virgin olive oil.', discountPercent: 15 },
  { id: '3', name: 'Caesar Salad', category: 'Salads', price: 1200, imageUrl: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', description: 'Crisp romaine lettuce tossed in a creamy Caesar dressing, topped with crunchy croutons, and shaved Parmesan cheese. A timeless classic.' },
  { id: '4', name: 'Sushi Platter', category: 'Sushi', price: 2500, imageUrl: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', description: 'An elegant assortment of fresh nigiri and maki rolls, featuring salmon, tuna, and avocado. Served with wasabi, ginger, and soy sauce.' },
  { id: '5', name: 'Spaghetti Carbonara', category: 'Pasta', price: 1675, imageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', description: 'Perfectly al dente spaghetti in a rich and creamy egg sauce with crispy pancetta and a generous amount of Pecorino Romano cheese.' },
  { id: '6', name: 'Chocolate Lava Cake', category: 'Desserts', price: 899, imageUrl: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', description: 'A decadent, warm chocolate cake with a gooey, molten center, dusted with powdered sugar and served with a side of fresh berries.' },
];

export const MOCK_REELS: Reel[] = [
  {
    id: 'reel1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-top-down-view-of-a-person-slicing-a-bacon-and-cheese-pizza-23214-large.mp4',
    title: 'The perfect pizza slice!',
    likedBy: ['alex.doe@example.com', 'someone.else@example.com'],
    comments: [
        { user: { email: 'alex.doe@example.com', name: 'Alex Doe', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }, text: 'Looks delicious!', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
        { user: { email: 'jane.doe@example.com', name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=jane_doe' }, text: 'I want one!', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() }
    ],
    user: {
      name: 'Chef Leo',
      avatar: 'https://i.pravatar.cc/150?u=chef_leo'
    }
  },
    {
    id: 'reel2_img',
    imageUrl: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Our Famous Gourmet Burger!',
    likedBy: [],
    comments: [],
    user: {
      name: 'Grill Master Gary',
      avatar: 'https://i.pravatar.cc/150?u=gary'
    }
  },
  {
    id: 'reel2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-making-a-cocktail-in-a-bar-4523-large.mp4',
    title: 'Crafting our signature cocktail',
    likedBy: [],
    comments: [],
    user: {
      name: 'Mixologist Mia',
      avatar: 'https://i.pravatar.cc/150?u=mixologist_mia'
    }
  },
    {
    id: 'reel4_vid',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-dessert-pastry-being-prepared-4328-large.mp4',
    title: 'Sweet tooth calling!',
    likedBy: [],
    comments: [],
    user: {
      name: 'Pastry Peggy',
      avatar: 'https://i.pravatar.cc/150?u=peggy'
    }
  },
  {
    id: 'reel3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-flipping-a-pancake-4228-large.mp4',
    title: 'Pancake flip skills on point!',
    likedBy: ['alex.doe@example.com'],
    comments: [],
    user: {
      name: 'Breakfast Barry',
      avatar: 'https://i.pravatar.cc/150?u=barry'
    }
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-12345',
    items: [{ name: 'Gourmet Burger', quantity: 1, price: 1599 }, { name: 'Caesar Salad', quantity: 1, price: 1200 }],
    total: 2799,
    date: '2024-07-20',
    status: OrderStatus.Completed,
    deliveryType: DeliveryType.Delivery,
    deliveryAddress: '123 Flavor St, Foodie City, 12345',
  },
  {
    id: 'ORD-12346',
    items: [{ name: 'Margherita Pizza', quantity: 2, price: 1850 }],
    total: 3700,
    date: '2024-07-21',
    status: OrderStatus.Pending,
    deliveryType: DeliveryType.Pickup,
  },
    {
    id: 'ORD-12347',
    items: [{ name: 'Sushi Platter', quantity: 1, price: 2500 }],
    total: 2500,
    date: '2024-07-18',
    status: OrderStatus.Cancelled,
    deliveryType: DeliveryType.Delivery,
    deliveryAddress: '456 Culinary Ave, Gourmet Town, 67890',
  },
];