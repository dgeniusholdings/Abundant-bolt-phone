import { useState, useEffect } from 'react';
import { Flame, ArrowRight, Bolt, Timer, Sparkles } from 'lucide-react';

interface FlashDeal {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  sold: number;
  total: number;
}

const flashDeals: FlashDeal[] = [
  {
    id: '1',
    name: 'Wireless Earbuds Pro',
    image: 'https://images.pexels.com/photos/3780691/pexels-photo-3780691.jpeg?w=400&h=400&fit=crop',
    price: 49.99,
    originalPrice: 89.99,
    discount: 44,
    sold: 847,
    total: 1000,
  },
  {
    id: '2',
    name: 'Smart Watch Series X',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?w=400&h=400&fit=crop',
    price: 149.99,
    originalPrice: 249.99,
    discount: 40,
    sold: 723,
    total: 800,
  },
  {
    id: '3',
    name: '4K Drone Camera',
    image: 'https://images.pexels.com/photos/442589/pexels-photo-442589.jpeg?w=400&h=400&fit=crop',
    price: 299.99,
    originalPrice: 499.99,
    discount: 40,
    sold: 312,
    total: 400,
  },
  {
    id: '4',
    name: 'Kitchen Stand Mixer',
    image: 'https://images.pexels.com/photos/4226893/pexels-photo-4226893.jpeg?w=400&h=400&fit=crop',
    price: 199.99,
    originalPrice: 349.99,
    discount: 43,
    sold: 189,
    total: 250,
  },
];

function DealProgress({ sold, total }: { sold: number; total: number }) {
  const percentage = Math.min((sold / total) * 100, 100);
  const isLow = percentage >= 80;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className={isLow ? 'text-red-400 font-bold' : 'text-white/60'}>{sold} sold</span>
        <span className={isLow ? 'text-red-400 font-bold animate-pulse' : 'text-white/60'}>
          {isLow ? 'Almost gone!' : `${total - sold} left`}
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isLow
              ? 'bg-gradient-to-r from-red-500 to-orange-500'
              : 'bg-gradient-to-r from-brand-400 to-amber-400'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function DealCard({ deal, index }: { deal: FlashDeal; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 ${
        isHovered ? 'scale-105 shadow-2xl border-white/20' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Flash overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-700 ${
        isHovered ? 'translate-x-full' : ''
      }`} />

      <div className="flex items-center gap-4 p-3">
        {/* Image */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
          <img
            src={deal.image}
            alt={deal.name}
            className="w-full h-full object-cover transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute bottom-1 left-1 bg-brand-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            -{deal.discount}%
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-1">
          <h4 className="text-sm font-semibold text-white truncate mb-2">{deal.name}</h4>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-brand-400">${deal.price}</span>
            <span className="text-xs text-white/40 line-through">${deal.originalPrice}</span>
          </div>
          <DealProgress sold={deal.sold} total={deal.total} />
        </div>
      </div>
    </div>
  );
}

export function FlashSale() {
  const [time, setTime] = useState({ hours: 5, minutes: 23, seconds: 47 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => {
        let { hours, minutes, seconds } = t;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-slate-900 to-ink-900">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-brand-600/20 via-transparent to-purple-600/20 animate-gradient-shift" />
        </div>
        {/* Animated flame particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-brand-400/30 rounded-full animate-float"
              style={{
                left: `${15 + i * 15}%`,
                bottom: '10%',
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
      <div className="absolute -right-32 bottom-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />

      <div className="container-padding relative py-10 md:py-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="flex items-center gap-6">
            {/* Animated flame icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500 blur-xl opacity-50 rounded-full animate-pulse" />
              <div className="relative bg-gradient-to-br from-brand-500 to-amber-500 rounded-2xl p-4">
                <Flame className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span className="text-brand-400 text-xs font-bold tracking-widest uppercase">Limited Time</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Flash Sale
              </h2>
              <p className="text-white/50 text-sm">Up to 70% off - Don't miss out!</p>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/60">
              <Timer className="w-4 h-4" />
              <span className="text-xs font-medium">Ends in:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { value: pad(time.hours), label: 'HRS' },
                { value: pad(time.minutes), label: 'MIN' },
                { value: pad(time.seconds), label: 'SEC' },
              ].map((unit, i) => (
                <div key={unit.label} className="flex items-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center min-w-[56px] border border-white/10">
                    <div className="text-2xl font-bold text-white tabular-nums font-mono">{unit.value}</div>
                    <div className="text-white/40 text-[9px] font-medium tracking-wider">{unit.label}</div>
                  </div>
                  {i < 2 && <span className="text-white/30 font-bold text-xl mx-1">:</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deals grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {flashDeals.map((deal, i) => (
            <DealCard key={deal.id} deal={deal} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-8">
          <a
            href="#deals"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-brand-500 to-amber-500 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-brand-500/30 hover:shadow-brand-500/50 transition-all duration-300 active:scale-[0.97] overflow-hidden"
          >
            <Bolt className="w-5 h-5" />
            <span>View All Flash Deals</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
