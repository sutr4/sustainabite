
import React, { useState, useEffect, useMemo } from 'react';
import { Auth } from './views/Auth';
import { Navbar } from './components/Navbar';
import { Marketplace } from './views/Marketplace';
import { ChatAssistant } from './views/ChatAssistant';
import { BusinessDashboard } from './views/BusinessDashboard';
import { DriverDashboard } from './views/DriverDashboard';
import { Profile } from './views/Profile';
import { Orders } from './views/Orders';
import { User, AppView, Product, CartItem, Order, OrderStatus, UserRole, FulfillmentMethod } from './types';
import { MOCK_PRODUCTS, MOCK_USERS } from './constants';
import { GeminiService } from './services/geminiService';
import { Button } from './components/Button';
import { Trash2, ArrowRight, CheckCircle, MapPin, CreditCard, ChevronLeft, Store } from 'lucide-react';

// Cart View Component (Inline for simplicity in file structure)
const CartView: React.FC<{ 
  user: User,
  cart: CartItem[], 
  updateQuantity: (id: string, delta: number) => void, 
  checkout: (details: any) => void 
}> = ({ user, cart, updateQuantity, checkout }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>(FulfillmentMethod.DELIVERY);
  
  // Checkout Form State
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: user.address || '',
    city: user.location || '',
    instructions: user.deliveryInstructions || ''
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: user.billing?.cardNumber || '',
    expiry: user.billing?.expiry || '',
    cvc: user.billing?.cvc || ''
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = fulfillmentMethod === FulfillmentMethod.DELIVERY ? 2.99 : 0;
  
  // Initialize defaults if user changes (rare in this flow but good practice)
  useEffect(() => {
    setDeliveryDetails({
      address: user.address || '',
      city: user.location || '',
      instructions: user.deliveryInstructions || ''
    });
    setPaymentDetails({
      cardNumber: user.billing?.cardNumber || '',
      expiry: user.billing?.expiry || '',
      cvc: user.billing?.cvc || ''
    });
  }, [user]);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
          <Trash2 className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Browse the marketplace to find fresh local food.</p>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    checkout({ 
      ...deliveryDetails, 
      ...paymentDetails, 
      total, 
      fulfillmentMethod,
      deliveryFee 
    });
  };

  if (isCheckingOut) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-8">
        <Button variant="outline" size="sm" onClick={() => setIsCheckingOut(false)} className="mb-6">
          <ChevronLeft size={16} className="mr-1" /> Back to Cart
        </Button>
        
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Checkout</h1>
        
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            {/* Fulfillment Method Toggle */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1 flex">
               <button
                 type="button"
                 onClick={() => setFulfillmentMethod(FulfillmentMethod.DELIVERY)}
                 className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                   fulfillmentMethod === FulfillmentMethod.DELIVERY 
                     ? 'bg-green-600 text-white shadow-sm' 
                     : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                 }`}
               >
                 <MapPin className="w-4 h-4 mr-2" /> Delivery
               </button>
               <button
                 type="button"
                 onClick={() => setFulfillmentMethod(FulfillmentMethod.PICKUP)}
                 className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                   fulfillmentMethod === FulfillmentMethod.PICKUP 
                     ? 'bg-green-600 text-white shadow-sm' 
                     : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                 }`}
               >
                 <Store className="w-4 h-4 mr-2" /> Pickup
               </button>
            </div>

            {/* Delivery Section (Conditional) */}
            {fulfillmentMethod === FulfillmentMethod.DELIVERY ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  Delivery Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Street Address</label>
                    <input
                      required
                      type="text"
                      value={deliveryDetails.address}
                      onChange={(e) => setDeliveryDetails({...deliveryDetails, address: e.target.value})}
                      className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500"
                      placeholder="123 Farm Lane"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                    <input
                      required
                      type="text"
                      value={deliveryDetails.city}
                      onChange={(e) => setDeliveryDetails({...deliveryDetails, city: e.target.value})}
                      className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500"
                      placeholder="Toronto"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Instructions</label>
                    <textarea
                      rows={2}
                      value={deliveryDetails.instructions}
                      onChange={(e) => setDeliveryDetails({...deliveryDetails, instructions: e.target.value})}
                      className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500"
                      placeholder="Gate code, drop-off location, etc."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Store className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  Pickup Location
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-medium mb-1">Pick up your items from:</p>
                  {/* Simplification: Just listing the first business location for now */}
                  <p className="text-gray-900 dark:text-white font-bold">{cart[0]?.businessName}</p>
                  <p>{cart[0]?.location || 'Main St. Market'}</p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Available for pickup in ~45 mins</p>
                </div>
              </div>
            )}

            {/* Payment Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                Billing & Payment
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Card Number</label>
                  <input
                    required
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                    className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiry (MM/YY)</label>
                    <input
                      required
                      type="text"
                      placeholder="MM/YY"
                      value={paymentDetails.expiry}
                      onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                      className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CVC</label>
                    <input
                      required
                      type="text"
                      placeholder="123"
                      value={paymentDetails.cvc}
                      onChange={(e) => setPaymentDetails({...paymentDetails, cvc: e.target.value})}
                      className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-fit sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              <ul className="divide-y divide-gray-100 dark:divide-gray-700 mb-4 max-h-60 overflow-y-auto">
                {cart.map(item => (
                  <li key={item.id} className="py-2 flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{item.quantity}x {item.name}</span>
                    <span className="text-gray-900 dark:text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'Free (Pickup)' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2">
                  <span>Total</span>
                  <span>${(total + deliveryFee).toFixed(2)}</span>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full mt-6">
                Confirm & Pay
              </Button>
              <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">Secure payment processed by Stripe (Demo)</p>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Cart View
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Cart</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {cart.map(item => (
            <li key={item.id} className="p-4 sm:p-6 flex items-center justify-between flex-wrap sm:flex-nowrap gap-4">
              <div className="flex items-center flex-grow">
                <img src={item.imageUrl} className="w-16 h-16 rounded-md object-cover mr-4 bg-gray-100 dark:bg-gray-700" alt={item.name} />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">${item.price.toFixed(2)} / {item.unit}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">Sold by {item.businessName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 ml-auto">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                  <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold border-r border-gray-200 dark:border-gray-600">-</button>
                  <span className="px-3 py-1 font-bold text-gray-900 dark:text-white min-w-[2.5rem] text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold border-l border-gray-200 dark:border-gray-600">+</button>
                </div>
                <div className="w-20 text-right font-semibold text-gray-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 flex justify-between items-center">
          <span className="text-lg font-medium text-gray-700 dark:text-gray-200">Subtotal</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
        </div>
        <div className="p-6 flex justify-end">
           <Button size="lg" onClick={() => setIsCheckingOut(true)} className="w-full sm:w-auto flex items-center">
             Proceed to Checkout <ArrowRight size={18} className="ml-2" />
           </Button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('harvesthub_theme');
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('harvesthub_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // State for persistence
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('harvesthub_users');
    return savedUsers ? JSON.parse(savedUsers) : MOCK_USERS;
  });

  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.AUTH);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Initialize Gemini Service with current products
  const geminiService = useMemo(() => new GeminiService(products), [products]);

  // Save users to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('harvesthub_users', JSON.stringify(users));
  }, [users]);

  // Order Status Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(currentOrders => {
        let hasUpdates = false;
        const updatedOrders = currentOrders.map(order => {
          // Only update active orders
          if (order.status === OrderStatus.DELIVERED) return order;

          const now = Date.now();
          const elapsed = now - order.date;
          let newStatus: OrderStatus = order.status;
          let newProgress = order.driverProgress;

          // Simulation Stages
          if (order.status === OrderStatus.CONFIRMED && elapsed > 5000) {
            newStatus = OrderStatus.PREPARING;
          } 
          else if (order.status === OrderStatus.PREPARING) {
             // For Pickup orders, auto-move to READY_FOR_PICKUP after some time
             if (order.fulfillmentMethod === FulfillmentMethod.PICKUP && elapsed > 10000) {
               newStatus = OrderStatus.READY_FOR_PICKUP;
             }
             // For Delivery orders, we wait for driver assignment in simulation logic, or driver dashboard interaction.
          }
          else if (order.status === OrderStatus.ON_THE_WAY) {
             // Simulate driving progress
             if (newProgress < 100) {
               newProgress += 5; // 5% per second
               hasUpdates = true;
             }
             if (newProgress >= 100 && !order.driverId) {
               newStatus = OrderStatus.DELIVERED;
             }
          }

          if (newStatus !== order.status || newProgress !== order.driverProgress) {
             hasUpdates = true;
             return { ...order, status: newStatus, driverProgress: newProgress };
          }
          
          return order;
        });

        return hasUpdates ? updatedOrders : currentOrders;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === UserRole.DRIVER) {
      setView(AppView.DRIVER_DASHBOARD);
    } else if (loggedInUser.role === UserRole.BUSINESS) {
      setView(AppView.DASHBOARD);
    } else {
      setView(AppView.MARKETPLACE);
    }
  };

  const handleRegister = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleLogout = () => {
    setUser(null);
    setView(AppView.AUTH);
    setCart([]);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    // Update the user in the persistent list as well
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    alert(`${product.name} added to cart!`);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleAddProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleCheckout = (details: any) => {
    const { address, city, total, fulfillmentMethod, deliveryFee } = details;
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items: [...cart],
      total: total + deliveryFee,
      date: Date.now(),
      status: OrderStatus.CONFIRMED,
      deliveryAddress: fulfillmentMethod === FulfillmentMethod.PICKUP ? 'Pickup at Store' : `${address}, ${city}`,
      fulfillmentMethod: fulfillmentMethod,
      driverProgress: 0,
      customerName: user?.name || 'Guest'
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setView(AppView.ORDERS);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, driverId?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status, driverId: driverId || o.driverId };
      }
      return o;
    }));
  };

  if (!user) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <Auth onLogin={handleLogin} users={users} onRegister={handleRegister} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      <Navbar 
        user={user} 
        currentView={view} 
        setView={setView} 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <main className="fade-in">
        {view === AppView.MARKETPLACE && (
          <Marketplace products={products} addToCart={addToCart} />
        )}
        
        {view === AppView.CHAT && (
          <ChatAssistant geminiService={geminiService} user={user} />
        )}

        {view === AppView.DASHBOARD && (
          <BusinessDashboard 
            user={user} 
            products={products} 
            orders={orders}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
        
        {view === AppView.DRIVER_DASHBOARD && (
          <DriverDashboard 
            user={user}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {view === AppView.CART && (
          <CartView 
            user={user}
            cart={cart} 
            updateQuantity={updateCartQuantity} 
            checkout={handleCheckout} 
          />
        )}

        {view === AppView.PROFILE && (
          <Profile user={user} onUpdateProfile={handleUpdateProfile} />
        )}

        {view === AppView.ORDERS && (
          <Orders orders={orders} />
        )}
      </main>
    </div>
  );
}
