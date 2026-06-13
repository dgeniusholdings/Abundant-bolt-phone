import { ArrowRight, Sparkles } from 'lucide-react';
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
    <section id="deals" className="py-10 md:py-14 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="container-padding relative">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span className="text-xs font-bold text-brand-500 tracking-wider uppercase">Curated for you</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-ink-900">{title}</h2>
            {subtitle && (
              <p className="text-sm text-ink-400 mt-1">{subtitle}</p>
            )}
          </div>
          <a
            href="#"
            className="group flex items-center gap-2 text-brand-500 hover:text-brand-600 text-sm font-semibold transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard product={product} />
            </div>
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
