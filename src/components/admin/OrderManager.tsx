import { useState, useEffect, useCallback } from 'react';
import { Package, Truck, XCircle, ChevronDown, ChevronUp, Send, RefreshCw, Plus } from 'lucide-react';
import { fnUrl, fnHeaders, type Order, type DropshipFulfillment, type Supplier } from '../../lib/supabase';

const BASE = fnUrl('dropship-api');

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-blue-100 text-blue-700',
  processing: 'bg-sky-100 text-sky-700', shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
  submitted: 'bg-indigo-100 text-indigo-700', failed: 'bg-red-100 text-red-600',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status] ?? 'bg-ink-100 text-ink-600'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [fulfillments, setFulfillments] = useState<Record<string, (DropshipFulfillment & { suppliers?: { name: string } })[]>>({});
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [newFulfillment, setNewFulfillment] = useState<{ orderId: string; supplierId: string } | null>(null);
  const [trackingForm, setTrackingForm] = useState<{ id: string; tracking_number: string; carrier: string } | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '20' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`${BASE}/orders?${params}`, { headers: fnHeaders() });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders ?? []);
        setTotal(data.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { loadOrders(); }, [loadOrders]);
  useEffect(() => { fetch(`${BASE}/suppliers`, { headers: fnHeaders() }).then(r => r.json()).then(setSuppliers).catch(() => {}); }, []);

  const loadFulfillments = useCallback(async (orderId: string) => {
    const res = await fetch(`${BASE}/fulfillments?order_id=${orderId}`, { headers: fnHeaders() });
    if (res.ok) {
      const data = await res.json();
      setFulfillments(prev => ({ ...prev, [orderId]: data }));
    }
  }, []);

  const expand = (id: string) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    loadFulfillments(id);
  };

  const createFulfillment = async (orderId: string, supplierId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    await fetch(`${BASE}/fulfillments`, {
      method: 'POST', headers: fnHeaders(),
      body: JSON.stringify({ order_id: orderId, supplier_id: supplierId, items: order.items }),
    });
    loadFulfillments(orderId);
    setNewFulfillment(null);
  };

  const submitFulfillment = async (fulfillmentId: string, orderId: string) => {
    setSubmitting(fulfillmentId);
    try {
      await fetch(`${BASE}/fulfillments/${fulfillmentId}/submit`, { method: 'POST', headers: fnHeaders() });
      loadFulfillments(orderId);
      loadOrders();
    } finally {
      setSubmitting(null);
    }
  };

  const saveTracking = async () => {
    if (!trackingForm) return;
    const order = orders.find(o => fulfillments[o.id]?.some(f => f.id === trackingForm.id));
    if (!order) return;
    await fetch(`${BASE}/fulfillments/${trackingForm.id}`, {
      method: 'PUT', headers: fnHeaders(),
      body: JSON.stringify({ tracking_number: trackingForm.tracking_number, carrier: trackingForm.carrier, status: 'shipped', shipped_at: new Date().toISOString() }),
    });
    loadFulfillments(order.id);
    setTrackingForm(null);
  };

  const STATUSES = ['', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-ink-900">Orders & Fulfillment</h2>
          <p className="text-sm text-ink-500 mt-0.5">{total} total orders</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-ink-200 rounded-lg px-3 py-2 text-sm">
          {STATUSES.map(s => <option key={s} value={s}>{s ? (s.charAt(0).toUpperCase() + s.slice(1)) : 'All Statuses'}</option>)}
        </select>
      </div>

      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between gap-3">
        <p className="text-xs text-amber-700">No orders yet? Create a demo order to test fulfillment.</p>
        <button onClick={async () => {
          await fetch(`${BASE}/orders`, {
            method: 'POST', headers: fnHeaders(),
            body: JSON.stringify({ customer_name: 'Jane Smith', customer_email: 'jane@example.com', shipping_address: { line1: '123 Main St', city: 'Austin', state: 'TX', postal_code: '78701', country: 'US' }, items: [{ title: 'Demo Product', quantity: 2, unit_price: 29.99 }], subtotal: 59.98, shipping_cost: 4.99, tax: 4.80, total: 69.77, status: 'paid', payment_method: 'stripe', payment_status: 'paid' }),
          });
          loadOrders();
        }} className="shrink-0 text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1">
          <Plus className="w-3 h-3" /> Create Demo Order
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-ink-100 rounded-xl animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16"><Package className="w-12 h-12 text-ink-300 mx-auto mb-3" /><p className="text-ink-500 font-medium">No orders found</p></div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            const orderFulfillments = fulfillments[order.id] ?? [];

            return (
              <div key={order.id} className="border border-ink-200 bg-white rounded-xl overflow-hidden">
                <button onClick={() => expand(order.id)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-ink-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-ink-900 text-sm">{order.customer_name}</span>
                      <span className="text-ink-400 text-xs">{order.customer_email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <StatusBadge status={order.status} />
                      <span className="text-xs text-ink-400">#{order.id.slice(0, 8)}</span>
                      <span className="text-xs text-ink-400">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-ink-900">${order.total.toFixed(2)}</div>
                    <div className="text-xs text-ink-400 mt-0.5">{order.items.length} item(s)</div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-ink-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-ink-400 shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-ink-100 p-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Order Items</h4>
                      {(order.items as Array<{ title: string; quantity: number; unit_price: number }>).map((item, i) => (
                        <div key={i} className="flex justify-between text-sm"><span className="text-ink-700">{item.title} × {item.quantity}</span><span className="font-medium text-ink-900">${(item.unit_price * item.quantity).toFixed(2)}</span></div>
                      ))}
                      <div className="flex justify-between text-sm border-t border-ink-100 pt-1 mt-1 font-semibold"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Ship To</h4>
                      <p className="text-sm text-ink-700">{order.shipping_address.line1}, {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}, {order.shipping_address.country}</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Fulfillments</h4>
                        <button onClick={() => setNewFulfillment({ orderId: order.id, supplierId: '' })} className="text-xs text-brand-500 hover:text-brand-700 font-semibold flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                      </div>

                      {newFulfillment?.orderId === order.id && (
                        <div className="flex gap-2 mb-3">
                          <select value={newFulfillment.supplierId} onChange={(e) => setNewFulfillment({ ...newFulfillment, supplierId: e.target.value })} className="flex-1 border border-ink-200 rounded-lg px-2 py-1.5 text-xs">
                            <option value="">Select supplier...</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                          <button disabled={!newFulfillment.supplierId} onClick={() => createFulfillment(order.id, newFulfillment.supplierId)} className="bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">Create</button>
                          <button onClick={() => setNewFulfillment(null)} className="text-ink-400 hover:text-ink-700 px-2"><XCircle className="w-4 h-4" /></button>
                        </div>
                      )}

                      {orderFulfillments.length === 0 ? (
                        <p className="text-xs text-ink-400 italic">No fulfillments yet</p>
                      ) : (
                        <div className="space-y-2">
                          {orderFulfillments.map((f) => (
                            <div key={f.id} className="bg-ink-50 rounded-lg p-3">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div>
                                  <span className="text-xs font-semibold text-ink-700">{f.suppliers?.name ?? 'Supplier'}</span>
                                  {f.supplier_order_id && <span className="text-xs text-ink-400 ml-2">#{f.supplier_order_id}</span>}
                                </div>
                                <StatusBadge status={f.status} />
                              </div>

                              {f.tracking_number && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-ink-600">
                                  <Truck className="w-3 h-3" />
                                  {f.carrier && <span className="font-medium">{f.carrier}</span>}
                                  <span>{f.tracking_number}</span>
                                </div>
                              )}

                              <div className="flex gap-2 mt-2">
                                {f.status === 'pending' && (
                                  <button disabled={submitting === f.id} onClick={() => submitFulfillment(f.id, order.id)} className="flex items-center gap-1 text-xs bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white px-3 py-1 rounded-lg font-semibold">
                                    {submitting === f.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />} Submit to Supplier
                                  </button>
                                )}
                                {(f.status === 'submitted' || f.status === 'processing') && (
                                  <button onClick={() => setTrackingForm({ id: f.id, tracking_number: '', carrier: '' })} className="flex items-center gap-1 text-xs border border-ink-300 text-ink-600 hover:bg-ink-100 px-3 py-1 rounded-lg font-semibold">
                                    <Truck className="w-3 h-3" /> Add Tracking
                                  </button>
                                )}
                              </div>

                              {trackingForm?.id === f.id && (
                                <div className="flex gap-2 mt-2">
                                  <input placeholder="Tracking number" value={trackingForm.tracking_number} onChange={(e) => setTrackingForm({ ...trackingForm, tracking_number: e.target.value })} className="flex-1 border border-ink-200 rounded px-2 py-1 text-xs" />
                                  <input placeholder="Carrier (e.g. USPS)" value={trackingForm.carrier} onChange={(e) => setTrackingForm({ ...trackingForm, carrier: e.target.value })} className="w-28 border border-ink-200 rounded px-2 py-1 text-xs" />
                                  <button onClick={saveTracking} className="bg-green-500 text-white px-3 py-1 rounded text-xs font-semibold">Save</button>
                                  <button onClick={() => setTrackingForm(null)} className="text-ink-400 px-1"><XCircle className="w-3.5 h-3.5" /></button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
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
