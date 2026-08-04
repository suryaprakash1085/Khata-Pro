import { Category, Restaurant, MenuItem, Offer } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Pizza', icon: '🍕', image: '' },
  { id: '2', name: 'Biryani', icon: '🍚', image: '' },
  { id: '3', name: 'Burger', icon: '🍔', image: '' },
  { id: '4', name: 'Dosa', icon: '🥞', image: '' },
  { id: '5', name: 'North Indian', icon: '🍛', image: '' },
  { id: '6', name: 'Chinese', icon: '🥢', image: '' },
  { id: '7', name: 'South Indian', icon: '🍛', image: '' },
  { id: '8', name: 'Cakes', icon: '🎂', image: '' },
  { id: '9', name: 'Pure Veg', icon: '🥗', image: '' },
  { id: '10', name: 'Noodles', icon: '🍜', image: '' },
];

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Hut',
    rating: 4.0,
    deliveryTime: '30-35 mins',
    cuisine: 'Pizzas',
    image: 'https://via.placeholder.com/150',
    costForTwo: '₹800 for two',
    address: 'Sector 1, HSR Layout',
    isVeg: false,
    offers: [{ id: '1', title: '50% OFF', description: 'UPTO ₹100', code: 'PIZZA50', discount: 50, minOrder: 100, expiryDate: '2026-12-31' }],
  },
  {
    id: '2',
    name: 'Chinese Wok',
    rating: 4.1,
    deliveryTime: '25-30 mins',
    cuisine: 'Chinese, Asian',
    image: 'https://via.placeholder.com/150',
    costForTwo: '₹600 for two',
    address: 'Sector 2, HSR Layout',
    isVeg: true,
    offers: [{ id: '2', title: '50% OFF', description: 'UPTO ₹100', code: 'CHINESE50', discount: 50, minOrder: 100, expiryDate: '2026-12-31' }],
  },
  {
    id: '3',
    name: 'UBQ by Barbeque Nation',
    rating: 3.9,
    deliveryTime: '30-35 mins',
    cuisine: 'Barbeque, Biryani',
    image: 'https://via.placeholder.com/150',
    costForTwo: '₹1200 for two',
    address: 'Sector 3, HSR Layout',
    isVeg: false,
    offers: [{ id: '3', title: '50% OFF', description: 'UPTO ₹100', code: 'BBQ50', discount: 50, minOrder: 150, expiryDate: '2026-12-31' }],
  },
];

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Korean BBQ Chicken Burger',
    price: 330,
    rating: 4.5,
    reviews: 5000,
    description: 'Fried chicken, Asian coleslaw with sweet-spicy Korean BBQ glaze',
    image: 'https://via.placeholder.com/150',
    isBestSeller: true,
    isVeg: false,
    category: 'Burgers',
  },
  {
    id: '2',
    name: 'Paneer Butter Masala',
    price: 185,
    rating: 4.2,
    reviews: 1000,
    description: 'Creamy paneer in rich tomato gravy',
    image: 'https://via.placeholder.com/150',
    isBestSeller: true,
    isVeg: true,
    category: 'Main Course',
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    price: 369,
    rating: 4.3,
    reviews: 2500,
    description: 'Classic cheese pizza with tomato sauce',
    image: 'https://via.placeholder.com/150',
    isBestSeller: false,
    isVeg: true,
    category: 'Pizzas',
  },
];

export const offers: Offer[] = [
  { id: '1', title: 'UPTO 50% OFF', description: 'FROM RESTAURANTS', code: 'FOOD50', discount: 50, minOrder: 100, expiryDate: '2026-12-31' },
  { id: '2', title: 'UPTO 50% OFF', description: 'INSTANT GROCERY', code: 'GROCERY50', discount: 50, minOrder: 100, expiryDate: '2026-12-31' },
  { id: '3', title: 'UPTO 50% OFF', description: 'EAT OUT & SAVE MORE', code: 'EAT50', discount: 50, minOrder: 100, expiryDate: '2026-12-31' },
];