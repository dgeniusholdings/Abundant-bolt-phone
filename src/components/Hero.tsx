import { ArrowRight, Star, Zap, Eye, TrendingUp, Flame } from 'lucide-react';

const heroProducts = [
  {
    id: 'main',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?w=600&h=600&fit=crop',
    name: 'Smart Watch Series X',
    price: 149.99,
    originalPrice: 249.99,
    discount: 40,
    rating: 4.8,
    reviews: '1.5K',
    tag: 'Best Seller',
    tagColor: 'bg-brand-500',
  },
  {
    id: 'top',
    image: 'https://images.pexels.com/photos/3780691/pexels-photo-3780691.jpeg?w=400&h=400&fit=crop',
    name: 'Wireless Earbuds Pro',
    price: 49.99,
    originalPrice: 89.99,
    discount: 44,
    rating: 4.7,
    reviews: '2.8K',
    tag: 'Hot Deal',
    tagColor: 'bg-red-500',
  },
  {
    id: 'bottom',
    image: 'https://images.pexels.com/photos/442589/pexels-photo-442589.jpeg?w=400&h=400&fit=crop',
    name: '4K Drone Camera',
    price: 299.99,
    originalPrice: 499.99,
    discount: 40,
    rating: 4.9,
    reviews: '876',
    tag: 'Trending',
    tagColor: 'bg-blue-500',
  },
];

const stats = [
  { value: '50K+', label: 'Products' },
  { value: '100K+', label: 'Customers' },
  { value: '4.8★', label: 'Avg Rating' },
];

const quickCategories = [
  { label: 'Electronics', href: '#categories' },
  { label: 'Fashion', href: '#categories' },
  { label: 'Home & Kitchen', href: '#categories' },
  { label: 'Beauty', href: '#categories' },
  { label: 'Tools', href: '#categories' },
];

