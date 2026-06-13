import { useState, useEffect, useCallback } from 'react';
import { Package, Search, CreditCard as Edit3, Trash2, Check, X, RefreshCw, ToggleLeft, ToggleRight, Star, Link } from 'lucide-react';
import { fnUrl, fnHeaders, type StorefrontProduct } from '../../lib/supabase';

const BASE = fnUrl('dropship-api');

export function StorefrontProducts() {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sourceFilter, setSourceFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<StorefrontProduct>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (sourceFilter) params.set('source', sourceFilter);
      if (categoryFilter) params.set('category', categoryFilter);

      const res = await fetch(`${BASE}/storefront?${params}`, { headers: fnHeaders() });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products ?? []);
        setTotal(data.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, sourceFilter, categoryFilter]);

  useEffect(() => { load(); }, [load]);

  const visible = search
    ? products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    : products;

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const totalPages = Math.ceil(total / 12);

  const toggleActive = async (p: StorefrontProduct) => {
    await fetch(`${BASE}/storefront/${p.id}`, {
      method: 'PUT',
      headers: fnHeaders(),
      body: JSON.stringify({ is_active: !p.is_active }),
    });
    load();
  };

  const toggleFeatured = async (p: StorefrontProduct) => {
    await fetch(`${BASE}/storefront/${p.id}`, {
      method: 'PUT',
      headers: fnHeaders(),
      body: JSON.stringify({ is_featured: !p.is_featured }),
    });
    load();
  };

  const startEdit = (p: StorefrontProduct) => {
    setEditingId(p.id);
    setEditForm({
      title: p.title,
      price: p.price,
      original_price: p.original_price,
      inventory: p.inventory,
      category: p.category,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await fetch(`${BASE}/storefront/${editingId}`, {
        method: 'PUT',
        headers: fnHeaders(),
        body: JSON.stringify(editForm),
      });
      setEditingId(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await fetch(`${BASE}/storefront/${id}`, { method: 'DELETE', headers: fnHeaders() });
      load();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-ink-900">Store Products</h2>
          <p className="text-sm text-ink-500 mt-0.5">{total} products in your storefront</p>
        </div>
        <button
          onClick={load}
          className="p-2 border border-ink-200 rounded-lg text-ink-500 hover:bg-ink-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-ink-200 rounded-lg text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-500/20 transition-all"
          />
        </div>

        <select
          value={sourceFilter}
          onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
          className="border border-ink-200 rounded-lg px-3 py-2 text-sm text-ink-700"
        >
          <option value="">All Sources</option>
          <option value="manual">Manual</option>
          <option value="imported">Imported</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="border border-ink-200 rounded-lg px-3 py-2 text-sm text-ink-700"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c!} value={c!}>{c}</option>)}
        </select>
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-ink-100 rounded-xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-ink-300 mx-auto mb-3" />
          <p className="text-ink-500 font-medium">No products found</p>
          <p className="text-ink-400 text-sm mt-1">Import from suppliers or add manual products</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visible.map((p) => {
            const isEditing = editingId === p.id;
            const isImported = p.source_type === 'imported';
            const supplier = p.supplier_products?.suppliers;

            return (
              <div
                key={p.id}
                className={`bg-white border rounded-xl overflow-hidden group transition-all duration-200 hover:shadow-md ${
                  p.is_active ? 'border-ink-200' : 'border-ink-100 opacity-60'
                }`}
              >
                {/* Image */}
                <div className="relative aspect-square bg-ink-50 overflow-hidden">
                  {p.images[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-300">
                      <Package className="w-8 h-8" />
                    </div>
                  )}

                  {/* Source badge */}
                  <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isImported
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {isImported ? 'Imported' : 'Manual'}
                  </span>

                  {/* Featured badge */}
                  {p.is_featured && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-current" /> Featured
                    </span>
                  )}

                  {/* Inventory */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                    {p.inventory} in stock
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  {isEditing ? (
                    <>
                      <input
                        className="w-full border border-brand-300 rounded px-2 py-1 text-sm mb-2"
                        value={editForm.title ?? ''}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        placeholder="Title"
                      />
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="number"
                          step="0.01"
                          className="w-full border border-ink-200 rounded px-2 py-1 text-xs"
                          value={editForm.price ?? ''}
                          onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                          placeholder="Price"
                        />
                        <input
                          type="number"
                          className="w-full border border-ink-200 rounded px-2 py-1 text-xs"
                          value={editForm.inventory ?? ''}
                          onChange={(e) => setEditForm({ ...editForm, inventory: parseInt(e.target.value) || 0 })}
                          placeholder="Stock"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="text-xs font-medium text-ink-800 line-clamp-2 leading-snug">
                        {p.title}
                      </h4>
                      {supplier && (
                        <p className="text-[10px] text-ink-400 mt-0.5 flex items-center gap-1">
                          <Link className="w-2.5 h-2.5" />
                          {supplier.name}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-brand-500">${p.price.toFixed(2)}</span>
                        {p.original_price && (
                          <span className="text-xs text-ink-400 line-through">${p.original_price.toFixed(2)}</span>
                        )}
                      </div>
                    </>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-ink-100">
                    {isEditing ? (
                      <>
                        <button
                          onClick={saveEdit}
                          disabled={saving}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-1.5 rounded font-semibold flex items-center justify-center gap-1"
                        >
                          {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 text-ink-400 hover:text-ink-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(p)}
                          className="p-1.5 text-ink-400 hover:text-brand-500 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => toggleActive(p)}
                          title={p.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {p.is_active
                            ? <ToggleRight className="w-5 h-5 text-green-500" />
                            : <ToggleLeft className="w-5 h-5 text-ink-300" />}
                        </button>

                        <button
                          onClick={() => toggleFeatured(p)}
                          className={`p-1 transition-colors ${p.is_featured ? 'text-yellow-500' : 'text-ink-300 hover:text-yellow-500'}`}
                          title={p.is_featured ? 'Remove featured' : 'Mark featured'}
                        >
                          <Star className={`w-4 h-4 ${p.is_featured ? 'fill-current' : ''}`} />
                        </button>

                        <button
                          onClick={() => deleteProduct(p.id)}
                          disabled={deleting === p.id}
                          className="p-1.5 text-ink-300 hover:text-red-500 transition-colors disabled:opacity-40"
                          title="Delete"
                        >
                          {deleting === p.id
                            ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1.5 border border-ink-200 rounded-lg text-sm disabled:opacity-40 hover:bg-ink-50 transition-colors"
          >
            Prev
          </button>
          <span className="text-sm text-ink-600">Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1.5 border border-ink-200 rounded-lg text-sm disabled:opacity-40 hover:bg-ink-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
