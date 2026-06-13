import { X, Tag, TrendingUp, Layers, User, Heart } from 'lucide-react';
import { categories } from '../data';
import { Logo } from './Logo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryClick: (categoryId: string) => void;
}

export function MobileMenu({ isOpen, onClose, onCategoryClick }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-fade-in lg:hidden"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white z-50 animate-slide-in-right overflow-y-auto lg:hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-ink-100">
          <Logo className="h-8 w-auto" />
          <button
            onClick={onClose}
            className="p-1.5 text-ink-400 hover:text-ink-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-3 border-b border-ink-100">
          <ul className="space-y-0.5">
            {[
              { href: '#deals', icon: Tag, label: "Today's Deals" },
              { href: '#trending', icon: TrendingUp, label: 'Trending' },
              { href: '#categories', icon: Layers, label: 'All Categories' },
            ].map(({ href, icon: Icon, label }) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2.5 rounded-lg text-ink-600 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                >
                  <Icon className="w-[18px] h-[18px] text-brand-500 shrink-0" />
                  <span className="text-sm font-medium">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Categories */}
        <div className="p-3 flex-1">
          <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider px-2 mb-2">
            Shop by Category
          </p>
          <ul className="space-y-0.5">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => { onCategoryClick(cat.id); onClose(); }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg text-ink-700 hover:bg-ink-50 hover:text-ink-900 transition-colors"
                >
                  <span className="text-sm font-medium">{cat.name}</span>
                  <span className="text-xs text-ink-400">{cat.count.toLocaleString()}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div className="p-3 border-t border-ink-100">
          <ul className="space-y-0.5">
            {[
              { icon: User, label: 'My Account' },
              { icon: Heart, label: 'Wishlist' },
            ].map(({ icon: Icon, label }) => (
              <li key={label}>
                <a href="#" className="flex items-center gap-3 p-2.5 rounded-lg text-ink-600 hover:bg-ink-50 hover:text-ink-900 transition-colors">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
