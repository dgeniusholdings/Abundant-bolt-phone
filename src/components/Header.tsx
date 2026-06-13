import { useState } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Logo } from './Logo';

interface HeaderProps {
  onMenuClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Header({ onMenuClick, searchQuery, setSearchQuery }: HeaderProps) {
  const { openCart, totalItems } = useCart();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-ink-100 shadow-sm">
      <div className="container-padding py-3">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-1 text-ink-500 hover:text-ink-900 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <a href="/" className="flex items-center shrink-0 mr-1" aria-label="Abundant Merchandise home">
            <Logo className="hidden sm:block h-9 w-auto" />
            <Logo compact className="block sm:hidden h-9 w-9" />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5 ml-4 shrink-0">
            <a href="#deals" className="text-ink-600 hover:text-brand-500 text-sm font-medium transition-colors whitespace-nowrap">
              Today's Deals
            </a>
            <a href="#categories" className="text-ink-600 hover:text-brand-500 text-sm font-medium transition-colors whitespace-nowrap">
              Categories
            </a>
            <a href="#trending" className="text-ink-600 hover:text-brand-500 text-sm font-medium transition-colors whitespace-nowrap">
              Trending
            </a>
          </nav>

          {/* Search bar */}
          <div className="flex-1 mx-2 md:mx-4">
            <div
              className={`flex items-center rounded-lg border transition-all duration-200 ${
                isFocused
                  ? 'bg-white border-brand-400 ring-2 ring-brand-500/15'
                  : 'bg-ink-50 border-ink-200 hover:border-ink-300'
              }`}
            >
              <Search className="w-4 h-4 text-ink-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search products & brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="flex-1 bg-transparent text-ink-800 placeholder-ink-400 text-sm py-2.5 px-3 min-w-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-2 text-ink-400 hover:text-ink-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 shrink-0">
            <a
              href="#"
              className="hidden md:block px-3 py-2 text-ink-600 hover:text-brand-500 text-sm font-medium transition-colors whitespace-nowrap"
            >
              Sign In
            </a>

            <button
              onClick={openCart}
              className="relative p-2 text-ink-600 hover:text-brand-500 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-fade-in">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
