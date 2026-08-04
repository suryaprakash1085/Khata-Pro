// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   avatar?: string;
//   addresses?: Address[];
// }

// export interface Address {
//   id: string;
//   type: 'Home' | 'Work' | 'Other';
//   address: string;
//   city: string;
//   state: string;
//   pincode: string;
//   latitude?: number;
//   longitude?: number;
//   isDefault: boolean;
// }

// export interface Restaurant {
//   id: string;
//   name: string;
//   image: string;
//   rating: number;
//   deliveryTime: string;
//   cuisine: string;
//   costForTwo: string;
//   address: string;
//   offers?: Offer[];
//   isVeg: boolean;
// }

// export interface MenuItem {
//   id: string;
//   name: string;
//   price: number;
//   description: string;
//   image: string;
//   rating: number;
//   reviews: number;
//   isBestSeller: boolean;
//   isVeg: boolean;
//   category: string;
//   customization?: Customization[];
// }

// export interface Customization {
//   id: string;
//   name: string;
//   options: CustomizationOption[];
//   required: boolean;
// }

// export interface CustomizationOption {
//   id: string;
//   name: string;
//   price: number;
//   isDefault: boolean;
// }

// export interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
//   restaurantId: string;
//   restaurantName: string;
//   customization?: CustomizationOption[];
// }

// export interface Order {
//   id: string;
//   restaurantId: string;
//   restaurantName: string;
//   items: CartItem[];
//   total: number;
//   status: 'Placed' | 'Preparing' | 'Ready' | 'On the way' | 'Delivered' | 'Cancelled';
//   deliveryAddress: Address;
//   paymentMethod: string;
//   createdAt: string;
//   deliveredAt?: string;
// }

// export interface Offer {
//   id: string;
//   title: string;
//   description: string;
//   code: string;
//   discount: number;
//   minOrder: number;
//   expiryDate: string;
// }

// export interface Category {
//   id: string;
//   name: string;
//   icon: string;
//   image: string;
// }

// export interface Review {
//   id: string;
//   userId: string;
//   userName: string;
//   userAvatar?: string;
//   rating: number;
//   comment: string;
//   createdAt: string;
// }

// export interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   loading: boolean;
//   error: string | null;
// }

// export interface CartState {
//   items: CartItem[];
//   totalItems: number;
//   totalPrice: number;
//   restaurantId: string | null;
// }

// export interface OrderState {
//   orders: Order[];
//   currentOrder: Order | null;
//   loading: boolean;
//   error: string | null;
// }

// export interface RestaurantState {
//   restaurants: Restaurant[];
//   categories: Category[];
//   selectedRestaurant: Restaurant | null;
//   loading: boolean;
//   error: string | null;
// }
// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   avatar?: string;
//   addresses?: Address[];
// }

// export interface Address {
//   id: string;
//   type: 'Home' | 'Work' | 'Other';
//   address: string;
//   city: string;
//   state: string;
//   pincode: string;
//   latitude?: number;
//   longitude?: number;
//   isDefault: boolean;
// }

// export interface Restaurant {
//   id: string;
//   name: string;
//   image: string;
//   rating: number;
//   deliveryTime: string;
//   cuisine: string;
//   costForTwo: string;
//   address: string;
//   offers?: Offer[];
//   isVeg: boolean;
// }

// export interface MenuItem {
//   id: string;
//   name: string;
//   price: number;
//   description: string;
//   image: string;
//   rating: number;
//   reviews: number;
//   isBestSeller: boolean;
//   isVeg: boolean;
//   category: string;
//   customization?: Customization[];
// }

// export interface Customization {
//   id: string;
//   name: string;
//   options: CustomizationOption[];
//   required: boolean;
// }

// export interface CustomizationOption {
//   id: string;
//   name: string;
//   price: number;
//   isDefault: boolean;
// }

// export interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
//   restaurantId: string;
//   restaurantName: string;
//   customization?: CustomizationOption[];
// }

// // --- UPDATED ORDER INTERFACE ---
// export interface Order {
//   id: string;
//   restaurantId?: string;           // MADE OPTIONAL (matches your provider)
//   restaurantName: string;
//   items: CartItem[];
//   total: number;
//   status: 'Placed' | 'Preparing' | 'Ready' | 'On the way' | 'Delivered' | 'Cancelled';
//   deliveryAddress: Address | string; // UPDATED to accept EITHER an Address object OR a string
//   paymentMethod?: string;          // MADE OPTIONAL (matches your provider)
//   createdAt: string;
//   deliveredAt?: string;
// }

// export interface Offer {
//   id: string;
//   title: string;
//   description: string;
//   code: string;
//   discount: number;
//   minOrder: number;
//   expiryDate: string;
// }

// export interface Category {
//   id: string;
//   name: string;
//   icon: string;
//   image: string;
// }

// export interface Review {
//   id: string;
//   userId: string;
//   userName: string;
//   userAvatar?: string;
//   rating: number;
//   comment: string;
//   createdAt: string;
// }

// export interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   loading: boolean;
//   error: string | null;
// }

// export interface CartState {
//   items: CartItem[];
//   totalItems: number;
//   totalPrice: number;
//   restaurantId: string | null;
// }

// export interface OrderState {
//   orders: Order[];
//   currentOrder: Order | null;
//   loading: boolean;
//   error: string | null;
// }

// export interface RestaurantState {
//   restaurants: Restaurant[];
//   categories: Category[];
//   selectedRestaurant: Restaurant | null;
//   loading: boolean;
//   error: string | null;
// }
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
  costForTwo: string;
  address: string;
  offers?: Offer[];
  isVeg: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  isBestSeller: boolean;
  isVeg: boolean;
  category: string;
  customization?: Customization[];
}

export interface Customization {
  id: string;
  name: string;
  options: CustomizationOption[];
  required: boolean;
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  restaurantId: string;  // Changed to string to match Restaurant.id
  restaurantName: string;
  customization?: CustomizationOption[];
}

export interface Order {
  id: string;
  restaurantId?: string;
  restaurantName: string;
  items: CartItem[];
  total: number;
  status: 'Placed' | 'Preparing' | 'Ready' | 'On the way' | 'Delivered' | 'Cancelled';
  deliveryAddress: Address | string;
  paymentMethod?: string;
  createdAt: string;
  deliveredAt?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: number;
  minOrder: number;
  expiryDate: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  restaurantId: string | null;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

export interface RestaurantState {
  restaurants: Restaurant[];
  categories: Category[];
  selectedRestaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
}