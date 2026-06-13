import { useState, useEffect, useCallback } from 'react';
import { Download, Search, RefreshCw, Package, CheckCircle } from 'lucide-react';
import { fnUrl, fnHeaders, type Supplier, type SupplierProduct } from '../../lib/supabase';

const BASE = fnUrl('dropship-api');

export function ProductSync() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);
  const [supplierId, setSupplierId] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const loadSuppliers = useCallback(async () => {
    const res = await fetch(`${BASE}/suppliers`, { headers: fnHeaders() });
    if (res.ok) setSuppliers(await res.json());
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '16' });
      if (supplierId) params.set('supplier_id', supplierId);
      if (category) params.set('category', category);
      const res = await fetch(`${BASE}/products?${params}`, { headers: fnHeaders() });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products ?? []);
        setTotal(data.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, supplierId, category]);

  useEffect(() => { loadSuppliers(); }, [loadSuppliers]);
  useEffect(() => { loadProducts(); }, [loadProducts]);

  const importProduct = async (id: string, retailPrice: number) => {
    setImporting(id);
    try {
      await fetch(`${BASE}/products/${id}/import`, {
        method: 'POST', headers: fnHeaders(),
        body: JSON.stringify({ retail_price: retailPrice }),
      });
      loadProducts();
    } finally {
      setImporting(null);
    }
  };

  const syncSupplier = async (id: string) => {
    setLoading(true);
    await fetch(`${BASE}/sync/${id}`, { method: 'POST', headers: fnHeaders() });
    await loadProducts();
  };

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const visible = search ? products.filter(p => p.title.toLowerCase().includes(search.toLowerCase())) : products;
  const totalPages = Math.ceil(total / 16);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-ink-900">Product Catalog</h2>
          <p className="text-sm text-ink-500 mt-0.5">{total.toLocaleString()} products synced from suppliers</p>
        </div>
        {supplierId && (
          <button onClick={() => syncSupplier(supplierId)} className="flex items-center gap-2 border border-brand-300 text-brand-600 hover:bg-brand-50 px-4 py-2 rounded-lg text-sm font-semibold">
            <RefreshCw className="w-4 h-4" /> Re-sync
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-ink-200 rounded-lg text-sm" />
        </div>
        <select value={supplierId} onChange={(e) => { setSupplierId(e.target.value); setPage(1); }} className="border border-ink-200 rounded-lg px-3 py-2 text-sm">
          <option value="">All Suppliers</option>
          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="border border-ink-200 rounded-lg px-3 py-2 text-sm">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c!} value={c!}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-ink-100 rounded-xl aspect-[3/4] animate-pulse" />)}</div>
      ) : visible.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-ink-300 mx-auto mb-3" />
          <p className="text-ink-500 font-medium">No products yet</p>
          <p className="text-ink-400 text-sm mt-1">Select a supplier and click Re-sync</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {visible.map((p) => {
            const markup = p.retail_price ?? p.supplier_price * 1.35;
            return (
              <div key={p.id} className={`bg-white border rounded-xl overflow-hidden group hover:shadow-md ${p.is_imported ? 'border-green-200' : 'border-ink-100'}`}>
                <div className="relative aspect-square bg-ink-50 overflow-hidden">
                  {p.images[0] && <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  {p.is_imported && <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1"><CheckCircle className="w-3.5 h-3.5" /></div>}
                  {p.category && <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">{p.category}</span>}
                </div>
                <div className="p-3">
                  <h4 className="text-xs font-medium text-ink-800 line-clamp-2 mb-2">{p.title}</h4>
                  <div className="flex justify-between mb-1"><span className="text-xs text-ink-400">Cost</span><span className="text-sm font-bold text-ink-700">${p.supplier_price.toFixed(2)}</span></div>
                  <div className="flex justify-between mb-3"><span className="text-xs text-ink-400">Retail</span><span className="text-sm font-bold text-brand-500">${markup.toFixed(2)}</span></div>
                  <button onClick={() => importProduct(p.id, markup)} disabled={importing === p.id || p.is_imported} className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 ${p.is_imported ? 'bg-green-50 text-green-600' : importing === p.id ? 'bg-ink-100 text-ink-400' : 'bg-brand-500 hover:bg-brand-600 text-white'}`}>
                    {p.is_imported ? <><CheckCircle className="w-3 h-3" /> Imported</> : importing === p.id ? <><RefreshCw className="w-3 h-3 animate-spin" /> Importing...</> : <><Download className="w-3 h-3" /> Import</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border border-ink-200 rounded-lg text-sm disabled:opacity-40">Prev</button>
          <span className="text-sm text-ink-600 py-1.5">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border border-ink-200 rounded-lg text-sm disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
