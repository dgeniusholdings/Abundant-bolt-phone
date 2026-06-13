import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotal,
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-ink-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-500" />
            <h2 className="text-lg font-bold text-ink-900">Your Cart</h2>
            {totalItems > 0 && (
              <span className="bg-brand-100 text-brand-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 -mr-2 text-ink-500 hover:text-ink-800 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-ink-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-ink-300" />
            </div>
            <h3 className="text-lg font-semibold text-ink-800 mb-2">Your cart is empty</h3>
            <p className="text-ink-500 mb-6">Start shopping to add items to your cart.</p>
            <button
              onClick={closeCart}
              className="btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-ink-50 rounded-xl"
                >
                  {/* Product image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-white">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-ink-800 text-sm leading-tight line-clamp-2 mb-1">
                      {product.title}
                    </h4>
                    <p className="text-brand-500 font-bold">
                      ${product.price.toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-white rounded-lg border border-ink-200">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1.5 text-ink-500 hover:text-ink-800 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1.5 text-ink-500 hover:text-ink-800 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-1.5 text-ink-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with totals */}
            <div className="border-t border-ink-100 p-4 space-y-4 bg-white">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-ink-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-ink-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">
                    {subtotal >= 50 ? 'FREE' : '$5.99'}
                  </span>
                </div>
                {subtotal < 50 && (
                  <p className="text-xs text-brand-500 font-medium">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="flex justify-between text-lg font-bold text-ink-900 pt-2 border-t border-ink-100">
                  <span>Total</span>
                  <span>${(subtotal >= 50 ? subtotal : subtotal + 5.99).toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout button */}
              <button className="btn-primary w-full text-center">
                Proceed to Checkout
              </button>
              <button
                onClick={closeCart}
                className="w-full text-center text-sm text-ink-500 hover:text-ink-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
