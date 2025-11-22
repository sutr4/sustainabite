
import React from 'react';
import { AppView, User, UserRole } from '../types';
import { ShoppingCart, User as UserIcon, MessageCircle, Store, LayoutDashboard, LogOut, Package, Truck, Sun, Moon } from 'lucide-react';
import { APP_NAME } from '../constants';

interface NavbarProps {
  user: User;
  currentView: AppView;
  setView: (view: AppView) => void;
  cartCount: number;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, currentView, setView, cartCount, onLogout, theme, toggleTheme }) => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView(user.role === UserRole.DRIVER ? AppView.DRIVER_DASHBOARD : AppView.MARKETPLACE)}>
            <span className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-full text-white mr-2">
              <Store size={18} />
            </span>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">{APP_NAME}</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Business View */}
            {user.role === UserRole.BUSINESS && (
              <button 
                onClick={() => setView(AppView.DASHBOARD)}
                className={`p-2 rounded-md transition-colors ${currentView === AppView.DASHBOARD ? 'text-green-600 bg-green-50 dark:bg-gray-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                title="Business Dashboard"
              >
                <LayoutDashboard size={20} />
              </button>
            )}

            {/* Driver View */}
            {user.role === UserRole.DRIVER && (
              <button 
                onClick={() => setView(AppView.DRIVER_DASHBOARD)}
                className={`p-2 rounded-md transition-colors ${currentView === AppView.DRIVER_DASHBOARD ? 'text-green-600 bg-green-50 dark:bg-gray-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                title="Driver Jobs"
              >
                <Truck size={20} />
              </button>
            )}

            {/* Common Views (Marketplace hidden for Drivers purely to focus them, but can be enabled) */}
            {user.role !== UserRole.DRIVER && (
              <button 
                onClick={() => setView(AppView.MARKETPLACE)}
                className={`p-2 rounded-md transition-colors ${currentView === AppView.MARKETPLACE ? 'text-green-600 bg-green-50 dark:bg-gray-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                title="Marketplace"
              >
                <Store size={20} />
              </button>
            )}

            <button 
              onClick={() => setView(AppView.CHAT)}
              className={`p-2 rounded-md transition-colors ${currentView === AppView.CHAT ? 'text-green-600 bg-green-50 dark:bg-gray-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
              title="Food Buddy AI"
            >
              <MessageCircle size={20} />
            </button>
            
            {user.role === UserRole.CONSUMER && (
              <>
                <button 
                  onClick={() => setView(AppView.ORDERS)}
                  className={`p-2 rounded-md transition-colors ${currentView === AppView.ORDERS ? 'text-green-600 bg-green-50 dark:bg-gray-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                  title="My Orders"
                >
                  <Package size={20} />
                </button>

                <button 
                  onClick={() => setView(AppView.CART)}
                  className={`relative p-2 rounded-md transition-colors ${currentView === AppView.CART ? 'text-green-600 bg-green-50 dark:bg-gray-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                  title="Cart"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              </>
            )}

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setView(AppView.PROFILE)}
                className={`p-2 rounded-full transition-all border-2 ${currentView === AppView.PROFILE ? 'bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                title="Your Profile"
              >
                <UserIcon size={20} />
              </button>
              
              <button 
                onClick={onLogout}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};