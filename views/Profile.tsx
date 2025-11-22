
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Button } from '../components/Button';
import { User as UserIcon, MapPin, Truck, Save, CreditCard } from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdateProfile: (updatedUser: User) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    location: user.location || '',
    address: user.address || '',
    deliveryInstructions: user.deliveryInstructions || '',
    cardNumber: user.billing?.cardNumber || '',
    expiry: user.billing?.expiry || '',
    cvc: user.billing?.cvc || ''
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      name: formData.name,
      location: formData.location,
      address: formData.address,
      deliveryInstructions: formData.deliveryInstructions,
      billing: {
        cardNumber: formData.cardNumber,
        expiry: formData.expiry,
        cvc: formData.cvc
      }
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your personal information, delivery preferences{user.role !== UserRole.BUSINESS && ', and billing'}.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden space-y-1">
        
        {/* Personal Info Section */}
        <div className="p-6 bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <UserIcon className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="mt-1 block w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed.</p>
            </div>
          </div>
        </div>

        {/* Delivery Info Section */}
        <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Delivery Address
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City / Region</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g. Toronto"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500"
                placeholder="e.g. 123 Farm Lane, Unit 4B"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="flex items-center">
                  <Truck className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500" />
                  Delivery Instructions
                </div>
              </label>
              <textarea
                value={formData.deliveryInstructions}
                onChange={(e) => setFormData({...formData, deliveryInstructions: e.target.value})}
                rows={3}
                className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500"
                placeholder="e.g. Leave on front porch, buzz code 1234..."
              />
            </div>
          </div>
        </div>

        {/* Billing Info Section - Hide for Business Accounts */}
        {user.role !== UserRole.BUSINESS && (
          <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Card Number</label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                  className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500"
                  placeholder="0000 0000 0000 0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiry (MM/YY)</label>
                <input
                  type="text"
                  value={formData.expiry}
                  onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                  className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CVC</label>
                <input
                  type="text"
                  value={formData.cvc}
                  onChange={(e) => setFormData({...formData, cvc: e.target.value})}
                  className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-900 dark:text-white focus:ring-green-500 focus:border-green-500"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-green-600 dark:text-green-400 font-medium h-6">
            {isSaved && <span className="flex items-center animate-pulse"><Save className="w-4 h-4 mr-1" /> Profile saved successfully!</span>}
          </div>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};