
export enum UserRole {
  CONSUMER = 'CONSUMER',
  BUSINESS = 'BUSINESS',
  DRIVER = 'DRIVER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  location?: string;
  address?: string;
  deliveryInstructions?: string;
  billing?: {
    cardNumber: string;
    expiry: string;
    cvc: string;
  };
}

export interface Product {
  id: string;
  businessId: string;
  businessName: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // For discounts
  unit: string;
  category: string;
  imageUrl: string;
  available: boolean;
  location: string;
  dietary?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export enum OrderStatus {
  CONFIRMED = 'Confirmed',
  PREPARING = 'Preparing',
  READY_FOR_PICKUP = 'Ready for Pickup',
  ON_THE_WAY = 'On the Way',
  DELIVERED = 'Delivered'
}

export enum FulfillmentMethod {
  DELIVERY = 'DELIVERY',
  PICKUP = 'PICKUP'
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: number;
  status: OrderStatus;
  deliveryAddress: string;
  fulfillmentMethod: FulfillmentMethod;
  driverProgress: number; // 0 to 100 representing distance from store to home
  driverId?: string;
  customerName: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export enum AppView {
  AUTH = 'AUTH',
  MARKETPLACE = 'MARKETPLACE',
  DASHBOARD = 'DASHBOARD', // Business only
  DRIVER_DASHBOARD = 'DRIVER_DASHBOARD', // Driver only
  CHAT = 'CHAT',
  CART = 'CART',
  PROFILE = 'PROFILE',
  ORDERS = 'ORDERS'
}
