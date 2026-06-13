import { useState } from 'react';
import {
  Truck, Package, Bitcoin, Store, Settings, ArrowLeft, BarChart3,
  ShoppingBag, TrendingUp, DollarSign, PlusCircle
} from 'lucide-react';
import { SupplierManager } from '../components/admin/SupplierManager';
import { ProductSync } from '../components/admin/ProductSync';
import { ManualProducts } from '../components/admin/ManualProducts';
import { StorefrontProducts } from '../components/admin/StorefrontProducts';
import { OrderManager } from '../components/admin/OrderManager';
import { CryptoPayments } from '../components/admin/CryptoPayments';
import { Logo } from '../components/Logo';

type Tab = 'overview' | 'suppliers' | 'products' | 'store' | 'manual' | 'orders' | 'crypto';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',  label: 'Overview',   icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'suppliers', label: 'Suppliers',   icon: <Store className="w-4 h-4" /> },
  { id: 'products',  label: 'Sync Products', icon: <Package className="w-4 h-4" /> },
  { id: 'manual',    label: 'Manual Product', icon: <PlusCircle className="w-4 h-4" /> },
  { id: 'store',     label: 'Store Products', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'orders',    label: 'Orders',      icon: <Truck className="w-4 h-4" /> },
  { id: 'crypto',    label: 'Crypto Pay',  icon: <Bitcoin className="w-4 h-4" /> },
];

