import { useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { categories } from '../data';

interface CategoriesProps {
  onCategoryClick: (categoryId: string) => void;
  activeCategory: string | null;
}

function CategoryCard({ category, isActive, onClick, index }: {
  category: typeof categories[0];
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const gradients = [
    'from-brand-500/80 to-amber-500/80',
    'from-purple-500/80 to-pink-500/80',
    'from-cyan-500/80 to-teal-500/80',
    'from-emerald-500/80 to-green-500/80',
    'from-blue-500/80 to-indigo-500/80',
    'from-rose-500/80 to-red-500/80',
    'from-violet-500/80 to-purple-500/80',
    'from-orange-500/80 to-amber-500/80',
  ];

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex-shrink-0 w-40 md:w-48 aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer focus:outline-none ${
        isActive ? 'ring-4 ring-brand-500 ring-offset-4 ring-offset-white scale-105 shadow-2xl' : 'hover:shadow-2xl'
      }`}
      style={{
        transform: isHovered && !isActive ? 'scale(1.05) translateY(-8px)' : undefined,
        zIndex: isHovered || isActive ? 10 : undefined,
      }}
    >
      {/* Background image */}
      <img
        src={category.image}
        alt={category.name}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
          isHovered || isActive ? 'scale-110' : 'scale-100'
        }`}
      />

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${gradients[index % gradients.length]}`} />

      {/* Dark overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        isActive
          ? 'bg-brand-500/40'
          : isHovered
          ? 'bg-black/10'
          : 'bg-black/20'
      }`} />

      {/* Shine effect on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700 ${
          isHovered ? 'translate-x-full' : ''
        }`}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        {/* Animated count badge */}
        <div className={`absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 transition-all duration-300 ${
          isHovered || isActive ? 'opacity-100 scale-100' : 'opacity-70 scale-90'
        }`}>
          <span className="text-xs font-bold text-white">{category.count.toLocaleString()}</span>
        </div>

        {/* Center icon glow */}
        <div className={`relative mb-3 transition-transform duration-500 ${
          isHovered || isActive ? 'scale-110' : 'scale-100'
        }`}>
          <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 ${
            isHovered || isActive ? 'opacity-60 bg-white/50' : 'opacity-0'
          }`} />
          <div className="relative w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Sparkles className={`w-6 h-6 text-white transition-all duration-300 ${
              isHovered || isActive ? 'rotate-12 scale-110' : ''
            }`} />
          </div>
        </div>

        {/* Title */}
        <span className={`text-white font-bold text-sm md:text-base text-center transition-all duration-300 ${
          isHovered || isActive ? 'text-shadow-lg scale-105' : ''
        }`}>
          {category.name}
        </span>

        {/* Subtext */}
        <span className={`text-white/60 text-xs mt-1 transition-opacity duration-300 ${
          isHovered || isActive ? 'opacity-100' : 'opacity-0'
        }`}>
          Shop now
        </span>
      </div>

      {/* Bottom shine */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
    </button>
  );
}

export function Categories({ onCategoryClick, activeCategory }: CategoriesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 400);
  };

  return (
    <section id="categories" className="py-10 md:py-14 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-50 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 opacity-60" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
      </div>

      <div className="container-padding relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span className="text-xs font-bold text-brand-500 tracking-wider uppercase">Popular Categories</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-ink-900">Shop by Category</h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Scroll controls */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  canScrollLeft
                    ? 'bg-ink-100 hover:bg-ink-200 text-ink-700'
                    : 'bg-ink-50 text-ink-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  canScrollRight
                    ? 'bg-ink-100 hover:bg-ink-200 text-ink-700'
                    : 'bg-ink-50 text-ink-300 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => onCategoryClick('')}
              className="flex items-center gap-1.5 text-brand-500 hover:text-brand-600 text-sm font-semibold transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories scroll container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
        >
          {categories.map((category, i) => (
            <div key={category.id} className="snap-start">
              <CategoryCard
                category={category}
                isActive={activeCategory === category.id}
                onClick={() => onCategoryClick(activeCategory === category.id ? '' : category.id)}
                index={i}
              />
            </div>
          ))}

          {/* Show all card */}
          <button
            onClick={() => onCategoryClick('')}
            className="flex-shrink-0 w-40 md:w-48 aspect-[3/4] rounded-2xl bg-gradient-to-br from-ink-100 to-ink-200 flex flex-col items-center justify-center gap-3 hover:from-ink-200 hover:to-ink-300 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <ArrowRight className="w-5 h-5 text-ink-600" />
            </div>
            <span className="text-sm font-bold text-ink-700">View All</span>
            <span className="text-xs text-ink-500">8 categories</span>
          </button>
        </div>

        {/* Mobile scroll hint */}
        <div className="flex justify-center gap-1.5 mt-4 md:hidden">
          {categories.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-ink-200" />
          ))}
        </div>
      </div>
    </section>
  );
}
