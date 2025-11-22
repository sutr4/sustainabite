
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { User, UserRole } from '../types';
import { Store, Leaf, Truck, Lock } from 'lucide-react';
import { APP_NAME } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
  users: User[];
  onRegister: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, users, onRegister }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.CONSUMER);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('Toronto'); // Default for demo
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      // Registration Logic
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        setError('An account with this email already exists.');
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: name || (role === UserRole.BUSINESS ? 'New Farm' : (role === UserRole.DRIVER ? 'New Driver' : 'New User')),
        email,
        password,
        role,
        location
      };
      onRegister(newUser);
      onLogin(newUser);
    } else {
      // Login Logic
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password. Try "password" for demo accounts.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
        <div className="px-8 py-10">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <Leaf className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isRegister ? `Join ${APP_NAME}` : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isRegister 
              ? 'Connect with local food sources today.' 
              : 'Sign in to access your marketplace.'}
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {isRegister && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {role === UserRole.BUSINESS ? 'Business Name' : 'Full Name'}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none bg-white relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 focus:z-10 sm:text-sm"
                    placeholder={role === UserRole.BUSINESS ? "Sunny Acres Farm" : "John Doe"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none bg-white relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 focus:z-10 sm:text-sm"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="appearance-none bg-white relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 focus:z-10 sm:text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {isRegister && (
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    City/Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    className="appearance-none bg-white relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 focus:z-10 sm:text-sm"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              )}

              {isRegister && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div 
                      className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-center transition-all ${role === UserRole.CONSUMER ? 'border-green-500 bg-green-50 dark:bg-green-900/30 ring-1 ring-green-500' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      onClick={() => setRole(UserRole.CONSUMER)}
                    >
                      <UserIcon className={`h-6 w-6 mb-1 ${role === UserRole.CONSUMER ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                      <span className={`text-xs font-medium ${role === UserRole.CONSUMER ? 'text-green-900 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}>Personal</span>
                    </div>
                    <div 
                      className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-center transition-all ${role === UserRole.BUSINESS ? 'border-green-500 bg-green-50 dark:bg-green-900/30 ring-1 ring-green-500' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      onClick={() => setRole(UserRole.BUSINESS)}
                    >
                      <Store className={`h-6 w-6 mb-1 ${role === UserRole.BUSINESS ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                      <span className={`text-xs font-medium ${role === UserRole.BUSINESS ? 'text-green-900 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}>Business</span>
                    </div>
                    <div 
                      className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-center transition-all ${role === UserRole.DRIVER ? 'border-green-500 bg-green-50 dark:bg-green-900/30 ring-1 ring-green-500' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      onClick={() => setRole(UserRole.DRIVER)}
                    >
                      <Truck className={`h-6 w-6 mb-1 ${role === UserRole.DRIVER ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                      <span className={`text-xs font-medium ${role === UserRole.DRIVER ? 'text-green-900 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}>Driver</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/30 p-2 rounded">
                {error}
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" size="lg">
                {isRegister ? 'Create Account' : 'Sign In'}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isRegister ? "Already have an account? " : "Don't have an account? "}
              <button 
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="font-medium text-green-600 hover:text-green-500 dark:text-green-400"
              >
                {isRegister ? 'Sign In' : 'Register Now'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper icon component for the Auth screen
const UserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);