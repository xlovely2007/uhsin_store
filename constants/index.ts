
import { Product } from '../types/index';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'ThunderCharge 65W GaN',
    price: 49.99,
    description: 'Ultra-compact high-speed charger for laptops and phones.',
    image: 'https://picsum.photos/seed/charger/400/400',
    category: 'Power',
    rating: 4.8,
    stock: 120
  },
  {
    id: '2',
    name: 'SonicWave Elite TWS',
    price: 129.00,
    description: 'Noise-cancelling wireless earbuds with 40h battery life.',
    image: 'https://picsum.photos/seed/earbuds/400/400',
    category: 'Audio',
    rating: 4.9,
    stock: 85
  },
  {
    id: '3',
    name: 'HyperConnect HDMI 2.1',
    price: 24.99,
    description: '8K Ultra HD compatible HDMI cable with braided shield.',
    image: 'https://picsum.photos/seed/cable/400/400',
    category: 'Connectivity',
    rating: 4.5,
    stock: 200
  },
  {
    id: '4',
    name: 'ShieldPro Laptop Sleeve',
    price: 35.00,
    description: 'Water-resistant protective sleeve for 14-inch laptops.',
    image: 'https://picsum.photos/seed/sleeve/400/400',
    category: 'Protection',
    rating: 4.7,
    stock: 50
  },
  {
    id: '5',
    name: 'PrecisionClick MX',
    price: 89.99,
    description: 'Ergonomic wireless mouse with precision tracking.',
    image: 'https://picsum.photos/seed/mouse/400/400',
    category: 'Input',
    rating: 4.9,
    stock: 30
  }
];

export const CATEGORIES: { name: string; icon: string }[] = [
  { name: 'Audio', icon: '🎧' },
  { name: 'Power', icon: '⚡' },
  { name: 'Connectivity', icon: '🔌' },
  { name: 'Protection', icon: '🛡️' },
  { name: 'Input', icon: '🖱️' }
];

export interface SpecialOffer {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  code: string;
  bgGradient: string;
}

export const SPECIAL_OFFERS: SpecialOffer[] = [
  {
    id: 'o1',
    title: 'Weekend Flash Sale',
    subtitle: 'On all Audio accessories',
    discount: '25% OFF',
    code: 'AUDIO25',
    bgGradient: 'from-orange-500 to-pink-500'
  },
  {
    id: 'o2',
    title: 'New Member Gift',
    subtitle: 'First purchase special',
    discount: '15% OFF',
    code: 'WELCOME15',
    bgGradient: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'o3',
    title: 'Power Up Deal',
    subtitle: 'Buy any GaN charger',
    discount: '$10 OFF',
    code: 'PWRUP10',
    bgGradient: 'from-blue-600 to-cyan-500'
  }
];

export const PROMO_CODES: Record<string, number> = {
  'AUDIO25': 0.25,
  'WELCOME15': 0.15,
  'PWRUP10': 10,
  'SAVE10': 0.10
};
