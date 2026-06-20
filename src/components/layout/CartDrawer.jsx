// 20/06/2026
import React from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, totalPrice } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[70] bg-foreground/30 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 z-[80] w-full max-w-md bg-background border-l border-border transition-transform duration-500 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <h2 className="font-display text-lg tracking-[0.2em] uppercase">Your Bag</h2>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:opacity-60 transition-opacity">
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Items */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
              <ShoppingBag size={48} strokeWidth={1} className="text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground tracking-wide">Your bag is empty</p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:opacity-60 transition-opacity"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {items.map(item => (
                  <div key={item.key} className="flex gap-4">
                    <div className="w-20 h-24 bg-secondary flex-shrink-0 overflow-hidden">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">No img</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium tracking-wide truncate">{item.product_name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.color} / {item.size}
                      </p>
                      <p className="text-sm mt-1 font-medium">PKR {item.price?.toLocaleString()}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="w-7 h-7 border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => {
                            if (item.quantity < item.max_stock) {
                              updateQuantity(item.key, item.quantity + 1);
                            }
                          }}
                          className={`w-7 h-7 border border-border flex items-center justify-center transition-colors ${
                            item.quantity >= item.max_stock ? 'opacity-30 cursor-not-allowed' : 'hover:bg-secondary'
                          }`}
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(item.key)}
                          className="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors tracking-wide uppercase"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-border px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm tracking-wide uppercase">Total</span>
                  <span className="text-lg font-display">PKR {totalPrice.toLocaleString()}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-foreground text-background text-center py-4 text-xs tracking-[0.25em] uppercase font-medium hover:opacity-90 transition-opacity"
                >
                  Checkout — COD
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}