
import React from 'react';
import { Order, OrderStatus, FulfillmentMethod } from '../types';
import { Package, Truck, CheckCircle, ChefHat, Store, Home, Clock } from 'lucide-react';

interface OrdersProps {
  orders: Order[];
}

const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const styles = {
    [OrderStatus.CONFIRMED]: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    [OrderStatus.PREPARING]: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    [OrderStatus.READY_FOR_PICKUP]: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
    [OrderStatus.ON_THE_WAY]: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    [OrderStatus.DELIVERED]: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const TrackingMap: React.FC<{ progress: number }> = ({ progress }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  return (
    <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 mb-6">
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', 
        backgroundSize: '20px 20px' 
      }}></div>
      <div className="absolute top-1/2 left-10 right-10 h-2 bg-gray-300 dark:bg-gray-600 rounded-full transform -translate-y-1/2"></div>
      
      <div className="absolute top-1/2 left-6 transform -translate-y-1/2 flex flex-col items-center z-10">
        <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md border border-gray-200 dark:border-gray-600">
          <Store className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 mt-1 bg-white dark:bg-gray-800 px-1 rounded">Farm</span>
      </div>

      <div className="absolute top-1/2 right-6 transform -translate-y-1/2 flex flex-col items-center z-10">
        <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md border border-gray-200 dark:border-gray-600">
          <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <span className="text-xs font-bold text-gray-600 dark:text-gray-300 mt-1 bg-white dark:bg-gray-800 px-1 rounded">You</span>
      </div>

      <div 
        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-linear z-20"
        style={{ left: `calc(2.5rem + (100% - 5rem) * ${clampedProgress / 100})` }}
      >
        <div className="relative">
          <div className="bg-green-600 p-2 rounded-full shadow-lg text-white ring-4 ring-green-100 dark:ring-green-900/30">
            <Truck className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/75 text-white text-xs px-2 py-1 rounded">
            Driver
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackingTimeline: React.FC<{ status: OrderStatus, method: FulfillmentMethod }> = ({ status, method }) => {
  let steps;
  
  if (method === FulfillmentMethod.PICKUP) {
    steps = [
      { id: OrderStatus.CONFIRMED, label: 'Confirmed', icon: CheckCircle },
      { id: OrderStatus.PREPARING, label: 'Preparing', icon: ChefHat },
      { id: OrderStatus.READY_FOR_PICKUP, label: 'Ready for Pickup', icon: Store },
      { id: OrderStatus.DELIVERED, label: 'Picked Up', icon: CheckCircle }, // Reusing Delivered as completed state
    ];
  } else {
    steps = [
      { id: OrderStatus.CONFIRMED, label: 'Confirmed', icon: CheckCircle },
      { id: OrderStatus.PREPARING, label: 'Preparing', icon: ChefHat },
      { id: OrderStatus.ON_THE_WAY, label: 'On the Way', icon: Truck },
      { id: OrderStatus.DELIVERED, label: 'Delivered', icon: Home },
    ];
  }

  const currentStepIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="relative flex items-center justify-between w-full mb-8">
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-0"></div>
      <div 
        className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 -z-0 transition-all duration-500" 
        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
      ></div>

      {steps.map((step, index) => {
        const isCompleted = index <= currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex flex-col items-center z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 border-2 ${
              isCompleted 
                ? 'bg-green-600 border-green-600 text-white' 
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
            }`}>
              <Icon size={18} />
            </div>
            <span className={`mt-2 text-xs font-medium ${isCurrent ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const EstimatedArrival: React.FC<{ orderDate: number }> = ({ orderDate }) => {
  const getEstimatedArrival = (timestamp: number) => {
    const date = new Date(timestamp + 35 * 60000); // Add 35 minutes
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-lg p-4 flex items-center justify-between mb-6 shadow-sm">
       <div className="flex items-center text-blue-800 dark:text-blue-200">
         <Clock className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
         <div>
           <p className="text-xs font-bold uppercase tracking-wider opacity-70">Estimated Arrival</p>
           <p className="font-bold text-lg">{getEstimatedArrival(orderDate)}</p>
         </div>
       </div>
       <div className="text-right">
          <p className="text-xs text-blue-600 dark:text-blue-400">On time</p>
       </div>
    </div>
  );
};

export const Orders: React.FC<OrdersProps> = ({ orders }) => {
  const sortedOrders = [...orders].sort((a, b) => b.date - a.date);

  if (sortedOrders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
          <Package className="h-12 w-12 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">No orders yet</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">When you buy something from the marketplace, <br/>it will show up here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order History</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your deliveries and view past purchases.</p>
      </div>

      {sortedOrders.map(order => (
        <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Order Placed</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(order.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Total</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">${order.total.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Type</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{order.fulfillmentMethod.toLowerCase()}</p>
            </div>
            <div className="ml-auto">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          {/* Tracking Section for Active Orders */}
          {order.status !== OrderStatus.DELIVERED && (
            <div className="px-6 pt-8 pb-4 bg-white dark:bg-gray-800">
              <TrackingTimeline status={order.status} method={order.fulfillmentMethod} />
              
              {/* Delivery Tracking Map */}
              {order.fulfillmentMethod === FulfillmentMethod.DELIVERY && order.status === OrderStatus.ON_THE_WAY && (
                <div className="mt-8 animate-fade-in">
                   <div className="flex items-center mb-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Live Tracking</h3>
                   </div>
                   <EstimatedArrival orderDate={order.date} />
                   <TrackingMap progress={order.driverProgress} />
                   <p className="text-sm text-gray-600 dark:text-gray-400 text-center italic">
                     Your driver is on the way to <span className="font-semibold">{order.deliveryAddress}</span>
                   </p>
                </div>
              )}

              {/* Pickup Info Card */}
              {order.fulfillmentMethod === FulfillmentMethod.PICKUP && order.status === OrderStatus.READY_FOR_PICKUP && (
                 <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800 rounded-lg animate-fade-in">
                    <h3 className="text-lg font-bold text-orange-800 dark:text-orange-200 mb-2">Ready for Pickup!</h3>
                    <p className="text-gray-700 dark:text-gray-300">Your order is ready at <strong>{order.items[0].businessName}</strong>.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Please show your Order ID <strong>#{order.id.slice(-4).toUpperCase()}</strong> at the counter.</p>
                 </div>
              )}
            </div>
          )}

          <div className="px-6 py-6">
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {order.items.map((item, idx) => (
                <li key={idx} className="py-4 flex items-center">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="h-16 w-16 rounded-lg object-cover bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700"
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{item.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.businessName}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>Qty: {item.quantity}</span>
                      <span className="mx-2">•</span>
                      <span>${item.price.toFixed(2)} each</span>
                    </div>
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};