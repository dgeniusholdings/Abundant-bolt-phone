import { useState, useEffect, useCallback } from 'react';
import { Bitcoin, RefreshCw, CheckCircle, Copy, Check, ExternalLink, TrendingUp, Plus } from 'lucide-react';
import { fnUrl, fnHeaders, type CryptoPayment, type CryptoCurrency } from '../../lib/supabase';

const CRYPTO_PAY = fnUrl('crypto-payment');
const DROPSHIP = fnUrl('dropship-api');

const CURRENCY_META: Record<string, { symbol: string; color: string; name: string }> = {
  BTC:  { symbol: 'BTC',  color: 'text-orange-500', name: 'Bitcoin' },
  ETH:  { symbol: 'ETH',  color: 'text-blue-500',   name: 'Ethereum' },
  USDC: { symbol: 'USDC', color: 'text-sky-500',    name: 'USD Coin' },
  USDT: { symbol: 'USDT', color: 'text-teal-500',   name: 'Tether' },
  BNB:  { symbol: 'BNB',  color: 'text-yellow-500', name: 'BNB' },
  SOL:  { symbol: 'SOL',  color: 'text-purple-500', name: 'Solana' },
  LTC:  { symbol: 'LTC',  color: 'text-slate-500',  name: 'Litecoin' },
  DOGE: { symbol: 'DOGE', color: 'text-amber-500',  name: 'Dogecoin' },
  XRP:  { symbol: 'XRP',  color: 'text-indigo-500', name: 'XRP' },
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700', confirming: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700', expired: 'bg-ink-100 text-ink-500',
  failed: 'bg-red-100 text-red-600', refunded: 'bg-purple-100 text-purple-600',
};

type PaymentWithOrder = CryptoPayment & { orders?: { customer_name: string; customer_email: string; total: number } };

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return <button onClick={copy} className="p-1 text-ink-400 hover:text-ink-700">{copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}</button>;
}

function TimeLeft({ expiresAt }: { expiresAt: string }) {
  const [secs, setSecs] = useState(Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)));
  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  if (secs <= 0) return <span className="text-xs text-red-500 font-medium">Expired</span>;
  const m = Math.floor(secs / 60), s = secs % 60;
  return <span className={`text-xs font-mono font-medium ${secs < 120 ? 'text-red-500' : 'text-ink-600'}`}>{m}:{String(s).padStart(2,'0')}</span>;
}

