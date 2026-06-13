import { Truck, RefreshCcw, ShieldCheck, Headphones, Zap, Award, CreditCard, Package } from 'lucide-react';

const items = [
  { icon: Truck, title: 'Free Shipping', sub: 'On orders $50+', gradient: 'from-emerald-500 to-teal-500' },
  { icon: RefreshCcw, title: 'Easy Returns', sub: '30-day guarantee', gradient: 'from-blue-500 to-cyan-500' },
  { icon: ShieldCheck, title: 'Secure Checkout', sub: '256-bit SSL', gradient: 'from-purple-500 to-violet-500' },
  { icon: Headphones, title: '24/7 Support', sub: 'Always here', gradient: 'from-amber-500 to-orange-500' },
];

const stats = [
  { icon: Package, value: '50,000+', label: 'Products Available' },
  { icon: Award, value: '99.2%', label: 'Satisfaction Rate' },
  { icon: CreditCard, value: '10M+', label: 'Orders Fulfilled' },
  { icon: Zap, value: '< 48h', label: 'Avg Shipping Time' },
];

export function TrustSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-48 right-0 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-60" />
      </div>

      {/* Trust badges */}
      <div className="relative border-b border-ink-100">
        <div className="container-padding">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`group relative flex items-center gap-4 py-6 px-4 md:px-6 transition-all duration-300 hover:bg-ink-50 ${
                    i < items.length - 1 ? 'border-r border-ink-100' : ''
                  } ${i >= 2 ? 'border-t border-ink-100 md:border-t-0' : ''}`}
                >
                  {/* Animated gradient ring */}
                  <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} p-[2px] group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
                      <Icon className="w-5 h-5 text-ink-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-ink-900 group-hover:text-brand-600 transition-colors duration-300">
                      {item.title}
                    </div>
                    <div className="text-xs text-ink-400 group-hover:text-ink-600 transition-colors duration-300">
                      {item.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative bg-gradient-to-r from-ink-900 via-slate-900 to-ink-900 py-8">
        {/* Subtle animated gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50" />

        <div className="container-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center justify-center gap-4 text-center md:text-left"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="hidden md:block w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/40 font-medium tracking-wide uppercase">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-30" />
      </div>
    </section>
  );
}
