
import { Product, UserRole, User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password',
    role: UserRole.CONSUMER,
    location: 'Toronto',
    address: '123 Main St, Toronto, ON',
    billing: { cardNumber: '4242 4242 4242 4242', expiry: '12/25', cvc: '123' }
  },
  {
    id: 'b1',
    name: 'Sunny Side Farms',
    email: 'farm@example.com',
    password: 'password',
    role: UserRole.BUSINESS,
    location: 'North York'
  },
  {
    id: 'b2',
    name: 'The Rustic Baker',
    email: 'baker@example.com',
    password: 'password',
    role: UserRole.BUSINESS,
    location: 'Downtown Toronto'
  },
  {
    id: 'd1',
    name: 'Speedy Driver',
    email: 'driver@example.com',
    password: 'password',
    role: UserRole.DRIVER,
    location: 'Toronto'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    businessId: 'b1',
    businessName: 'Sunny Side Farms',
    name: 'Organic Honeycrisp Apples',
    description: 'Freshly picked, crisp and sweet apples. Perfect for snacking or baking.',
    price: 2.99,
    unit: 'lb',
    category: 'Produce',
    imageUrl: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=800&auto=format&fit=crop',
    available: true,
    location: 'North York',
    dietary: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Halal', 'Kosher']
  },
  {
    id: 'p2',
    businessId: 'b1',
    businessName: 'Sunny Side Farms',
    name: 'Free Range Eggs',
    description: 'Large brown eggs from happy, pasture-raised chickens.',
    price: 6.50,
    unit: 'dozen',
    category: 'Dairy & Eggs',
    imageUrl: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?q=80&w=800&auto=format&fit=crop',
    available: true,
    location: 'North York',
    dietary: ['Vegetarian', 'Gluten-Free', 'Halal', 'Kosher']
  },
  {
    id: 'p3',
    businessId: 'b2',
    businessName: 'The Rustic Baker',
    name: 'Sourdough Loaf',
    description: 'Artisan sourdough bread fermented for 48 hours.',
    price: 5.00,
    originalPrice: 8.50, // Discounted!
    unit: 'loaf',
    category: 'Bakery',
    imageUrl: 'https://images.unsplash.com/photo-1585478259525-ee19a6b43786?q=80&w=800&auto=format&fit=crop',
    available: true,
    location: 'Downtown Toronto',
    dietary: ['Vegetarian', 'Vegan', 'Halal', 'Kosher']
  },
  {
    id: 'p4',
    businessId: 'b2',
    businessName: 'The Rustic Baker',
    name: 'Day-old Baguettes',
    description: 'Perfect for french toast or bread pudding.',
    price: 1.50,
    originalPrice: 4.00,
    unit: 'each',
    category: 'Bakery',
    imageUrl: 'https://images.unsplash.com/photo-1530173555897-c742364e284b?q=80&w=800&auto=format&fit=crop',
    available: true,
    location: 'Downtown Toronto',
    dietary: ['Vegetarian', 'Vegan', 'Halal', 'Kosher']
  },
  {
    id: 'p5',
    businessId: 'b3',
    businessName: 'Green Valley Organics',
    name: 'Kale Bunch',
    description: 'Nutrient-dense organic kale.',
    price: 3.00,
    unit: 'bunch',
    category: 'Produce',
    imageUrl: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?q=80&w=800&auto=format&fit=crop',
    available: true,
    location: 'Etobicoke',
    dietary: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Halal', 'Kosher']
  },
  {
    id: 'p6',
    businessId: 'b3',
    businessName: 'Green Valley Organics',
    name: 'Heirloom Tomatoes',
    description: 'Juicy, flavorful mixed heirloom tomatoes.',
    price: 4.99,
    unit: 'lb',
    category: 'Produce',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop',
    available: true,
    location: 'Etobicoke',
    dietary: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Halal', 'Kosher']
  },
  {
    id: 'p7',
    businessId: 'b4',
    businessName: 'Mama Mia Pizzeria',
    name: 'Surprise Pizza Box',
    description: '3-4 slices of assorted gourmet pizza from today\'s lunch service. Heat and eat!',
    price: 6.99,
    originalPrice: 18.00,
    unit: 'box',
    category: 'Prepared Meals',
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop',
    available: true,
    location: 'Little Italy',
    dietary: [] // Unknown contents usually, maybe not strict
  },
  {
    id: 'p8',
    businessId: 'b5',
    businessName: 'Downtown Bakery',
    name: 'End-of-Day Pastry Bag',
    description: 'A mix of croissants, muffins, and danishes baked fresh this morning.',
    price: 5.00,
    originalPrice: 15.00,
    unit: 'bag',
    category: 'Bakery',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop',
    available: true,
    location: 'Downtown',
    dietary: ['Vegetarian']
  }
];

export const APP_NAME = "SustainaBite";