export function CryptoPayments() {
  const [payments, setPayments] = useState<PaymentWithOrder[]>([]);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [confirming, setConfirming] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [orders, setOrders] = useState<Array<{ id: string; customer_name: string; total: number }>>([]);
  const [createForm, setCreateForm] = useState({ order_id: '', currency: 'BTC' as CryptoCurrency });
  const [creating, setCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`${CRYPTO_PAY}/payments?${params}`, { headers: fnHeaders() });
      if (res.ok) setPayments(await res.json());
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const loadRates = useCallback(async () => {
    setRatesLoading(true);
    try {
      const res = await fetch(`${CRYPTO_PAY}/rates`, { headers: fnHeaders() });
      if (res.ok) { const data = await res.json(); setRates(data.rates ?? {}); }
    } finally {
      setRatesLoading(false);
    }
  }, []);

  useEffect(() => { loadPayments(); loadRates(); }, [loadPayments, loadRates]);
  useEffect(() => { fetch(`${DROPSHIP}/orders`, { headers: fnHeaders() }).then(r => r.json()).then(d => setOrders(d.orders ?? [])).catch(() => {}); }, []);

  const confirmPayment = async (id: string) => {
    setConfirming(id);
    try {
      await fetch(`${CRYPTO_PAY}/confirm/${id}`, { method: 'POST', headers: fnHeaders(), body: JSON.stringify({ confirmations: 99 }) });
      loadPayments();
    } finally {
      setConfirming(null);
    }
  };

  const createPayment = async () => {
    const order = orders.find(o => o.id === createForm.order_id);
    if (!order) return;
    setCreating(true);
    try {
      const res = await fetch(`${CRYPTO_PAY}/create`, {
        method: 'POST', headers: fnHeaders(),
        body: JSON.stringify({ order_id: createForm.order_id, currency: createForm.currency, amount_usd: order.total }),
      });
      if (res.ok) { setShowCreate(false); loadPayments(); }
    } finally {
      setCreating(false);
    }
  };

  const STATUSES = ['', 'pending', 'confirming', 'confirmed', 'expired', 'failed'];
  const totalVolume = payments.filter(p => p.status === 'confirmed').reduce((s, p) => s + Number(p.amount_usd), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-ink-900">Crypto Payments</h2>
          <p className="text-sm text-ink-500 mt-0.5">Accept BTC, ETH, USDC, USDT, BNB, SOL, LTC, DOGE, XRP</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadRates} className="p-2 border border-ink-200 rounded-lg text-ink-500 hover:bg-ink-50"><TrendingUp className={`w-4 h-4 ${ratesLoading ? 'animate-pulse' : ''}`} /></button>
          <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"><Plus className="w-4 h-4" /> New Payment</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-ink-100 rounded-xl p-4">
          <div className="text-xs text-ink-400 mb-1">Total Payments</div>
          <div className="text-2xl font-bold text-ink-900">{payments.length}</div>
        </div>
        <div className="bg-white border border-ink-100 rounded-xl p-4">
          <div className="text-xs text-ink-400 mb-1">Confirmed</div>
          <div className="text-2xl font-bold text-green-600">{payments.filter(p => p.status === 'confirmed').length}</div>
        </div>
        <div className="bg-white border border-ink-100 rounded-xl p-4">
          <div className="text-xs text-ink-400 mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{payments.filter(p => p.status === 'pending').length}</div>
        </div>
        <div className="bg-white border border-ink-100 rounded-xl p-4">
          <div className="text-xs text-ink-400 mb-1">Volume (confirmed)</div>
          <div className="text-2xl font-bold text-brand-500">${totalVolume.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-ink-900 rounded-xl p-4 mb-6 overflow-x-auto">
        <div className="flex items-center gap-2 mb-3"><TrendingUp className="w-4 h-4 text-brand-400" /><span className="text-xs font-semibold text-ink-300 uppercase tracking-wider">Live Exchange Rates</span></div>
        <div className="flex gap-4 min-w-max">
          {Object.entries(CURRENCY_META).map(([cur, meta]) => (
            <div key={cur} className="text-center">
              <div className={`text-lg font-bold ${meta.color} tabular-nums`}>{meta.symbol}</div>
              <div className="text-xs text-ink-400 tabular-nums">{ratesLoading ? '...' : rates[cur] ? (rates[cur] < 1 ? `$${rates[cur].toFixed(4)}` : `$${rates[cur].toLocaleString()}`) : '—'}</div>
            </div>
          ))}
        </div>
      </div>

      {showCreate && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-ink-900 mb-4">Create Crypto Payment</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">Order</label>
              <select value={createForm.order_id} onChange={(e) => setCreateForm({ ...createForm, order_id: e.target.value })} className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm bg-white">
                <option value="">Select order...</option>
                {orders.map(o => <option key={o.id} value={o.id}>{o.customer_name} — ${o.total.toFixed(2)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">Currency</label>
              <select value={createForm.currency} onChange={(e) => setCreateForm({ ...createForm, currency: e.target.value as CryptoCurrency })} className="w-full px-3 py-2 border border-ink-200 rounded-lg text-sm bg-white">
                {Object.entries(CURRENCY_META).map(([cur, m]) => <option key={cur} value={cur}>{m.name} ({cur})</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={createPayment} disabled={!createForm.order_id || creating} className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
              {creating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bitcoin className="w-4 h-4" />} Generate Payment Address
            </button>
            <button onClick={() => setShowCreate(false)} className="border border-ink-200 text-ink-600 px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-ink-200 rounded-lg px-3 py-2 text-sm">
          {STATUSES.map(s => <option key={s} value={s}>{s ? (s.charAt(0).toUpperCase() + s.slice(1)) : 'All Statuses'}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-ink-100 rounded-xl animate-pulse" />)}</div>
      ) : payments.length === 0 ? (
        <div className="text-center py-16"><Bitcoin className="w-12 h-12 text-ink-300 mx-auto mb-3" /><p className="text-ink-500 font-medium">No crypto payments yet</p></div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => {
            const meta = CURRENCY_META[p.currency];
            const isExpanded = expandedId === p.id;
            const isActive = p.status === 'pending' || p.status === 'confirming';

            return (
              <div key={p.id} className="border border-ink-200 bg-white rounded-xl overflow-hidden">
                <button onClick={() => setExpandedId(isExpanded ? null : p.id)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-ink-50/50 transition-colors">
                  <div className={`w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center shrink-0 font-bold ${meta.color} text-sm`}>{meta.symbol.slice(0,3)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-ink-900 text-sm">{meta.name} ({p.currency})</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLES[p.status] ?? 'bg-ink-100 text-ink-600'}`}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      {p.orders && <span className="text-xs text-ink-400">{p.orders.customer_name}</span>}
                      <span className="text-xs text-ink-400">{new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-ink-900">${Number(p.amount_usd).toFixed(2)}</div>
                    <div className={`text-xs font-mono ${meta.color}`}>{Number(p.amount_crypto).toFixed(6)} {p.currency}</div>
                    {isActive && <TimeLeft expiresAt={p.expires_at} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-ink-100 p-4 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div><div className="text-xs text-ink-400 mb-0.5">Network</div><div className="font-medium text-ink-700">{p.network}</div></div>
                      <div><div className="text-xs text-ink-400 mb-0.5">Rate at creation</div><div className="font-medium text-ink-700">${Number(p.exchange_rate).toLocaleString()} / {p.currency}</div></div>
                      <div><div className="text-xs text-ink-400 mb-0.5">Confirmations needed</div><div className="font-medium text-ink-700">{p.required_confirmations}</div></div>
                    </div>

                    <div>
                      <div className="text-xs text-ink-400 mb-1">Payment Address</div>
                      <div className="flex items-center gap-2 bg-ink-50 rounded-lg px-3 py-2">
                        <code className="flex-1 text-xs text-ink-700 font-mono break-all">{p.wallet_address}</code>
                        <CopyButton text={p.wallet_address} />
                      </div>
                    </div>

                    {p.tx_hash && (
                      <div>
                        <div className="text-xs text-ink-400 mb-1">Transaction Hash</div>
                        <div className="flex items-center gap-2 bg-ink-50 rounded-lg px-3 py-2">
                          <code className="flex-1 text-xs text-ink-700 font-mono break-all">{p.tx_hash}</code>
                          <CopyButton text={p.tx_hash} />
                          <a href={`https://blockchair.com/search?q=${p.tx_hash}`} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:text-brand-700"><ExternalLink className="w-3.5 h-3.5" /></a>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {(p.status === 'pending' || p.status === 'confirming') && (
                        <button disabled={confirming === p.id} onClick={() => confirmPayment(p.id)} className="flex items-center gap-1.5 text-xs bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg font-semibold">
                          {confirming === p.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />} Mark Confirmed (Admin)
                        </button>
                      )}
                      {p.status === 'confirmed' && (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-semibold"><CheckCircle className="w-3.5 h-3.5" /> Payment confirmed</span>
                      )}
                    </div>
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
