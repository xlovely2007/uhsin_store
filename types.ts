
export type Category = 'Audio' | 'Power' | 'Connectivity' | 'Protection' | 'Input';

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: Category;
  rating: number;
  ratingCount?: number;
  stock: number;
  reviews?: Review[];
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  wishlist: string[];
  joinedAt?: string;
  address?: Address;
  bankDetails?: {
    accountHolder: string;
    accountNumber: string;
    bankName: string;
    ifsc: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  date: string;
  trackingNumber: string;
  paymentMethod: string;
  shippingAddress: Address;
}

export type View = 'home' | 'products' | 'orders' | 'profile' | 'admin' | 'auth' | 'product-detail';
export type AdminSubView = 'dashboard' | 'products' | 'orders' | 'users' | 'logs';
