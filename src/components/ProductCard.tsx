import { useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 700);
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-ink-100 hover:border-ink-200 hover:shadow-card-hover transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-ink-50 overflow-hidden">
        {!imageLoaded && <div className="absolute inset-0 bg-ink-100 animate-pulse" />}
        <img
          src={product.image}
          alt={product.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
            {product.badge === 'hot' ? 'Hot' : product.badge === 'new' ? 'New' : 'Sale'}
          </span>
        )}

        {/* Discount badge */}
        {product.discount && (
          <span className="absolute top-2 right-2 bg-ink-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 md:p-3 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-xs md:text-sm font-medium text-ink-800 line-clamp-2 leading-snug mb-1.5 flex-1">
          {product.title}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${
                  star <= Math.round(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-ink-200 text-ink-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-ink-400">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Price row */}
        <div className="flex items-baseline gap-1.5 mb-2.5">
          <span className="text-sm md:text-base font-bold text-brand-500">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-ink-400 line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
            isAdding
              ? 'bg-green-500 text-white'
              : 'bg-brand-500 hover:bg-brand-600 text-white'
          }`}
        >
          {isAdding ? (
            'Added!'
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
