import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Star, Zap, Flame, Play, Sparkles, ChevronRight, Clock, Users } from 'lucide-react';

interface MousePosition {
  x: number;
  y: number;
}

function ParallaxCard({ children, intensity = 20, className = '' }: { children: React.ReactNode; intensity?: number; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={cardRef}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateY(${mousePos.x * intensity}deg) rotateX(${-mousePos.y * intensity}deg) translateZ(10px)`
          : 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
    >
      {children}
    </div>
  );
}

function GlowingOrb({ className, color = 'brand' }: { className?: string; color?: 'brand' | 'purple' | 'teal' | 'amber' }) {
  const colorClasses = {
    brand: 'bg-brand-400/30',
    purple: 'bg-purple-400/30',
    teal: 'bg-teal-400/30',
    amber: 'bg-amber-400/30',
  };
  return (
    <div className={`absolute rounded-full blur-3xl animate-pulse-slow ${colorClasses[color]} ${className}`} />
  );
}

function CountdownTimer() {
  const [time, setTime] = useState({ hours: 11, minutes: 47, seconds: 33 });

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
    <div className="flex items-center gap-1.5">
      {[
        { value: pad(time.hours), label: 'HRS' },
        { value: pad(time.minutes), label: 'MIN' },
        { value: pad(time.seconds), label: 'SEC' },
      ].map((unit, i) => (
        <div key={unit.label} className="flex items-center">
          <div className="bg-ink-900/80 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-center min-w-[44px]">
            <div className="text-lg font-bold text-white tabular-nums font-mono">{unit.value}</div>
            <div className="text-white/40 text-[9px] font-medium tracking-wider">{unit.label}</div>
          </div>
          {i < 2 && <span className="text-white/30 font-bold mx-0.5">:</span>}
        </div>
      ))}
    </div>
  );
}

function MarqueeBanner() {
  const items = [
    'Free shipping on orders $50+',
    '30-day hassle-free returns',
    'Secure payment processing',
    '24/7 customer support',
    'New arrivals daily',
    'Exclusive member deals',
  ];

  return (
    <div className="bg-ink-900 overflow-hidden py-2.5">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-4 mx-8">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-medium text-white/90">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const [showVideo, setShowVideo] = useState(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <MarqueeBanner />
      <section className="relative overflow-hidden min-h-[90vh] lg:min-h-[95vh]">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-ink-900 to-slate-900">
          {/* Animated mesh gradient */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 20% 40%, rgba(234,88,12,0.15) 0%, transparent 50%),
                radial-gradient(ellipse 60% 40% at 80% 20%, rgba(168,85,247,0.15) 0%, transparent 50%),
                radial-gradient(ellipse 50% 30% at 50% 80%, rgba(20,184,166,0.1) 0%, transparent 50%)
              `,
              transform: `translate(${(mousePosition.x - 0.5) * 20}px, ${(mousePosition.y - 0.5) * 20}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          />
        </div>

        {/* Floating orbs */}
        <GlowingOrb className="w-[600px] h-[600px] -top-48 -left-48" color="brand" />
        <GlowingOrb className="w-[500px] h-[500px] -bottom-24 -right-24" color="purple" />
        <GlowingOrb className="w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="teal" />

        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" />

        <div className="container-padding relative py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT: Content */}
            <div className="flex flex-col gap-8 text-center lg:text-left">
              {/* Live badge */}
              <div className="flex items-center justify-center lg:justify-start gap-3 animate-fade-in-up">
                <div className="flex items-center gap-2.5 bg-brand-500/20 border border-brand-500/30 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500" />
                  </span>
                  <Flame className="w-4 h-4 text-brand-400" />
                  <span className="text-brand-300 text-xs font-bold tracking-widest uppercase">Flash Sale Live</span>
                </div>
                <CountdownTimer />
              </div>

              {/* Headline */}
              <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500/10 to-purple-500/10 backdrop-blur-sm border border-white/5 rounded-full px-4 py-1.5 mx-auto lg:mx-0">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  <span className="text-xs font-semibold text-white/70 tracking-wider">NEW COLLECTION DROP</span>
                </div>
                <h1 className="font-black leading-[0.95] tracking-tight">
                  <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white">
                    Unbelievable
                  </span>
                  <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-brand-400 via-amber-400 to-brand-500 bg-clip-text text-transparent">
                    Deals Await
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-white/50 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Premium products, jaw-dropping prices. From electronics to fashion — discover your next obsession.
                </p>
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-center lg:justify-start gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {[
                  { value: '50K+', label: 'Happy Customers', icon: Users },
                  { value: '4.9', label: 'Average Rating', icon: Star },
                  { value: '24/7', label: 'Support', icon: Clock },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <stat.icon className="w-4 h-4 text-brand-400" />
                    <div>
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-white/40">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <a
                  href="#deals"
                  className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-brand-500 to-amber-500 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-brand-500/30 hover:shadow-brand-500/50 transition-all duration-300 active:scale-[0.97] overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-brand-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Zap className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Shop Flash Deals</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </a>
                <button
                  onClick={() => setShowVideo(true)}
                  className="group inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-semibold px-7 py-4 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                  <span>Watch Story</span>
                </button>
              </div>

              {/* Quick nav pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'].map((cat) => (
                  <a
                    key={cat}
                    href="#categories"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-sm font-medium text-white/70 hover:text-white transition-all duration-200"
                  >
                    {cat}
                    <ChevronRight className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT: Product showcase */}
            <div className="relative hidden lg:block">
              {/* Main product card with glass effect */}
              <ParallaxCard intensity={8} className="ml-8">
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-1.5 border border-white/10 shadow-2xl">
                  <div className="bg-ink-900/50 rounded-[22px] overflow-hidden">
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src="https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?w=600&h=600&fit=crop"
                        alt="Smart Watch"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">BESTSELLER</span>
                        <span className="bg-ink-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">-40%</span>
                      </div>
                      {/* Floating price */}
                      <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                        <div className="text-white/50 text-xs line-through">$249.99</div>
                        <div className="text-2xl font-black text-white">$149.99</div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-2">Smart Watch Series X</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-white/20 text-white/20'}`} />
                          ))}
                        </div>
                        <span className="text-white/50 text-sm">4.8 (1,523 reviews)</span>
                      </div>
                      <button className="w-full bg-gradient-to-r from-brand-500 to-amber-500 text-white font-bold py-3 rounded-xl hover:from-brand-600 hover:to-amber-600 transition-all duration-300 flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </ParallaxCard>

              {/* Floating secondary cards */}
              <div className="absolute -left-12 top-16 w-48 animate-float-slow">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                  <div className="h-32 overflow-hidden">
                    <img
                      src="https://images.pexels.com/photos/3780691/pexels-photo-3780691.jpeg?w=400&h=400&fit=crop"
                      alt="Earbuds"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-xs text-white/70 truncate">Wireless Earbuds</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-brand-400">$49.99</span>
                      <span className="text-xs text-white/30 line-through">$89.99</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 bottom-24 w-52 animate-float-delayed">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                  <div className="h-36 overflow-hidden">
                    <img
                      src="https://images.pexels.com/photos/442589/pexels-photo-442589.jpeg?w=400&h=400&fit=crop"
                      alt="Drone"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-xs text-white/70 truncate">4K Drone Pro</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-brand-400">$299.99</span>
                      <span className="text-xs text-white/30 line-through">$499.99</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Large discount bubble */}
              <div className="absolute -right-4 -top-4 animate-bounce-slow">
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-500 blur-xl opacity-50 rounded-full" />
                  <div className="relative bg-gradient-to-br from-brand-400 to-amber-500 rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-xl border-2 border-white/20">
                    <span className="text-[10px] font-bold text-white/80">UP TO</span>
                    <span className="text-xl font-black text-white">70%</span>
                    <span className="text-[10px] font-bold text-white/80">OFF</span>
                  </div>
                </div>
              </div>

              {/* Live viewers badge */}
              <div className="absolute left-0 bottom-8 animate-pulse-subtle">
                <div className="bg-ink-900/90 backdrop-blur-lg rounded-xl px-4 py-2.5 border border-white/10 shadow-xl flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                  <Users className="w-4 h-4 text-white/60" />
                  <span className="text-xs font-semibold text-white">847 shopping now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8 animate-fade-in" onClick={() => setShowVideo(false)}>
          <div className="relative max-w-4xl w-full aspect-video bg-ink-900 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-white/50">
              <p>Video content would play here</p>
            </div>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
