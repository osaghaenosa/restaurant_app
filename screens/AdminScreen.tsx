
import React, { useState } from 'react';
import { FoodItem, Order, AdminSection, OrderStatus, Reel, UserProfile, AppSettings, CustomPage } from '../types';
import { Icon } from '../components/Icons';

// PROPS INTERFACE
interface AdminScreenProps {
  currentUser: UserProfile;
  onExitAdmin: () => void;
  foodItems: FoodItem[];
  setFoodItems: React.Dispatch<React.SetStateAction<FoodItem[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  reels: Reel[];
  setReels: React.Dispatch<React.SetStateAction<Reel[]>>;
  users: UserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  appSettings: AppSettings;
  setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  customPages: CustomPage[];
  setCustomPages: React.Dispatch<React.SetStateAction<CustomPage[]>>;
}

// --- DASHBOARD ---
const Dashboard: React.FC<Pick<AdminScreenProps, 'foodItems'|'orders'|'users'|'reels'>> = ({ foodItems, orders, users, reels }) => {
    const totalSales = orders.filter(o => o.status === OrderStatus.Completed).reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === OrderStatus.Pending).length;

    const StatCard = ({ title, value, iconName }: {title: string, value: string | number, iconName: React.ComponentProps<typeof Icon>['name']}) => (
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 border border-[#D6EAF8]">
            <div className="bg-[#D6EAF8] p-3 rounded-full">
                <Icon name={iconName} className="w-7 h-7 text-[#2874A6]" />
            </div>
            <div>
                <p className="text-sm font-semibold text-[#666]">{title}</p>
                <p className="text-2xl font-bold text-[#333]">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#333]">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`₦${totalSales.toLocaleString()}`} iconName="cart" />
                <StatCard title="Pending Orders" value={pendingOrders} iconName="orders" />
                <StatCard title="Total Users" value={users.length} iconName="account" />
                <StatCard title="Menu Items" value={foodItems.length} iconName="edit" />
            </div>
        </div>
    );
};


// --- MANAGER COMPONENTS ---

// 1. MENU MANAGER
const MenuManager: React.FC<Pick<AdminScreenProps, 'foodItems' | 'setFoodItems'>> = ({ foodItems, setFoodItems }) => {
    const [itemToEdit, setItemToEdit] = useState<FoodItem | Partial<FoodItem> | null>(null);

    const handleSave = (itemData: FoodItem) => {
        if ('id' in itemData && itemData.id) { // Editing existing item
            setFoodItems(items => items.map(i => i.id === itemData.id ? itemData : i));
        } else { // Creating new item
            setFoodItems(items => [...items, { ...itemData, id: `food_${Date.now()}` }]);
        }
        setItemToEdit(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setFoodItems(items => items.filter(i => i.id !== id));
        }
    };
    
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#333]">Menu Items</h2>
                <button onClick={() => setItemToEdit({})} className="bg-[#2874A6] text-white font-semibold py-2 px-4 rounded-lg flex items-center shadow hover:bg-opacity-90 transition">
                  <Icon name="add" className="w-5 h-5 mr-2"/> Add Item
                </button>
            </div>
            
            {itemToEdit && <ItemForm item={itemToEdit} onSave={handleSave} onCancel={() => setItemToEdit(null)} />}

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-[#D6EAF8]">
                    <thead className="bg-[#D6EAF8]">
                        <tr>
                            {['Image', 'Name', 'Category', 'Price', 'Actions'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-bold text-[#333] uppercase tracking-wider">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {foodItems.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4"><img src={item.imageUrl} alt={item.name} className="w-16 h-12 object-cover rounded-md"/></td>
                                <td className="px-6 py-4 font-medium text-[#333]">{item.name}</td>
                                <td className="px-6 py-4 text-[#666]">{item.category}</td>
                                <td className="px-6 py-4 text-[#666]">₦{item.price.toFixed(0)}</td>
                                <td className="px-6 py-4 flex items-center space-x-2">
                                    <button onClick={() => setItemToEdit(item)} className="p-2 text-[#5DADE2] hover:text-[#2874A6]"><Icon name="edit" className="w-5 h-5"/></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:text-red-700"><Icon name="trash" className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ItemForm: React.FC<{item: FoodItem | Partial<FoodItem>, onSave: (item: FoodItem) => void, onCancel: () => void}> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.imageUrl) {
            alert('Image is required.');
            return;
        }
        onSave(formData as FoodItem);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({...formData, imageUrl: reader.result as string});
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-[#F9F9F9] border border-[#D6EAF8] rounded-lg space-y-4 mb-6">
            <h3 className="text-lg font-bold text-[#333]">{item.id ? 'Edit' : 'Create'} Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="p-2 border rounded-md" required/>
                <input type="text" placeholder="Category" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="p-2 border rounded-md" required/>
                <input type="number" step="1" placeholder="Price" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0 })} className="p-2 border rounded-md" required/>
                <input type="number" placeholder="Discount % (optional)" value={formData.discountPercent || ''} onChange={e => setFormData({...formData, discountPercent: parseInt(e.target.value) || undefined })} className="p-2 border rounded-md"/>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <div className="mt-1 flex items-center space-x-4 p-2 border border-dashed rounded-md">
                        {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="w-24 h-20 object-cover rounded-md bg-gray-100"/>}
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#5DADE2] hover:text-[#2874A6]">
                                <span>{formData.imageUrl ? 'Change image' : 'Upload an image'}</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>
                     {!formData.imageUrl && <p className="text-xs text-red-500 mt-1">Image is required.</p>}
                </div>
            </div>
            <textarea placeholder="Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded-md" rows={3} required />
            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-[#333] py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-[#5DADE2] text-white py-2 px-4 rounded-lg">Save</button>
            </div>
        </form>
    );
};


// 2. ORDERS MANAGER
const OrderManager: React.FC<Pick<AdminScreenProps, 'orders' | 'setOrders'>> = ({ orders, setOrders }) => {
    const handleStatusChange = (orderId: string, status: OrderStatus) => {
        setOrders(ords => ords.map(o => o.id === orderId ? { ...o, status } : o));
    };
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#333]">Order Management</h2>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                 <table className="min-w-full divide-y divide-[#D6EAF8]">
                    <thead className="bg-[#D6EAF8]">
                        <tr>
                            {['Order ID', 'Date', 'Total', 'Items', 'Status'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-bold text-[#333] uppercase tracking-wider">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map(order => (
                             <tr key={order.id}>
                                <td className="px-6 py-4 font-medium text-[#333]">{order.id}</td>
                                <td className="px-6 py-4 text-[#666]">{order.date}</td>
                                <td className="px-6 py-4 text-[#666]">₦{order.total.toFixed(0)}</td>
                                <td className="px-6 py-4 text-[#666] text-sm">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</td>
                                <td className="px-6 py-4">
                                     <select value={order.status} onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)} className="p-2 border border-gray-300 rounded-lg bg-white">
                                        {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// 3. REELS MANAGER
const ReelsManager: React.FC<Pick<AdminScreenProps, 'reels' | 'setReels'>> = ({ reels, setReels }) => {
    const [reelToEdit, setReelToEdit] = useState<Partial<Reel> | null>(null);

    const handleSave = (reelData: Partial<Reel>) => {
        if (!reelData.title || (!reelData.videoUrl && !reelData.imageUrl)) {
            alert('Title and either a Video URL or Image URL are required.');
            return;
        }
        setReels(reels => [
            ...reels,
            {
                id: `reel_${Date.now()}`,
                title: reelData.title!,
                videoUrl: reelData.videoUrl,
                imageUrl: reelData.imageUrl,
                likedBy: [],
                comments: [],
                user: { name: 'Admin', avatar: 'https://i.pravatar.cc/150?u=admin' }
            } as Reel
        ]);
        setReelToEdit(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this reel?')) {
            setReels(reels => reels.filter(r => r.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#333]">Reels Management</h2>
                <button onClick={() => setReelToEdit({})} className="bg-[#2874A6] text-white font-semibold py-2 px-4 rounded-lg flex items-center shadow hover:bg-opacity-90 transition">
                    <Icon name="add" className="w-5 h-5 mr-2" /> Add Reel
                </button>
            </div>

            {reelToEdit && (
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSave(reelToEdit); }}
                    className="p-4 bg-[#F9F9F9] border border-[#D6EAF8] rounded-lg space-y-4 mb-6"
                >
                    <h3 className="text-lg font-bold text-[#333]">Create Reel</h3>
                    <input type="text" placeholder="Title" value={reelToEdit.title || ''} onChange={e => setReelToEdit({ ...reelToEdit, title: e.target.value })} className="w-full p-2 border rounded-md" required />
                    <input type="text" placeholder="Video URL (optional)" value={reelToEdit.videoUrl || ''} onChange={e => setReelToEdit({ ...reelToEdit, videoUrl: e.target.value })} className="w-full p-2 border rounded-md" />
                    <input type="text" placeholder="Image URL (optional)" value={reelToEdit.imageUrl || ''} onChange={e => setReelToEdit({ ...reelToEdit, imageUrl: e.target.value })} className="w-full p-2 border rounded-md" />
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={() => setReelToEdit(null)} className="bg-gray-200 text-[#333] py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-[#5DADE2] text-white py-2 px-4 rounded-lg">Save</button>
                    </div>
                </form>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-[#D6EAF8]">
                    <thead className="bg-[#D6EAF8]">
                        <tr>
                            {['Preview', 'Title', 'Likes', 'Comments', 'Actions'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-bold text-[#333] uppercase tracking-wider">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reels.map(reel => (
                            <tr key={reel.id}>
                                <td className="px-6 py-4">
                                    {reel.videoUrl ? <video src={reel.videoUrl} className="w-24 h-16 object-cover rounded-md bg-black" muted /> :
                                     reel.imageUrl ? <img src={reel.imageUrl} alt={reel.title} className="w-24 h-16 object-cover rounded-md bg-gray-200" /> : null}
                                </td>
                                <td className="px-6 py-4 font-medium text-[#333]">{reel.title}</td>
                                <td className="px-6 py-4 text-[#666]">{reel.likedBy.length}</td>
                                <td className="px-6 py-4 text-[#666]">{reel.comments.length}</td>
                                <td className="px-6 py-4 flex items-center space-x-2">
                                    <button onClick={() => handleDelete(reel.id)} className="p-2 text-red-500 hover:text-red-700"><Icon name="trash" className="w-5 h-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// 4. USER MANAGER
const UserManager: React.FC<Pick<AdminScreenProps, 'users' | 'setUsers' | 'currentUser'>> = ({ users, setUsers, currentUser }) => {
    const [showCompose, setShowCompose] = useState(false);
    const [userToEdit, setUserToEdit] = useState<UserProfile | null>(null);
    const isSuperAdmin = currentUser.role === 'superadmin';

    const formatDateTime = (isoString?: string) => {
        if (!isoString) return 'N/A';
        return new Date(isoString).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    };

    const handleSendBulkMessage = (subject: string, message: string) => {
        if (!subject || !message) {
            alert("Subject and message are required.");
            return;
        }
        alert(`Message Sent!\n\nSubject: ${subject}\n\nMessage has been simulated as sent to ${users.length} users.`);
        setShowCompose(false);
    }
    
    const handleSaveUser = (updatedUser: UserProfile) => {
        setUsers(prevUsers => prevUsers.map(u => u.email === userToEdit?.email ? updatedUser : u));
        setUserToEdit(null);
    }

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#333]">User Management ({users.length})</h2>
                <button onClick={() => setShowCompose(true)} className="bg-[#2874A6] text-white font-semibold py-2 px-4 rounded-lg flex items-center shadow hover:bg-opacity-90 transition">
                  <Icon name="comment" className="w-5 h-5 mr-2"/> Send Bulk Message
                </button>
            </div>

            {showCompose && <ComposeForm onSend={handleSendBulkMessage} onCancel={() => setShowCompose(false)} />}
            {userToEdit && isSuperAdmin && <UserEditModal user={userToEdit} onSave={handleSaveUser} onCancel={() => setUserToEdit(null)} />}
            
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-[#D6EAF8]">
                    <thead className="bg-[#D6EAF8]">
                        <tr>
                            {['Avatar', 'Name', 'Email', 'Role', 'Last Login', ...(isSuperAdmin ? ['Actions'] : [])].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-bold text-[#333] uppercase tracking-wider">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.email}>
                                <td className="px-6 py-4"><img src={user.avatarUrl} alt={user.name} className="w-10 h-10 object-cover rounded-full"/></td>
                                <td className="px-6 py-4 font-medium text-[#333]">{user.name}</td>
                                <td className="px-6 py-4 text-[#666]">{user.email}</td>
                                <td className="px-6 py-4 text-[#666] capitalize">{user.role}</td>
                                <td className="px-6 py-4 text-[#666]">{formatDateTime(user.lastLogin)}</td>
                                {isSuperAdmin && (
                                    <td className="px-6 py-4">
                                        <button onClick={() => setUserToEdit(user)} className="p-2 text-[#5DADE2] hover:text-[#2874A6]">
                                            <Icon name="edit" className="w-5 h-5"/>
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const UserEditModal: React.FC<{ user: UserProfile, onSave: (user: UserProfile) => void, onCancel: () => void }> = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState(user);
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = newPassword ? { ...formData, password: newPassword } : formData;
        onSave(finalData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-zoom-in">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-[#333]">Edit User: {user.name}</h3>
                    
                    <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded-md" required />
                    <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border rounded-md" required />
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as UserProfile['role'] })} className="w-full p-2 border rounded-md bg-white" required>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="superadmin">Super Admin</option>
                        </select>
                    </div>

                    <input type="password" placeholder="Set New Password (optional)" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-2 border rounded-md" />

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-200 text-[#333] py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-[#5DADE2] text-white py-2 px-4 rounded-lg">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ComposeForm: React.FC<{onSend: (subject: string, message: string) => void, onCancel: () => void}> = ({ onSend, onCancel }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSend(subject, message);
    };
    return (
        <form onSubmit={handleSubmit} className="p-4 bg-[#F9F9F9] border border-[#D6EAF8] rounded-lg space-y-4 mb-6">
            <h3 className="text-lg font-bold text-[#333]">Compose Announcement</h3>
            <div className="space-y-4">
                <input type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="p-2 border rounded-md w-full" required/>
                <textarea placeholder="Message to all users..." value={message} onChange={e => setMessage(e.target.value)} className="w-full p-2 border rounded-md" rows={4} required />
            </div>
            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-[#333] py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-[#5DADE2] text-white py-2 px-4 rounded-lg">Send Message</button>
            </div>
        </form>
    );
};


const CustomPageForm: React.FC<{ page: CustomPage | Partial<CustomPage>, onSave: (page: CustomPage) => void, onCancel: () => void }> = ({ page, onSave, onCancel }) => {
    const [formData, setFormData] = useState(page);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as CustomPage);
    };

    const icons: React.ComponentProps<typeof Icon>['name'][] = ['home', 'orders', 'cart', 'reels', 'account', 'tag', 'dashboard', 'edit'];

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-[#F9F9F9] border border-[#D6EAF8] rounded-lg space-y-4 mb-6">
            <h3 className="text-lg font-bold text-[#333]">{page.id ? 'Edit' : 'Create'} Page</h3>
            <input type="text" placeholder="Page Title" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="p-2 border rounded-md w-full" required />
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select value={formData.icon || 'tag'} onChange={e => setFormData({ ...formData, icon: e.target.value as CustomPage['icon'] })} className="p-2 border rounded-md w-full bg-white" required>
                    {icons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                </select>
            </div>
            <textarea placeholder="Page Content" value={formData.content || ''} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full p-2 border rounded-md" rows={5} required />
            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-[#333] py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-[#5DADE2] text-white py-2 px-4 rounded-lg">Save Page</button>
            </div>
        </form>
    );
};

// 5. SUPER ADMIN MANAGER
const SuperAdminManager: React.FC<Pick<AdminScreenProps, 'appSettings' | 'setAppSettings' | 'customPages' | 'setCustomPages'>> = ({ appSettings, setAppSettings, customPages, setCustomPages }) => {
    const [settings, setSettings] = useState(appSettings);
    const [pageToEdit, setPageToEdit] = useState<CustomPage | Partial<CustomPage> | null>(null);

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({...settings, [e.target.name]: e.target.value});
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettings({...settings, appLogoUrl: reader.result as string});
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        setAppSettings(settings);
        alert('App settings saved!');
    };

    const handleSavePage = (pageData: CustomPage) => {
        if ('id' in pageData && pageData.id) {
            setCustomPages(pages => pages.map(p => p.id === pageData.id ? pageData : p));
        } else {
            setCustomPages(pages => [...pages, { ...pageData, id: `page_${Date.now()}` }]);
        }
        setPageToEdit(null);
    };

    const handleDeletePage = (id: string) => {
        if (window.confirm('Are you sure you want to delete this custom page?')) {
            setCustomPages(pages => pages.filter(p => p.id !== id));
        }
    };
    
    return (
        <div className="space-y-8">
            <form onSubmit={handleSaveSettings} className="p-6 bg-white border border-[#D6EAF8] rounded-xl shadow-md space-y-4">
                <h2 className="text-2xl font-bold text-[#333]">App Branding & Content</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
                        <input type="text" name="appName" value={settings.appName} onChange={handleSettingsChange} className="w-full p-2 border rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Promo Title</label>
                        <input type="text" name="promoTitle" value={settings.promoTitle} onChange={handleSettingsChange} className="w-full p-2 border rounded-md"/>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Promo Subtitle</label>
                        <input type="text" name="promoSubtitle" value={settings.promoSubtitle} onChange={handleSettingsChange} className="w-full p-2 border rounded-md"/>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">App Logo</label>
                        <div className="mt-1 flex items-center space-x-4 p-2 border border-dashed rounded-md">
                            {settings.appLogoUrl && <img src={settings.appLogoUrl} alt="Logo Preview" className="w-20 h-20 object-contain rounded-md bg-gray-100"/>}
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="logo-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#5DADE2] hover:text-[#2874A6]">
                                    <span>{settings.appLogoUrl ? 'Change logo' : 'Upload a logo'}</span>
                                    <input id="logo-upload" name="logo-upload" type="file" className="sr-only" accept="image/*" onChange={handleLogoUpload} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-[#5DADE2] text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-[#2874A6] transition-colors">
                        Save App Settings
                    </button>
                </div>
            </form>

            <div className="p-6 bg-white border border-[#D6EAF8] rounded-xl shadow-md space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[#333]">Custom Pages</h2>
                    <button onClick={() => setPageToEdit({})} className="bg-[#2874A6] text-white font-semibold py-2 px-4 rounded-lg flex items-center shadow hover:bg-opacity-90 transition">
                        <Icon name="add" className="w-5 h-5 mr-2" /> Add Page
                    </button>
                </div>

                {pageToEdit && <CustomPageForm page={pageToEdit} onSave={handleSavePage} onCancel={() => setPageToEdit(null)} />}

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#D6EAF8]">
                        <thead className="bg-[#D6EAF8]">
                            <tr>
                                {['Icon', 'Title', 'Actions'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-bold text-[#333] uppercase tracking-wider">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customPages.map(page => (
                                <tr key={page.id}>
                                    <td className="px-6 py-4"><Icon name={page.icon} className="w-6 h-6 text-[#2874A6]" /></td>
                                    <td className="px-6 py-4 font-medium text-[#333]">{page.title}</td>
                                    <td className="px-6 py-4 flex items-center space-x-2">
                                        <button onClick={() => setPageToEdit(page)} className="p-2 text-[#5DADE2] hover:text-[#2874A6]"><Icon name="edit" className="w-5 h-5" /></button>
                                        <button onClick={() => handleDeletePage(page.id)} className="p-2 text-red-500 hover:text-red-700"><Icon name="trash" className="w-5 h-5" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// --- MAIN ADMIN SCREEN COMPONENT ---
export const AdminScreen: React.FC<AdminScreenProps> = (props) => {
    const { currentUser, onExitAdmin, ...restProps } = props;
    const [activeSection, setActiveSection] = useState(AdminSection.Dashboard);
    const isSuperAdmin = currentUser.role === 'superadmin';

    const navItems = [
        { section: AdminSection.Dashboard, icon: 'dashboard' as const, label: 'Dashboard' },
        { section: AdminSection.Menu, icon: 'edit' as const, label: 'Menu' },
        { section: AdminSection.Orders, icon: 'orders' as const, label: 'Orders' },
        { section: AdminSection.Reels, icon: 'reels' as const, label: 'Reels' },
        { section: AdminSection.Users, icon: 'account' as const, label: 'Users' },
        ...(isSuperAdmin ? [{ section: AdminSection.SuperAdmin, icon: 'tag' as const, label: 'Super Admin' }] : []),
    ];

    const renderSection = () => {
        switch (activeSection) {
            case AdminSection.Dashboard: return <Dashboard {...restProps} />;
            case AdminSection.Menu: return <MenuManager {...restProps} />;
            case AdminSection.Orders: return <OrderManager {...restProps} />;
            case AdminSection.Reels: return <ReelsManager {...restProps} />;
            case AdminSection.Users: return <UserManager {...restProps} currentUser={currentUser} />;
            case AdminSection.SuperAdmin: return <SuperAdminManager {...restProps} />;
            default: return <Dashboard {...restProps} />;
        }
    };
    
    return (
        <div className="fixed inset-0 bg-[#F9F9F9] flex z-40 animate-slide-in">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg flex flex-col">
                <div className="p-4 border-b border-[#D6EAF8] flex items-center space-x-3">
                    <img src={props.appSettings.appLogoUrl} alt="Logo" className="w-10 h-10 object-contain"/>
                    <span className="font-bold text-lg text-[#333]">{props.appSettings.appName}</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map(({ section, icon, label }) => (
                         <button
                            key={section}
                            onClick={() => setActiveSection(section)}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left font-semibold transition-colors ${activeSection === section ? 'bg-[#5DADE2] text-white shadow' : 'text-[#333] hover:bg-[#D6EAF8]'}`}
                        >
                            <Icon name={icon} className="w-6 h-6"/>
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-[#D6EAF8]">
                     <button onClick={onExitAdmin} className="w-full flex items-center space-x-3 p-3 rounded-lg text-left font-semibold text-red-500 hover:bg-red-50 transition-colors">
                        <Icon name="logout" className="w-6 h-6"/>
                        <span>Exit Admin</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {renderSection()}
            </main>
        </div>
    );
};
