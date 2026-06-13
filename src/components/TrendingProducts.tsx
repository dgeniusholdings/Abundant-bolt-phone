import { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface TrendingProductsProps {
  products: Product[];
}

export function TrendingProducts({ products }: TrendingProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
    }
  };

  return (
    <section id="trending" className="py-8 md:py-10 bg-ink-50 border-t border-ink-100">
      <div className="container-padding">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg md:text-xl font-bold text-ink-900">Trending now</h2>
          <div className="flex items-center gap-2">
            {/* Desktop scroll buttons */}
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex p-1.5 rounded-full border border-ink-200 text-ink-400 hover:text-ink-700 hover:border-ink-400 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex p-1.5 rounded-full border border-ink-200 text-ink-400 hover:text-ink-700 hover:border-ink-400 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <a
              href="#"
              className="flex items-center gap-1 text-brand-500 hover:text-brand-600 text-sm font-semibold transition-colors"
            >
              Shop all
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory
                     md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[168px] snap-start md:w-auto"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
