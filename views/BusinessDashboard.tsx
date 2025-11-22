
import React, { useState } from 'react';
import { Product, User, Order, OrderStatus, FulfillmentMethod } from '../types';
import { Button } from '../components/Button';
import { Plus, Package, DollarSign, Trash2, Image as ImageIcon, ShoppingBag, Clock, CheckCircle, Truck, Store, TrendingUp, BarChart3 } from 'lucide-react';

interface DashboardProps {
  user: User;
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const BusinessDashboard: React.FC<DashboardProps> = ({ 
  user, 
  products, 
  orders, 
  onAddProduct, 
  onDeleteProduct,
  onUpdateOrderStatus 
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'analytics'>('inventory');
  
  // Filter products for this business
  const myProducts = products.filter(p => p.businessId === user.id || (user.id.length > 5 && p.businessName === 'Sunny Side Farms')); 
  
  // Filter orders for this business
  // Check if any item in the order belongs to this business
  const myOrders = orders.filter(order => 
    order.items.some(item => item.businessId === user.id || (user.id.length > 5 && item.businessName === 'Sunny Side Farms'))
  ).sort((a, b) => b.date - a.date);

  const activeOrdersCount = myOrders.filter(o => o.status !== OrderStatus.DELIVERED).length;

  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [newItem, setNewItem] = useState<{
    name: string;
    price: string;
    description: string;
    category: string;
    imageUrl: string;
    dietary: string[];
  }>({
    name: '',
    price: '',
    description: '',
    category: 'Produce',
    imageUrl: '',
    dietary: []
  });

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Nut-Free', 'Dairy-Free'];

  const handleDietaryToggle = (option: string) => {
    setNewItem(prev => {
      const current = prev.dietary;
      if (current.includes(option)) {
        return { ...prev, dietary: current.filter(d => d !== option) };
      } else {
        return { ...prev, dietary: [...current, option] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate image if none provided
    const finalImageUrl = newItem.imageUrl.trim() 
      ? newItem.imageUrl 
      : `https://image.pollinations.ai/prompt/delicious fresh ${encodeURIComponent(newItem.name)} food photography?width=400&height=300&nologo=true`;

    const product: Product = {
      id: Date.now().toString(),
      businessId: user.id,
      businessName: user.name,
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      unit: 'each',
      category: newItem.category,
      imageUrl: finalImageUrl,
      available: true,
      location: user.location || 'Toronto',
      dietary: newItem.dietary
    };
    onAddProduct(product);
    setNewItem({ name: '', price: '', description: '', category: 'Produce', imageUrl: '', dietary: [] });
    setShowForm(false);
  };

  // Analytics Calculation
  const calculateAnalytics = () => {
    let totalRevenue = 0;
    let itemsSold = 0;
    const productPerformance: Record<string, number> = {};

    myOrders.forEach(order => {
        order.items.forEach(item => {
            // Check if item belongs to this business
            if (item.businessId === user.id || (user.id.length > 5 && item.businessName === 'Sunny Side Farms')) {
                totalRevenue += item.price * item.quantity;
                itemsSold += item.quantity;
                productPerformance[item.name] = (productPerformance[item.name] || 0) + item.quantity;
            }
        });
    });

    const topProducts = Object.entries(productPerformance)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return { totalRevenue, itemsSold, topProducts };
  };

  const { totalRevenue, itemsSold, topProducts } = calculateAnalytics();

  const renderAnalytics = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="mb-6">
         <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sales & Analytics</h2>
         <p className="text-gray-600 dark:text-gray-400">Overview of your business performance.</p>
       </div>
       
       {/* Cards Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                   <DollarSign size={64} className="text-green-600 dark:text-green-400" />
               </div>
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Revenue</p>
               <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">${totalRevenue.toFixed(2)}</p>
               <p className="text-xs text-green-600 dark:text-green-500 mt-1 flex items-center">
                   <TrendingUp size={14} className="mr-1" /> +12% from last month
               </p>
           </div>
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Package size={64} className="text-blue-600 dark:text-blue-400" />
               </div>
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Items Sold</p>
               <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{itemsSold}</p>
               <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">Across {myOrders.length} orders</p>
           </div>
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                   <BarChart3 size={64} className="text-purple-600 dark:text-purple-400" />
               </div>
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg. Order Value</p>
               <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                 ${myOrders.length > 0 ? (totalRevenue / myOrders.length).toFixed(2) : '0.00'}
               </p>
           </div>
       </div>

       {/* Top Products */}
       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
           <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
               <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                   <TrendingUp size={18} className="mr-2 text-gray-500" /> Top Selling Products
               </h3>
           </div>
           <div className="p-6">
               {topProducts.length > 0 ? (
                   <ul className="space-y-4">
                       {topProducts.map(([name, qty], index) => (
                           <li key={name} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                               <div className="flex items-center">
                                   <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 ${
                                       index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                       index === 1 ? 'bg-gray-100 text-gray-700' :
                                       index === 2 ? 'bg-orange-100 text-orange-700' :
                                       'bg-gray-50 text-gray-500'
                                   }`}>
                                       {index + 1}
                                   </span>
                                   <span className="font-medium text-gray-900 dark:text-white">{name}</span>
                               </div>
                               <div className="text-right">
                                   <span className="block font-bold text-gray-900 dark:text-white">{qty} sold</span>
                               </div>
                           </li>
                       ))}
                   </ul>
               ) : (
                   <div className="text-center py-8">
                       <BarChart3 className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                       <p className="text-gray-500 dark:text-gray-400">No sales data available yet.</p>
                   </div>
               )}
           </div>
       </div>
    </div>
  );

  const renderInventory = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Inventory Management</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Post New Item'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 animate-fade-in-down">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add New Product</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
              <input 
                required 
                type="text" 
                value={newItem.name} 
                onChange={e => setNewItem({...newItem, name: e.target.value})} 
                className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500"
                placeholder="e.g. Fresh Strawberries"
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price ($)</label>
               <input 
                required 
                type="number" 
                step="0.01" 
                value={newItem.price} 
                onChange={e => setNewItem({...newItem, price: e.target.value})} 
                className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500"
                placeholder="0.00"
              />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
               <textarea 
                required 
                value={newItem.description} 
                onChange={e => setNewItem({...newItem, description: e.target.value})} 
                className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500" 
                rows={3}
                placeholder="Describe your product..."
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
               <select 
                value={newItem.category} 
                onChange={e => setNewItem({...newItem, category: e.target.value})} 
                className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500"
              >
                 <option>Produce</option>
                 <option>Bakery</option>
                 <option>Dairy & Eggs</option>
                 <option>Meat</option>
                 <option>Pantry</option>
                 <option>Prepared Meals</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Photo URL (Optional)</label>
               <div className="relative mt-1 rounded-md shadow-sm">
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                   <ImageIcon className="h-4 w-4 text-gray-400" />
                 </div>
                 <input 
                  type="url" 
                  value={newItem.imageUrl} 
                  onChange={e => setNewItem({...newItem, imageUrl: e.target.value})} 
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-10 bg-white dark:bg-gray-700 border shadow-sm p-2 text-gray-900 dark:text-white focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  placeholder="https://... (Leave empty to auto-generate)"
                />
               </div>
               <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">We'll generate a photo if you don't have one.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dietary & Allergens</label>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleDietaryToggle(option)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                      newItem.dietary.includes(option)
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">List Product</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Active Listings</h3>
          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">{myProducts.length} Items</span>
        </div>
        
        {myProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Package className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p>You haven't listed any products yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {myProducts.map(product => (
              <li key={product.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between">
                <div className="flex items-center">
                  <img src={product.imageUrl} alt="" className="h-16 w-16 rounded-lg object-cover mr-4 bg-gray-100 dark:bg-gray-700" />
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">{product.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{product.category} • {product.description}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {product.dietary && product.dietary.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <DollarSign size={14} className="mr-1" />
                      {product.price.toFixed(2)} / {product.unit}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );

  const renderOrders = () => (
    <>
       <div className="mb-6">
         <h2 className="text-xl font-bold text-gray-900 dark:text-white">Incoming Orders</h2>
         <p className="text-gray-600 dark:text-gray-400">Manage pickup and delivery requests.</p>
       </div>

       {myOrders.length === 0 ? (
         <div className="p-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p>No orders yet. Products listed will appear here when purchased.</p>
         </div>
       ) : (
         <div className="space-y-6">
           {myOrders.map(order => (
             <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
               {/* Order Header */}
               <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
                 <div className="flex items-center space-x-4">
                    <span className="font-mono text-sm font-bold text-gray-500 dark:text-gray-400">#{order.id.slice(-4).toUpperCase()}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {order.status}
                    </span>
                 </div>
                 <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </div>
               </div>

               <div className="p-6 flex flex-col md:flex-row gap-6">
                 {/* Customer & Items */}
                 <div className="flex-grow">
                    <h4 className="text-sm text-gray-500 dark:text-gray-400 uppercase font-bold mb-2">Customer Order</h4>
                    <div className="mb-4">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{order.customerName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{order.items.length} items • Total: ${order.total.toFixed(2)}</p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                      <ul className="space-y-2">
                        {order.items.map((item, idx) => (
                           <li key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-800 dark:text-gray-200"><span className="font-bold">{item.quantity}x</span> {item.name}</span>
                              <span className="text-gray-600 dark:text-gray-400">${(item.price * item.quantity).toFixed(2)}</span>
                           </li>
                        ))}
                      </ul>
                    </div>
                 </div>

                 {/* Actions & Fulfillment */}
                 <div className="md:w-72 flex flex-col border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-6 md:pt-0 md:pl-6">
                    <div className="mb-6">
                       <h4 className="text-sm text-gray-500 dark:text-gray-400 uppercase font-bold mb-2">Fulfillment</h4>
                       <div className="flex items-center text-gray-900 dark:text-white font-medium">
                          {order.fulfillmentMethod === FulfillmentMethod.DELIVERY ? (
                             <><Truck className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" /> Delivery</>
                          ) : (
                             <><Store className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" /> Pickup</>
                          )}
                       </div>
                    </div>

                    <div className="mt-auto space-y-3">
                       {order.status === OrderStatus.CONFIRMED && (
                          <Button 
                            onClick={() => onUpdateOrderStatus(order.id, OrderStatus.PREPARING)}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                             Start Preparing
                          </Button>
                       )}

                       {order.status === OrderStatus.PREPARING && order.fulfillmentMethod === FulfillmentMethod.PICKUP && (
                          <Button 
                            onClick={() => onUpdateOrderStatus(order.id, OrderStatus.READY_FOR_PICKUP)}
                            className="w-full bg-orange-500 hover:bg-orange-600"
                          >
                             Mark Ready for Pickup
                          </Button>
                       )}

                       {order.status === OrderStatus.PREPARING && order.fulfillmentMethod === FulfillmentMethod.DELIVERY && (
                           <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm">
                             Waiting for Driver...
                           </div>
                       )}

                       {order.status === OrderStatus.READY_FOR_PICKUP && (
                          <div className="space-y-2">
                            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-lg text-sm font-medium">
                               <Clock className="w-4 h-4 inline mr-1" /> Waiting for Customer
                            </div>
                            <Button 
                               onClick={() => onUpdateOrderStatus(order.id, OrderStatus.DELIVERED)}
                               className="w-full bg-green-600 hover:bg-green-700"
                            >
                               Mark as Picked Up
                            </Button>
                          </div>
                       )}
                       
                       {order.status === OrderStatus.ON_THE_WAY && (
                          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm font-medium">
                             <Truck className="w-4 h-4 inline mr-1" /> With Driver
                          </div>
                       )}
                       
                       {order.status === OrderStatus.DELIVERED && (
                          <div className="text-center p-3 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg text-sm font-medium">
                             <CheckCircle className="w-4 h-4 inline mr-1" /> Completed
                          </div>
                       )}
                    </div>
                 </div>
               </div>
             </div>
           ))}
         </div>
       )}
    </>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your farm and orders for {user.name}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8 w-fit overflow-x-auto">
         <button
           onClick={() => setActiveTab('inventory')}
           className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
             activeTab === 'inventory' 
               ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
               : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
           }`}
         >
           My Inventory
         </button>
         <button
           onClick={() => setActiveTab('orders')}
           className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center ${
             activeTab === 'orders' 
               ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
               : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
           }`}
         >
           Incoming Orders
           {activeOrdersCount > 0 && (
             <span className="ml-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
               {activeOrdersCount}
             </span>
           )}
         </button>
         <button
           onClick={() => setActiveTab('analytics')}
           className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center ${
             activeTab === 'analytics' 
               ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
               : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
           }`}
         >
           Sales & Analytics
         </button>
      </div>

      {activeTab === 'inventory' && renderInventory()}
      {activeTab === 'orders' && renderOrders()}
      {activeTab === 'analytics' && renderAnalytics()}
    </div>
  );
};
