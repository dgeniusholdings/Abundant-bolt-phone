import { useState, useMemo } from 'react';
import { Settings } from 'lucide-react';
import { CartProvider } from './context/CartContext';
import {
  Header,
  MobileMenu,
  CartDrawer,
  Hero,
  Categories,
  FeaturedDeals,
  FlashSale,
  TrendingProducts,
  TrustSection,
  Newsletter,
  Footer,
} from './components';
import { AdminDashboard } from './pages/AdminDashboard';
import { CheckoutPage } from './pages/CheckoutPage';
import { useStorefrontProducts } from './hooks/useStorefrontProducts';
import { products as staticProducts, trendingProducts } from './data';

type View = 'store' | 'admin' | 'checkout';

function App() {
  const [view, setView] = useState<View>('store');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { products: dbProducts, featuredProducts } = useStorefrontProducts();

  const products = dbProducts.length > 0 ? dbProducts : staticProducts;
  const featured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 12);

  if (view === 'admin') {
    return (
      <CartProvider>
        <AdminDashboard onBack={() => setView('store')} />
      </CartProvider>
    );
  }

  if (view === 'checkout') {
    return (
      <CartProvider>
        <CheckoutPage
          onBack={() => setView('store')}
          onComplete={() => setView('store')}
        />
      </CartProvider>
    );
  }

  const filteredProducts = useMemo(() => {
    let result = featured;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    return result;
  }, [searchQuery, selectedCategory, featured]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId || null);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Header
          onMenuClick={() => setIsMenuOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1">
          <Hero />

          {/* Trust bar directly below hero */}
          <TrustSection />

          <Categories
            onCategoryClick={handleCategoryClick}
            activeCategory={selectedCategory}
          />

          <FeaturedDeals
            products={filteredProducts}
            title={
              selectedCategory
                ? `${selectedCategory.replace(/-/g, ' ')} deals`
                : 'Featured products'
            }
            subtitle={searchQuery ? `Results for "${searchQuery}"` : undefined}
          />

          <FlashSale />

          <TrendingProducts products={trendingProducts} />

          <Newsletter />
        </main>

        <Footer />

        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onCategoryClick={handleCategoryClick}
        />

        <CartDrawer onCheckout={() => setView('checkout')} />

        {/* Admin access button */}
        <button
          onClick={() => setView('admin')}
          title="Admin Dashboard"
          className="fixed bottom-6 right-6 z-30 w-10 h-10 bg-ink-800 hover:bg-ink-900 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </CartProvider>
  );
}

export default App;
