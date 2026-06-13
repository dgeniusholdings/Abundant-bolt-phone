import { ArrowRight } from 'lucide-react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface FeaturedDealsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export function FeaturedDeals({
  products,
  title = 'Featured products',
  subtitle,
}: FeaturedDealsProps) {
  return (
    <section id="deals" className="py-8 md:py-10 bg-white">
      <div className="container-padding">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-ink-900">{title}</h2>
            {subtitle && <p className="text-xs text-ink-400 mt-0.5">{subtitle}</p>}
          </div>
          <a
            href="#"
            className="flex items-center gap-1 text-brand-500 hover:text-brand-600 text-sm font-semibold transition-colors"
          >
            Shop all
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* 2-column grid on mobile, 3 on md, 4 on lg */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16 text-ink-400">
            <p className="text-sm">No products found. Try a different search or category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
