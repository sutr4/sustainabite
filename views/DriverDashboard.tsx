
import React, { useState } from 'react';
import { User, Order, OrderStatus, FulfillmentMethod } from '../types';
import { Button } from '../components/Button';
import { Truck, MapPin, Package, DollarSign, CheckCircle, Navigation, Clock } from 'lucide-react';

interface DriverDashboardProps {
  user: User;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, driverId?: string) => void;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({ user, orders, onUpdateOrderStatus }) => {
  const [activeTab, setActiveTab] = useState<'available' | 'active'>('available');

  const availableJobs = orders.filter(
    o => o.status === OrderStatus.PREPARING && !o.driverId && o.fulfillmentMethod === FulfillmentMethod.DELIVERY
  );

  const myActiveJobs = orders.filter(
    o => o.driverId === user.id && o.status !== OrderStatus.DELIVERED
  );

  const myCompletedJobs = orders.filter(
    o => o.driverId === user.id && o.status === OrderStatus.DELIVERED
  );

  const calculateEarnings = (total: number) => {
    // Simple mock calculation: base fee + 10% of order value
    return (4.50 + (total * 0.10)).toFixed(2);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Driver Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Find jobs and track your deliveries.</p>
        </div>
        <div className="flex items-center bg-green-100 dark:bg-green-900/50 px-4 py-2 rounded-lg text-green-800 dark:text-green-300 font-semibold">
          <DollarSign size={20} className="mr-1" />
          <span>Earnings Today: ${myCompletedJobs.reduce((acc, order) => acc + parseFloat(calculateEarnings(order.total)), 0).toFixed(2)}</span>
        </div>
      </div>

      <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('available')}
          className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'available'
              ? 'border-green-600 text-green-600 dark:text-green-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          Available Jobs ({availableJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'active'
              ? 'border-green-600 text-green-600 dark:text-green-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          My Deliveries ({myActiveJobs.length})
        </button>
      </div>

      {activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableJobs.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-dashed">
              <Package className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p>No delivery jobs available right now. Check back soon!</p>
            </div>
          ) : (
            availableJobs.map(order => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs font-semibold rounded-full mb-2">
                      Ready for Pickup
                    </span>
                    <h3 className="font-bold text-gray-900 dark:text-white">Order #{order.id.slice(-4).toUpperCase()}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">${calculateEarnings(order.total)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Est. Earnings</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <div className="mt-1 mr-3 flex-shrink-0">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Pickup From</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{order.items[0].businessName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{order.items[0].location}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-1 mr-3 flex-shrink-0">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Deliver To</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{order.deliveryAddress}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => onUpdateOrderStatus(order.id, OrderStatus.ON_THE_WAY, user.id)}
                  className="w-full"
                >
                  Accept Job
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'active' && (
        <div className="space-y-6">
          {myActiveJobs.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-dashed">
              <Truck className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p>You don't have any active deliveries.</p>
              <button onClick={() => setActiveTab('available')} className="text-green-600 dark:text-green-400 font-medium mt-2 hover:underline">
                Browse Available Jobs
              </button>
            </div>
          ) : (
            myActiveJobs.map(order => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-l-4 border-green-500 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Current Delivery #{order.id.slice(-4).toUpperCase()}</h3>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Customer is waiting for their order.</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <Button variant="secondary" size="sm">
                          <Navigation size={16} className="mr-2" /> Navigate
                       </Button>
                       <Button variant="secondary" size="sm">
                          Contact Customer
                       </Button>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Items</p>
                        <ul className="text-sm text-gray-800 dark:text-gray-200 space-y-1">
                          {order.items.map((item, i) => (
                            <li key={i}>{item.quantity}x {item.name}</li>
                          ))}
                        </ul>
                     </div>
                     <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Drop-off Instructions</p>
                        <p className="text-sm text-gray-800 dark:text-gray-200 italic">"Leave on front porch. Ring doorbell."</p>
                     </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      size="lg" 
                      onClick={() => onUpdateOrderStatus(order.id, OrderStatus.DELIVERED, user.id)}
                      className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle size={20} className="mr-2" />
                      Confirm Delivery
                    </Button>
                  </div>
                </div>
                {/* Progress Bar Visual for the Driver */}
                <div className="bg-gray-200 dark:bg-gray-700 h-2 w-full">
                  <div 
                    className="bg-green-500 h-2 transition-all duration-1000" 
                    style={{ width: `${order.driverProgress}%` }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};