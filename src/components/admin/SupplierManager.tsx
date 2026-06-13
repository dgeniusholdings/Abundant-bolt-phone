import { useState, useEffect, useCallback } from 'react';
import {
  Plus, RefreshCw, Trash2, ToggleLeft, ToggleRight,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { fnUrl, fnHeaders, type Supplier, type SupplierType } from '../../lib/supabase';

const SUPPLIER_META: Record<SupplierType | 'custom', { label: string; color: string }> = {
  aliexpress:       { label: 'AliExpress',        color: 'bg-red-100 text-red-600' },
  cj_dropshipping:  { label: 'CJ Dropshipping',   color: 'bg-blue-100 text-blue-600' },
  spocket:          { label: 'Spocket',           color: 'bg-sky-100 text-sky-600' },
  printful:         { label: 'Printful',          color: 'bg-yellow-100 text-yellow-700' },
  zendrop:          { label: 'Zendrop',           color: 'bg-green-100 text-green-600' },
  autods:           { label: 'AutoDS',            color: 'bg-orange-100 text-orange-600' },
  worldwide_brands: { label: 'Worldwide Brands',  color: 'bg-purple-100 text-purple-600' },
  crypto_supplier:  { label: 'Crypto Supplier',   color: 'bg-amber-100 text-amber-600' },
  custom:           { label: 'Custom',            color: 'bg-ink-100 text-ink-600' },
};

const SUPPLIER_TYPES = Object.keys(SUPPLIER_META).filter(t => t !== 'custom') as SupplierType[];

const BASE = fnUrl('dropship-api');

export function SupplierManager() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', type: 'aliexpress' as SupplierType, api_key: '', api_secret: '' });
  const [syncResult, setSyncResult] = useState<{ id: string; msg: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/suppliers`, { headers: fnHeaders() });
      const data = await res.json();
      if (res.ok) setSuppliers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleActive = async (s: Supplier) => {
    await fetch(`${BASE}/suppliers/${s.id}`, {
      method: 'PUT', headers: fnHeaders(),
      body: JSON.stringify({ is_active: !s.is_active }),
    });
    load();
  };

  const sync = async (s: Supplier) => {
    setSyncing(s.id);
    setSyncResult(null);
    try {
      const res = await fetch(`${BASE}/sync/${s.id}`, { method: 'POST', headers: fnHeaders() });
      const data = await res.json();
      setSyncResult({ id: s.id, msg: res.ok ? `Synced ${data.synced} products` : (data.error ?? 'Sync failed') });
    } finally {
      setSyncing(null);
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this supplier?')) return;
    await fetch(`${BASE}/suppliers/${id}`, { method: 'DELETE', headers: fnHeaders() });
    load();
  };

  const addSupplier = async () => {
    const meta = SUPPLIER_META[form.type];
    await fetch(`${BASE}/suppliers`, {
      method: 'POST', headers: fnHeaders(),
      body: JSON.stringify({ name: form.name || meta.label, type: form.type, api_key: form.api_key || null, api_secret: form.api_secret || null }),
    });
    setShowAdd(false);
    setForm({ name: '', type: 'aliexpress', api_key: '', api_secret: '' });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-ink-900">Dropship Suppliers</h2>
          <p className="text-sm text-ink-500 mt-0.5">Connect and manage supplier integrations</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Add Supplier
        </button>
      </div>

      {showAdd && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-ink-900 mb-4">Connect New Supplier</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">Platform</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as SupplierType })} className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm bg-white">
                {SUPPLIER_TYPES.map(t => <option key={t} value={t}>{SUPPLIER_META[t].label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">Account Name</label>
              <input type="text" placeholder={SUPPLIER_META[form.type].label} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">API Key</label>
              <input type="password" placeholder="API key" value={form.api_key} onChange={(e) => setForm({ ...form, api_key: e.target.value })} className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">API Secret</label>
              <input type="password" placeholder="API secret" value={form.api_secret} onChange={(e) => setForm({ ...form, api_secret: e.target.value })} className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm bg-white" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addSupplier} className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Add Supplier</button>
            <button onClick={() => setShowAdd(false)} className="border border-ink-200 text-ink-600 px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-ink-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {suppliers.map((s) => {
            const meta = SUPPLIER_META[s.type] ?? SUPPLIER_META.custom;
            const isExpanded = expandedId === s.id;

            return (
              <div key={s.id} className={`border rounded-xl ${s.is_active ? 'border-ink-200 bg-white' : 'border-ink-100 bg-ink-50'}`}>
                <div className="flex items-center gap-4 p-4">
                  <div className={`w-10 h-10 rounded-lg ${meta.color} flex items-center justify-center shrink-0 font-bold text-sm`}>
                    {meta.label.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink-900 text-sm">{s.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${meta.color}`}>{meta.label}</span>
                      {s.last_sync_at && <span className="text-xs text-ink-400">Synced {new Date(s.last_sync_at).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {syncResult?.id === s.id && <span className="text-xs text-green-600 font-medium">{syncResult.msg}</span>}
                    <button onClick={() => sync(s)} disabled={syncing === s.id} className="p-2 text-ink-400 hover:text-brand-500 disabled:opacity-50">
                      <RefreshCw className={`w-4 h-4 ${syncing === s.id ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={() => toggleActive(s)} className="p-1">
                      {s.is_active ? <ToggleRight className="w-6 h-6 text-brand-500" /> : <ToggleLeft className="w-6 h-6 text-ink-300" />}
                    </button>
                    <button onClick={() => setExpandedId(isExpanded ? null : s.id)} className="p-2 text-ink-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button onClick={() => remove(s.id)} className="p-2 text-ink-300 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-ink-100 px-4 pb-4 pt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div><div className="text-ink-400 mb-0.5">Status</div><div className={`font-medium ${s.is_active ? 'text-green-600' : 'text-ink-400'}`}>{s.is_active ? 'Active' : 'Inactive'}</div></div>
                    <div><div className="text-ink-400 mb-0.5">Type</div><div className="font-medium text-ink-700">{s.type}</div></div>
                    <div><div className="text-ink-400 mb-0.5">API Key</div><div className="font-medium text-ink-700">{s.api_key ? '••••••••' : 'Not set'}</div></div>
                    <div><div className="text-ink-400 mb-0.5">Created</div><div className="font-medium text-ink-700">{new Date(s.created_at).toLocaleDateString()}</div></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
