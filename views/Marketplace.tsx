
import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { Button } from '../components/Button';
import { Search, Filter, MapPin, DollarSign, Clock, Leaf, ChevronDown } from 'lucide-react';

interface MarketplaceProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ products, addToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterDietary, setFilterDietary] = useState<string>('All');
  const [isRescueMode, setIsRescueMode] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const dietaryOptions = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Nut-Free', 'Dairy-Free'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Logic: If Rescue Mode is ON, only show items with originalPrice (discounted)
    // If Rescue Mode is OFF, follow the category filter
    let matchesCategory = true;
    if (isRescueMode) {
      matchesCategory = !!product.originalPrice && product.originalPrice > product.price;
    } else {
      matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    }

    // Dietary Filter Logic
    let matchesDietary = true;
    if (filterDietary !== 'All') {
       matchesDietary = !!product.dietary && product.dietary.includes(filterDietary);
    }

    return matchesSearch && matchesCategory && matchesDietary;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Fresh from the Farm</h1>
        <p className="text-gray-600 dark:text-gray-400">Discover local produce, bakery items, and deals near you.</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Search products or farms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative min-w-[200px]">
             <select
               value={filterDietary}
               onChange={(e) => setFilterDietary(e.target.value)}
               className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
             >
               <option disabled>Dietary Restriction</option>
               {dietaryOptions.map(opt => (
                 <option key={opt} value={opt}>{opt === 'All' ? 'Any Dietary' : opt}</option>
               ))}
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
               <ChevronDown size={16} />
             </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          
          {/* Rescue Mode Toggle */}
          <button
            onClick={() => setIsRescueMode(!isRescueMode)}
            className={`flex items-center px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${
              isRescueMode 
                ? 'bg-orange-500 text-white ring-2 ring-orange-300 ring-offset-1' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:border-orange-300 hover:text-orange-600'
            }`}
          >
            <Clock className={`w-4 h-4 mr-2 ${isRescueMode ? 'text-white' : 'text-orange-500'}`} />
            Rescue Leftovers
            {isRescueMode && <span className="ml-2 bg-white text-orange-600 text-xs px-2 py-0.5 rounded-full">Active</span>}
          </button>

          {/* Categories (Only show if NOT in Rescue Mode) */}
          {!isRescueMode && (
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filterCategory === cat 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {isRescueMode && (
           <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 text-sm text-orange-800 dark:text-orange-300 flex items-start">
             <Leaf className="w-5 h-5 mr-2 flex-shrink-0" />
             <p><strong>Rescue Deals:</strong> You are viewing leftover foods from restaurants and stores at a discounted price. Help fight food waste!</p>
           </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col">
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              {product.originalPrice && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                  SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center">
                <MapPin size={12} className="mr-1" />
                {product.location}
              </div>
            </div>
            
            <div className="p-4 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-1">
                 <div className="text-xs font-medium text-green-600 dark:text-green-400">{product.businessName}</div>
                 {product.dietary && product.dietary.length > 0 && (
                   <div className="flex gap-1 flex-wrap justify-end max-w-[50%]">
                     {product.dietary.slice(0, 2).map(tag => (
                       <span key={tag} className="text-[10px] bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded border border-green-100 dark:border-green-800">{tag}</span>
                     ))}
                     {product.dietary.length > 2 && <span className="text-[10px] text-gray-400">+{product.dietary.length - 2}</span>}
                   </div>
                 )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{product.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
              
              <div className="mt-auto flex items-center justify-between">
                <div>
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/ {product.unit}</span>
                  </div>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through decoration-red-500">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <Button size="sm" onClick={() => addToCart(product)}>
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {isRescueMode 
              ? "No rescue deals available right now. Check back later!" 
              : "Try adjusting your search or filter to find what you're looking for."}
          </p>
        </div>
      )}
    </div>
  );
};