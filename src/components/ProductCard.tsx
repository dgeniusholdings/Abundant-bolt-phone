import { useState } from 'react';
import { Star, ShoppingCart, Heart, Eye, Zap } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 700);
  };

  const discountPercent = product.discount || Math.round((1 - product.price / product.originalPrice) * 100);
  const savings = product.originalPrice - product.price;

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden border border-ink-100 hover:border-brand-200 hover:shadow-xl transition-all duration-500 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quick action buttons */}
      <div className={`absolute top-3 right-3 flex flex-col gap-2 z-10 transition-all duration-300 ${
        isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`w-9 h-9 rounded-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-lg ${
            isLiked
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-ink-500 hover:text-red-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
        <button
          className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-ink-500 hover:text-brand-500 hover:bg-white shadow-lg transition-all duration-300"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Image container */}
      <div className="relative aspect-square bg-ink-50 overflow-hidden">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-ink-100 via-ink-50 to-ink-100 animate-pulse" />
        )}

        {/* Product image */}
        <img
          src={product.image}
          alt={product.title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Shine effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700 ${
          isHovered ? 'translate-x-full' : ''
        }`} />

        {/* Status badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.badge && (
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg ${
              product.badge === 'hot'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                : product.badge === 'new'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                : 'bg-gradient-to-r from-brand-500 to-amber-500 text-white'
            }`}>
              {product.badge === 'hot' ? 'HOT' : product.badge === 'new' ? 'NEW' : 'SALE'}
            </span>
          )}

          {/* Discount badge */}
          {discountPercent > 0 && (
            <span className="bg-ink-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
              <Zap className="w-3 h-3" />
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Add to cart button overlay on mobile/hover */}
        <div className={`absolute inset-x-0 bottom-0 p-3 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold backdrop-blur-md transition-all duration-300 ${
              isAdding
                ? 'bg-green-500 text-white'
                : 'bg-white/95 text-ink-900 hover:bg-brand-500 hover:text-white'
            }`}
          >
            {isAdding ? (
              <>
                <ShoppingCart className="w-4 h-4" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        <div className="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mb-1.5">
          {product.category}
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-ink-800 line-clamp-2 leading-snug mb-2 flex-1 group-hover:text-brand-600 transition-colors duration-300">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${
                  star <= Math.round(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-ink-200 text-ink-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-ink-400 font-medium">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-brand-500">${product.price.toFixed(2)}</span>
            <span className="text-xs text-ink-400 line-through ml-1.5">${product.originalPrice.toFixed(2)}</span>
          </div>
          {savings > 0 && (
            <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded">
              Save ${savings.toFixed(0)}
            </span>
          )}
        </div>

        {/* Add to cart button - always visible */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 active:scale-[0.97] ${
            isAdding
              ? 'bg-green-500 text-white'
              : 'bg-brand-500 hover:bg-brand-600 text-white'
          }`}
        >
          {isAdding ? (
            'Added!'
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
