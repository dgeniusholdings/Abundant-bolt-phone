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
import { products, trendingProducts } from './data';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isAdmin) {
    return (
      <CartProvider>
        <AdminDashboard onBack={() => setIsAdmin(false)} />
      </CartProvider>
    );
  }

  const filteredProducts = useMemo(() => {
    let result = products;

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
  }, [searchQuery, selectedCategory]);

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

        <CartDrawer />

        {/* Admin access button */}
        <button
          onClick={() => setIsAdmin(true)}
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
