import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { categories } from '../data';
import { Logo } from './Logo';

// Alias for the light variant used in the dark footer
const LogoLight = () => <Logo light className="h-10 w-auto" />;

export function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-300">
      {/* Newsletter mini section */}
      <div className="border-b border-ink-800">
        <div className="container-padding py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Stay in the loop</h3>
              <p className="text-sm text-ink-400">Get exclusive deals delivered to your inbox</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-lg bg-ink-800 border border-ink-700 text-white placeholder-ink-500 focus:border-brand-500 transition-colors"
              />
              <button className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-padding py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <a href="/" className="inline-block mb-4" aria-label="Abundant Merchandise home">
              {/* Invert logo colors for dark background via a white tint overlay approach - use bright variant */}
              <LogoLight />
            </a>
            <p className="text-sm text-ink-400 mb-6 max-w-xs">
              Your one-stop shop for amazing deals. Quality products at prices you&apos;ll love, every day.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a href="mailto:support@abundantmerchandise.com" className="flex items-center gap-2 text-sm text-ink-400 hover:text-brand-400 transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                support@abundantmerchandise.com
              </a>
              <a href="tel:+1-800-555-0123" className="flex items-center gap-2 text-sm text-ink-400 hover:text-brand-400 transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                1-800-555-0123
              </a>
              <div className="flex items-center gap-2 text-sm text-ink-400">
                <MapPin className="w-4 h-4 shrink-0" />
                123 Commerce St, Deal City, DC
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-ink-400 hover:text-brand-400 transition-colors">Home</a></li>
              <li><a href="#deals" className="text-sm text-ink-400 hover:text-brand-400 transition-colors">Today&apos;s Deals</a></li>
              <li><a href="#" className="text-sm text-ink-400 hover:text-brand-400 transition-colors">All Products</a></li>
              <li><a href="#" className="text-sm text-ink-400 hover:text-brand-400 transition-colors">My Account</a></li>
              <li><a href="#" className="text-sm text-ink-400 hover:text-brand-400 transition-colors">My Wishlist</a></li>
              <li><a href="#" className="text-sm text-ink-400 hover:text-brand-400 transition-colors">Order Tracking</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <a href="#categories" className="text-sm text-ink-400 hover:text-brand-400 transition-colors">
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-ink-400 hover:text-brand-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-ink-400 hover:text-brand-400 transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="text-sm text-ink-400 hover:text-brand-400 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-sm text-ink-400 hover:text-brand-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-ink-400 hover:text-brand-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-800">
        <div className="container-padding py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-ink-500">
              © 2024 Abundant Merchandise. All rights reserved.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 bg-ink-800 rounded-lg flex items-center justify-center text-ink-400 hover:bg-brand-500 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-ink-800 rounded-lg flex items-center justify-center text-ink-400 hover:bg-brand-500 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-ink-800 rounded-lg flex items-center justify-center text-ink-400 hover:bg-brand-500 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-ink-800 rounded-lg flex items-center justify-center text-ink-400 hover:bg-brand-500 hover:text-white transition-colors" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            {/* Payment methods */}
            <div className="flex items-center gap-2 text-ink-600">
              <CreditCard className="w-5 h-5" />
              <span className="text-xs">Visa • MC • Amex • PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
