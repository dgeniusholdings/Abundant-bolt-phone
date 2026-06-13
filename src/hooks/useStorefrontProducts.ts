import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

export interface StorefrontProductDB {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  price: number;
  original_price: number | null;
  images: string[];
  inventory: number;
  is_active: boolean;
  is_featured: boolean;
  source_type: 'manual' | 'imported';
}

function mapToProduct(sp: StorefrontProductDB, index: number): Product {
  const badges: Array<'hot' | 'new' | 'sale' | 'fast'> = ['hot', 'new', 'sale', 'fast'];
  return {
    id: sp.id,
    title: sp.title,
    category: sp.category || 'general',
    price: Number(sp.price),
    originalPrice: sp.original_price ? Number(sp.original_price) : Number(sp.price) * 1.4,
    rating: 4.2 + Math.random() * 0.7,
    reviewCount: Math.floor(Math.random() * 2000) + 100,
    image: sp.images[0] || `https://images.pexels.com/photos/${[3780691, 437037, 2529148, 1036808, 788946][index % 5]}/pexels-photo-${[3780691, 437037, 2529148, 1036808, 788946][index % 5]}.jpeg?w=400&h=400&fit=crop`,
    badge: sp.is_featured ? 'hot' : badges[index % 4],
    discount: sp.original_price ? Math.round((1 - Number(sp.price) / Number(sp.original_price)) * 100) : undefined,
  };
}

export function useStorefrontProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('storefront_products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (data) {
        const allProducts = data.map((p, i) => mapToProduct(p as StorefrontProductDB, i));
        const featured = data
          .filter(p => p.is_featured)
          .map((p, i) => mapToProduct(p as StorefrontProductDB, i));

        setProducts(allProducts);
        setFeaturedProducts(featured.length > 0 ? featured : allProducts.slice(0, 6));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { products, featuredProducts, loading, error, refetch: loadProducts };
}
