import { useState, useEffect } from 'react';
import { Flame, ArrowRight } from 'lucide-react';

export function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 23, seconds: 47 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="py-8 md:py-10 bg-gradient-to-r from-brand-600 to-brand-500 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="container-padding relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Left: text */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-white/80 animate-pulse" />
              <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">Flash Sale</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
              Today&apos;s Lightning Deals
            </h2>
            <p className="text-brand-100 text-sm">Up to 70% off on select items</p>
          </div>

          {/* Center: countdown */}
          <div className="flex items-center gap-2">
            {[
              { label: 'HRS', value: pad(timeLeft.hours) },
              { label: 'MIN', value: pad(timeLeft.minutes) },
              { label: 'SEC', value: pad(timeLeft.seconds) },
            ].map((unit, i) => (
              <div key={unit.label} className="flex items-center gap-2">
                <div className="bg-ink-900/50 backdrop-blur-sm rounded-lg px-3 py-2 text-center min-w-[52px]">
                  <div className="text-xl font-bold text-white tabular-nums">{unit.value}</div>
                  <div className="text-white/50 text-[10px] font-medium">{unit.label}</div>
                </div>
                {i < 2 && <span className="text-white/60 font-bold text-lg">:</span>}
              </div>
            ))}
          </div>

          {/* Right: CTA */}
          <a
            href="#deals"
            className="flex items-center gap-2 bg-white text-brand-600 font-bold px-5 py-3 rounded-lg hover:bg-brand-50 transition-colors text-sm whitespace-nowrap self-start sm:self-center group"
          >
            View Deals
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