function HeroProductCard({
  product,
  className = '',
  imageClass = 'h-40',
  animClass = '',
}: {
  product: typeof heroProducts[0];
  className?: string;
  imageClass?: string;
  animClass?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 ${animClass} ${className}`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden bg-ink-50 ${imageClass}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* Tag */}
        <span
          className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-bold text-white rounded-full ${product.tagColor}`}
        >
          {product.tag}
        </span>
        {/* Discount */}
        <span className="absolute top-2.5 right-2.5 bg-ink-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg">
          -{product.discount}%
        </span>
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <p className="text-xs font-semibold text-ink-800 truncate mb-1">{product.name}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-brand-500">${product.price}</span>
            <span className="text-[10px] text-ink-400 line-through">${product.originalPrice}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] text-ink-500">{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50/40">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-400/4 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, #0F172A 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="container-padding relative">
        <div className="grid lg:grid-cols-[1fr_480px] gap-8 lg:gap-12 items-center min-h-[520px] lg:min-h-[600px] py-12 lg:py-16">

          {/* ── LEFT: Text content ── */}
          <div className="flex flex-col gap-6 animate-slide-in-left">

            {/* Live deal badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-3.5 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span className="text-red-600 text-xs font-bold tracking-wide uppercase">Flash Sale Live</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200 rounded-full px-3 py-1.5">
                <Zap className="w-3.5 h-3.5 text-brand-500" />
                <span className="text-brand-600 text-xs font-bold tracking-wide">Up to 70% off today</span>
              </div>
            </div>

            {/* Headline */}
            <div>
              <h1 className="font-bold leading-[1.1] tracking-tight">
                <span
                  className="block text-brand-500"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)' }}
                >
                  Abundant deals.
                </span>
                <span
                  className="block text-ink-900"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)' }}
                >
                  Every day,
                </span>
                <span
                  className="block text-ink-900"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)' }}
                >
                  every aisle.
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-ink-500 text-base md:text-lg leading-relaxed max-w-md">
              Electronics, home goods, fashion &amp; more — shop thousands of products at prices you&apos;ll love.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#deals"
                className="group inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-200 active:scale-[0.98]"
              >
                Shop Today's Deals
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              <a
                href="#categories"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-ink-50 text-ink-800 font-semibold px-7 py-3.5 rounded-xl border border-ink-200 hover:border-ink-300 shadow-sm transition-all duration-200"
              >
                Browse Categories
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 sm:gap-8 pt-2 border-t border-ink-100">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="text-xl md:text-2xl font-bold text-ink-900">{s.value}</div>
                  <div className="text-xs text-ink-400 font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick category chips */}
            <div className="flex flex-wrap gap-2">
              {quickCategories.map((cat) => (
                <a
                  key={cat.label}
                  href={cat.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-ink-200 rounded-full text-xs font-medium text-ink-600 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200 shadow-sm"
                >
                  {cat.label}
                </a>
              ))}
              <a
                href="#categories"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
              >
                See all <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* ── RIGHT: Product mosaic ── */}
          <div className="relative h-[420px] lg:h-[520px] hidden md:block">

            {/* Main card — left, tall */}
            <div className="absolute left-0 top-4 w-[52%] bottom-4 animate-float">
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.22)] transition-shadow duration-300">
                <div className="relative overflow-hidden bg-ink-50" style={{ height: '65%' }}>
                  <img
                    src={heroProducts[0].image}
                    alt={heroProducts[0].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-white rounded-full ${heroProducts[0].tagColor}`}>
                    {heroProducts[0].tag}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-bold text-ink-900 mb-1">{heroProducts[0].name}</p>
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-ink-200 text-ink-200'}`} />
                    ))}
                    <span className="text-xs text-ink-500 ml-1">{heroProducts[0].reviews} reviews</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-brand-500">${heroProducts[0].price}</span>
                      <span className="text-xs text-ink-400 line-through ml-1.5">${heroProducts[0].originalPrice}</span>
                    </div>
                    <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                      -{heroProducts[0].discount}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top-right card */}
            <div className="absolute right-0 top-0 w-[45%] h-[47%] animate-float-slow">
              <HeroProductCard
                product={heroProducts[1]}
                className="w-full h-full"
                imageClass="h-[60%]"
              />
            </div>

            {/* Bottom-right card */}
            <div className="absolute right-0 bottom-0 w-[45%] h-[47%] animate-float-delayed">
              <HeroProductCard
                product={heroProducts[2]}
                className="w-full h-full"
                imageClass="h-[60%]"
              />
            </div>

            {/* Floating: discount burst */}
            <div className="absolute -right-2 top-[20%] animate-bounce-subtle z-10">
              <div className="bg-brand-500 text-white rounded-full w-14 h-14 flex flex-col items-center justify-center shadow-lg shadow-brand-500/40">
                <span className="text-[10px] font-bold leading-none">UP TO</span>
                <span className="text-lg font-black leading-none">70%</span>
                <span className="text-[10px] font-bold leading-none">OFF</span>
              </div>
            </div>

            {/* Floating: live viewers */}
            <div className="absolute left-2 -bottom-2 z-10">
              <div className="bg-white rounded-xl px-3 py-2 shadow-lg border border-ink-100 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <Eye className="w-3.5 h-3.5 text-ink-500" />
                <span className="text-xs font-semibold text-ink-700">247 viewing now</span>
              </div>
            </div>

            {/* Floating: trending badge */}
            <div className="absolute left-[53%] top-[46%] -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-ink-900 text-white rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
                <span className="text-[11px] font-bold whitespace-nowrap">Trending today</span>
              </div>
            </div>

            {/* Subtle grid background for the right column */}
            <div
              className="absolute inset-0 rounded-3xl -z-10 opacity-40"
              style={{
                background: 'radial-gradient(ellipse at 50% 50%, rgba(232,98,26,0.06) 0%, transparent 70%)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