function Overview() {
  const cards = [
    { icon: <ShoppingBag className="w-5 h-5" />, label: 'Connected Suppliers', value: '8', sub: 'Ready to activate', color: 'text-brand-500 bg-brand-50' },
    { icon: <Package className="w-5 h-5" />, label: 'Sync Products', value: '0', sub: 'Import from suppliers', color: 'text-blue-500 bg-blue-50' },
    { icon: <PlusCircle className="w-5 h-5" />, label: 'Manual Products', value: '0', sub: 'Add your own inventory', color: 'text-green-500 bg-green-50' },
    { icon: <Truck className="w-5 h-5" />, label: 'Pending Orders', value: '0', sub: 'Awaiting fulfillment', color: 'text-purple-500 bg-purple-50' },
    { icon: <DollarSign className="w-5 h-5" />, label: 'Crypto Volume', value: '$0', sub: 'Confirmed payments', color: 'text-amber-500 bg-amber-50' },
  ];

  const platforms = [
    { name: 'AliExpress', desc: 'World\'s largest marketplace', tag: 'China · 15–30d', tagColor: 'bg-red-100 text-red-600' },
    { name: 'CJ Dropshipping', desc: 'US warehouses, fast shipping', tag: 'US/CN · 7–14d', tagColor: 'bg-blue-100 text-blue-600' },
    { name: 'Spocket', desc: 'Premium US/EU suppliers', tag: 'US/EU · 2–5d', tagColor: 'bg-sky-100 text-sky-600' },
    { name: 'Printful', desc: 'Print-on-demand fulfillment', tag: 'POD · 3–5d', tagColor: 'bg-yellow-100 text-yellow-700' },
    { name: 'Zendrop', desc: '1-click automated fulfillment', tag: 'US · 3–7d', tagColor: 'bg-green-100 text-green-600' },
    { name: 'AutoDS', desc: 'Price monitoring & auto-order', tag: 'Multi · varies', tagColor: 'bg-orange-100 text-orange-600' },
    { name: 'Worldwide Brands', desc: 'Certified wholesale directory', tag: '16M+ products', tagColor: 'bg-purple-100 text-purple-600' },
    { name: 'Crypto Supplier', desc: 'Crypto merch & hardware', tag: 'Crypto payments', tagColor: 'bg-amber-100 text-amber-600' },
  ];

  const cryptos = [
    { cur: 'BTC', name: 'Bitcoin', color: 'text-orange-500' },
    { cur: 'ETH', name: 'Ethereum', color: 'text-blue-500' },
    { cur: 'USDC', name: 'USD Coin', color: 'text-sky-500' },
    { cur: 'USDT', name: 'Tether', color: 'text-teal-500' },
    { cur: 'BNB', name: 'BNB Chain', color: 'text-yellow-500' },
    { cur: 'SOL', name: 'Solana', color: 'text-purple-500' },
    { cur: 'LTC', name: 'Litecoin', color: 'text-slate-500' },
    { cur: 'DOGE', name: 'Dogecoin', color: 'text-amber-500' },
    { cur: 'XRP', name: 'Ripple', color: 'text-indigo-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-ink-100 rounded-xl p-5">
            <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-3`}>{c.icon}</div>
            <div className="text-2xl font-bold text-ink-900 mb-0.5">{c.value}</div>
            <div className="text-sm font-medium text-ink-700">{c.label}</div>
            <div className="text-xs text-ink-400 mt-0.5">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5">
        <h3 className="text-base font-bold text-ink-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a href="#suppliers" className="flex items-center gap-3 bg-white border border-ink-200 rounded-lg p-4 hover:border-brand-300 hover:shadow-sm transition-all group">
            <Store className="w-5 h-5 text-brand-500" />
            <div>
              <div className="font-semibold text-ink-900 text-sm group-hover:text-brand-600">Connect Suppliers</div>
              <div className="text-xs text-ink-400">Add API keys for dropshipping platforms</div>
            </div>
          </a>
          <a href="#manual" className="flex items-center gap-3 bg-white border border-ink-200 rounded-lg p-4 hover:border-brand-300 hover:shadow-sm transition-all group">
            <PlusCircle className="w-5 h-5 text-green-500" />
            <div>
              <div className="font-semibold text-ink-900 text-sm group-hover:text-brand-600">Add Manual Product</div>
              <div className="text-xs text-ink-400">Create products you fulfill yourself</div>
            </div>
          </a>
          <a href="#crypto" className="flex items-center gap-3 bg-white border border-ink-200 rounded-lg p-4 hover:border-brand-300 hover:shadow-sm transition-all group">
            <Bitcoin className="w-5 h-5 text-amber-500" />
            <div>
              <div className="font-semibold text-ink-900 text-sm group-hover:text-brand-600">Accept Crypto</div>
              <div className="text-xs text-ink-400">BTC, ETH, USDC, SOL & more</div>
            </div>
          </a>
        </div>
      </div>

      {/* Platforms */}
      <div>
        <h3 className="text-base font-bold text-ink-900 mb-4">Supported Dropshipping Platforms</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {platforms.map((p) => (
            <div key={p.name} className="bg-white border border-ink-100 rounded-xl p-4 hover:border-brand-200 hover:shadow-sm transition-all">
              <div className="font-semibold text-ink-900 text-sm mb-1">{p.name}</div>
              <div className="text-xs text-ink-500 mb-2">{p.desc}</div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.tagColor}`}>{p.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Crypto */}
      <div>
        <h3 className="text-base font-bold text-ink-900 mb-4">Accepted Cryptocurrencies</h3>
        <div className="bg-ink-900 rounded-xl p-5">
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-4">
            {cryptos.map((c) => (
              <div key={c.cur} className="text-center">
                <div className={`text-xl font-bold ${c.color} mb-1`}>{c.cur}</div>
                <div className="text-[10px] text-ink-400">{c.name}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-ink-800 text-xs text-ink-500">
            Live rates via CoinGecko · Payment addresses generated per order · Auto-expires after 15–30 min
          </div>
        </div>
      </div>

      {/* Guide */}
      <div className="bg-ink-50 border border-ink-200 rounded-xl p-5">
        <h3 className="text-base font-bold text-ink-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-500" /> Getting Started
        </h3>
        <ol className="space-y-2 text-sm text-ink-600">
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">1</span>
            <span><strong>Suppliers</strong> — Add API keys for AliExpress, CJ, Spocket, Printful, Zendrop, AutoDS, etc. Click <strong>Sync</strong> to import their catalog.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">2</span>
            <span><strong>Sync Products</strong> — Browse and import individual products to your storefront with custom pricing.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">3</span>
            <span><strong>Manual Product</strong> — Add your own inventory, local goods, or print-on-demand items you fulfill yourself.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">4</span>
            <span><strong>Store Products</strong> — View all products (imported + manual), edit pricing, toggle visibility, feature items.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">5</span>
            <span><strong>Orders</strong> — Create fulfillments, submit to suppliers, add tracking numbers.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">6</span>
            <span><strong>Crypto Pay</strong> — Generate payment addresses for BTC, ETH, USDC, etc.</span>
          </li>
        </ol>
      </div>
    </div>
  );
}

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':  return <Overview />;
      case 'suppliers': return <SupplierManager />;
      case 'products':  return <ProductSync />;
      case 'manual':    return <ManualProducts onSaved={() => setActiveTab('store')} />;
      case 'store':     return <StorefrontProducts />;
      case 'orders':    return <OrderManager />;
      case 'crypto':    return <CryptoPayments />;
    }
  };

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <header className="bg-white border-b border-ink-100 sticky top-0 z-40 shadow-sm">
        <div className="container-padding py-3 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-ink-500 hover:text-ink-900 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Store</span>
          </button>

          <div className="w-px h-5 bg-ink-200" />

          <Logo className="h-8 w-auto hidden sm:block" />

          <div className="flex items-center gap-1.5 ml-auto">
            <Settings className="w-4 h-4 text-ink-400" />
            <span className="text-sm font-semibold text-ink-700">Admin Dashboard</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="container-padding">
          <div className="flex gap-0.5 overflow-x-auto hide-scrollbar">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTabClick(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === t.id
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-ink-500 hover:text-ink-800 hover:border-ink-300'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-padding py-6 md:py-8">
        {renderContent()}
      </main>
    </div>
  );
}
