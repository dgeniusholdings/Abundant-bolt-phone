import { ArrowRight } from 'lucide-react';
import { categories } from '../data';

interface CategoriesProps {
  onCategoryClick: (categoryId: string) => void;
  activeCategory: string | null;
}

export function Categories({ onCategoryClick, activeCategory }: CategoriesProps) {
  return (
    <section id="categories" className="py-8 md:py-10 bg-white">
      <div className="container-padding">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg md:text-xl font-bold text-ink-900">Explore categories</h2>
          <button
            onClick={() => onCategoryClick('')}
            className="flex items-center gap-1 text-brand-500 hover:text-brand-600 text-sm font-semibold transition-colors"
          >
            See all
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-4 gap-2.5 md:gap-3">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => onCategoryClick(isActive ? '' : category.id)}
                className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-ink-200 focus:outline-none"
              >
                {/* Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark overlay */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isActive
                      ? 'bg-brand-500/60'
                      : 'bg-gradient-to-t from-black/75 via-black/25 to-black/10 group-hover:from-black/85 group-hover:via-black/40'
                  }`}
                />

                {/* Active ring */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl ring-2 ring-brand-500 ring-inset" />
                )}

                {/* Label */}
                <div className="absolute inset-x-0 bottom-0 p-2 md:p-3">
                  <span className="block text-white font-semibold text-xs md:text-sm leading-tight">
                    {category.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
