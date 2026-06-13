import { Truck, RefreshCcw, ShieldCheck, Headphones } from 'lucide-react';

const items = [
  { icon: Truck, title: 'Free shipping', sub: 'Orders over $50' },
  { icon: RefreshCcw, title: '30-day returns', sub: 'Easy & hassle-free' },
  { icon: ShieldCheck, title: 'Secure checkout', sub: '256-bit encryption' },
  { icon: Headphones, title: '24/7 Support', sub: 'Always here for you' },
];

export function TrustSection() {
  return (
    <div className="bg-white border-b border-ink-100">
      <div className="container-padding">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-center gap-3 py-4 px-3 md:px-4 ${
                  i < items.length - 1 ? 'border-r border-ink-100' : ''
                } ${i >= 2 ? 'border-t border-ink-100 md:border-t-0' : ''}`}
              >
                <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-brand-500 w-[18px] h-[18px]" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink-800 leading-tight">{item.title}</div>
                  <div className="text-xs text-ink-400 leading-tight mt-0.5">{item.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
