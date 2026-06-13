export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: 'hot' | 'new' | 'sale' | 'fast';
  discount?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface TrustCard {
  icon: string;
  title: string;
  description: string;
}
