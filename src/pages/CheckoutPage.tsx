import { useState } from 'react';
import { ArrowLeft, CreditCard, Lock, Truck, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { Logo } from '../components/Logo';

interface CheckoutPageProps {
  onBack: () => void;
  onComplete: (orderId: string) => void;
}

export function CheckoutPage({ onBack, onComplete }: CheckoutPageProps) {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
  });

  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    setStep('processing');
    setError(null);

    try {
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        title: item.product.title,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_email: form.email,
          customer_name: `${form.firstName} ${form.lastName}`,
          shipping_address: {
            line1: form.address,
            city: form.city,
            state: form.state,
            postal_code: form.postalCode,
            country: form.country,
          },
          items: orderItems,
          subtotal: subtotal,
          shipping_cost: shippingCost,
          tax: tax,
          total: total,
          status: 'pending',
          payment_method: null,
          payment_status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      setOrderId(order.id);
      clearCart();
      setStep('success');
      onComplete(order.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
      setStep('payment');
    }
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-ink-50 flex flex-col">
        <header className="bg-white border-b border-ink-100 sticky top-0 z-40">
          <div className="container-padding py-3 flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-1.5 text-ink-500 hover:text-ink-900 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <Logo className="h-8 w-auto" />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-ink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-10 h-10 text-ink-300" />
            </div>
            <h2 className="text-xl font-bold text-ink-800 mb-2">Your cart is empty</h2>
            <p className="text-ink-500 mb-6">Add some products before checking out.</p>
            <button onClick={onBack} className="btn-primary">Continue Shopping</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Header */}
      <header className="bg-white border-b border-ink-100 sticky top-0 z-40">
        <div className="container-padding py-3 flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-1.5 text-ink-500 hover:text-ink-900 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="w-px h-5 bg-ink-200" />
          <Logo className="h-8 w-auto" />
          <div className="ml-auto flex items-center gap-2 text-sm text-ink-400">
            <Lock className="w-4 h-4" />
            Secure Checkout
          </div>
        </div>
      </header>

      <main className="container-padding py-8">
        <div className="max-w-5xl mx-auto">
          {/* Progress steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {['details', 'payment', 'success'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === 'processing' && s === 'payment'
                    ? 'bg-brand-500 text-white'
                    : ['details', 'payment', 'processing', 'success'].indexOf(step) >= i
                    ? 'bg-brand-500 text-white'
                    : 'bg-ink-200 text-ink-500'
                }`}>
                  {['details', 'payment', 'processing', 'success'].indexOf(step) > i ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-sm font-medium hidden sm:inline ${
                  step === s ? 'text-brand-600' : 'text-ink-400'
                }`}>
                  {s === 'details' ? 'Shipping' : s === 'payment' ? 'Payment' : 'Complete'}
                </span>
                {i < 2 && <div className={`w-12 h-0.5 ${i < ['details', 'payment', 'processing', 'success'].indexOf(step) ? 'bg-brand-500' : 'bg-ink-200'}`} />}
              </div>
            ))}
          </div>

          {step === 'success' ? (
            <div className="bg-white rounded-xl p-8 text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-ink-900 mb-2">Order Placed!</h2>
              <p className="text-ink-500 mb-4">
                Your order #{orderId?.slice(0, 8)} has been received. You'll receive a confirmation email shortly.
              </p>
              <p className="text-xs text-ink-400 mb-6">
                Complete payment via crypto in the Admin Dashboard, or await payment instructions.
              </p>
              <button onClick={onBack} className="btn-primary">Continue Shopping</button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Form */}
              <div className="lg:col-span-3">
                {step === 'details' && (
                  <form onSubmit={handleSubmitDetails} className="bg-white rounded-xl p-6 space-y-6">
                    <h2 className="text-lg font-bold text-ink-900">Shipping Information</h2>

                    <div>
                      <label className="block text-xs font-medium text-ink-600 mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-500/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-ink-600 mb-1.5">First Name</label>
                        <input
                          type="text"
                          required
                          value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-ink-600 mb-1.5">Last Name</label>
                        <input
                          type="text"
                          required
                          value={form.lastName}
                          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-ink-600 mb-1.5">Address</label>
                      <input
                        type="text"
                        required
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="123 Main St"
                        className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-500/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-ink-600 mb-1.5">City</label>
                        <input
                          type="text"
                          required
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-ink-600 mb-1.5">State</label>
                        <input
                          type="text"
                          required
                          value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })}
                          className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-ink-600 mb-1.5">ZIP</label>
                        <input
                          type="text"
                          required
                          value={form.postalCode}
                          onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                          className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-500/20"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                      </div>
                    )}

                    <button type="submit" className="btn-primary w-full justify-center">
                      Continue to Payment
                    </button>
                  </form>
                )}

                {step === 'payment' && (
                  <div className="bg-white rounded-xl p-6 space-y-6">
                    <h2 className="text-lg font-bold text-ink-900">Payment</h2>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-800 font-medium mb-2">Payment Options</p>
                      <p className="text-xs text-amber-700">
                        This demo captures orders for fulfillment through the Admin Dashboard.
                        Crypto payments can be generated after order placement.
                      </p>
                    </div>

                    <div className="bg-ink-50 border border-ink-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-ink-400" />
                        <span className="text-sm font-medium text-ink-700">Ship to:</span>
                      </div>
                      <p className="text-sm text-ink-600 pl-8">
                        {form.firstName} {form.lastName}<br />
                        {form.address}<br />
                        {form.city}, {form.state} {form.postalCode}
                      </p>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep('details')}
                        className="flex-1 py-3 border border-ink-200 rounded-lg text-sm font-semibold text-ink-600 hover:bg-ink-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        className="flex-1 btn-primary justify-center"
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                )}

                {step === 'processing' && (
                  <div className="bg-white rounded-xl p-12 text-center">
                    <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto mb-4" />
                    <p className="text-ink-600 font-medium">Processing your order...</p>
                  </div>
                )}
              </div>

              {/* Order summary */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-6 sticky top-24">
                  <h3 className="text-base font-bold text-ink-900 mb-4">Order Summary</h3>

                  <div className="space-y-3 mb-4">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-ink-50 shrink-0">
                          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink-800 line-clamp-2">{product.title}</p>
                          <p className="text-xs text-ink-400">Qty: {quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-ink-900 shrink-0">
                          ${(product.price * quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-ink-100 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-ink-600">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-ink-600">
                      <span>Shipping</span>
                      <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                        {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-ink-600">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-ink-900 pt-2 border-t border-ink-100">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-ink-400">
                    <Lock className="w-3.5 h-3.5" />
                    Your information is secure
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
