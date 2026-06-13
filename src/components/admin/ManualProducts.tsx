import { useState } from 'react';
import {
  Plus, Save, X, Image as ImageIcon, DollarSign, Package,
  Tag, FileText, Hash, Weight, AlertCircle
} from 'lucide-react';

interface ManualProductForm {
  title: string;
  description: string;
  category: string;
  price: string;
  original_price: string;
  cost: string;
  sku: string;
  inventory: string;
  weight_kg: string;
  images: string;
  is_active: boolean;
  is_featured: boolean;
}

const EMPTY_FORM: ManualProductForm = {
  title: '',
  description: '',
  category: '',
  price: '',
  original_price: '',
  cost: '0',
  sku: '',
  inventory: '0',
  weight_kg: '',
  images: '',
  is_active: true,
  is_featured: false,
};

const CATEGORIES = [
  'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports',
  'Toys', 'Automotive', 'Tools', 'Pet Supplies', 'Books', 'Other'
];

interface ManualProductsProps {
  onSaved?: () => void;
}

export function ManualProducts({ onSaved }: ManualProductsProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ManualProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setForm(EMPTY_FORM);
    setError(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price) {
      setError('Title and price are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category || null,
        price: parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        cost: form.cost ? parseFloat(form.cost) : 0,
        sku: form.sku.trim() || null,
        inventory: parseInt(form.inventory) || 0,
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
        images: form.images
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean),
        is_active: form.is_active,
        is_featured: form.is_featured,
      };

      const res = await fetch('/api/storefront', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create product');
      }

      reset();
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-ink-900">Add Manual Product</h2>
          <p className="text-sm text-ink-500 mt-0.5">Create products you fulfill yourself (not from dropshipping)</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            showForm
              ? 'bg-ink-100 text-ink-600 hover:bg-ink-200'
              : 'bg-brand-500 hover:bg-brand-600 text-white'
          }`}
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-ink-200 rounded-xl p-6 mb-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Title & SKU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1.5">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Wireless Bluetooth Speaker"
                className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1.5">
                <Hash className="w-3 h-3 inline mr-1" />
                SKU (optional)
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="e.g. WBS-001"
                className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">
              <FileText className="w-3 h-3 inline mr-1" />
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your product..."
              rows={3}
              className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-500/20 resize-none"
            />
          </div>

          {/* Category, Inventory, Weight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1.5">
                <Tag className="w-3 h-3 inline mr-1" />
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm bg-white focus:border-brand-400"
              >
                <option value="">Select category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1.5">
                <Package className="w-3 h-3 inline mr-1" />
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={form.inventory}
                onChange={(e) => setForm({ ...form, inventory: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1.5">
                <Weight className="w-3 h-3 inline mr-1" />
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.weight_kg}
                onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                placeholder="0.5"
                className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1.5">
                <DollarSign className="w-3 h-3 inline mr-1" />
                Selling Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="29.99"
                className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1.5">
                <DollarSign className="w-3 h-3 inline mr-1" />
                Original Price (for discount display)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.original_price}
                onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                placeholder="49.99"
                className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1.5">
                <DollarSign className="w-3 h-3 inline mr-1" />
                Your Cost
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                placeholder="10.00"
                className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">
              <ImageIcon className="w-3 h-3 inline mr-1" />
              Image URLs (one per line)
            </label>
            <textarea
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              rows={3}
              className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-500/20 resize-none font-mono text-xs"
            />
            <p className="text-xs text-ink-400 mt-1">Enter full URLs to product images, one per line</p>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-ink-300 text-brand-500 focus:ring-brand-500/30"
              />
              <span className="text-sm text-ink-700">Active (visible in store)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="w-4 h-4 rounded border-ink-300 text-brand-500 focus:ring-brand-500/30"
              />
              <span className="text-sm text-ink-700">Featured</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Product
                </>
              )}
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-5 py-2.5 border border-ink-200 text-ink-600 hover:bg-ink-50 rounded-lg text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Help text */}
      <div className="bg-ink-50 border border-ink-100 rounded-xl p-4">
        <p className="text-xs text-ink-500">
          Manual products are items you fulfill yourself — your own inventory, print-on-demand, or locally sourced goods.
          They won't be linked to any dropshipping supplier. Use the <strong>Store Products</strong> tab to view and manage all products.
        </p>
      </div>
    </div>
  );
}
