// 20/06/2026
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useCart } from '@/lib/cartContext';
import { useStoreSettings } from '@/lib/useStoreSettings';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const settings = useStoreSettings();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: '',
  });

  const freeDeliveryMin = settings.free_delivery_enabled ? (settings.free_delivery_minimum ?? 5000) : Infinity;
  const deliveryFee = totalPrice >= freeDeliveryMin ? 0 : 200;
  const grandTotal = totalPrice + deliveryFee;

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!form.customer_name || !form.customer_phone || !form.shipping_address || !form.city) return;

    setSubmitting(true);

    const orderNum = 'MYT-' + Date.now().toString(36).toUpperCase();

    for (const item of items) {
      const products = await base44.entities.Product.filter({ id: item.product_id });
      if (products.length > 0) {
        const product = products[0];
        const updatedVariants = product.variants?.map(v => {
          if (v.color === item.color && v.sizes) {
            const newSizes = { ...v.sizes };
            if (newSizes[item.size] !== undefined) {
              newSizes[item.size] = Math.max(0, newSizes[item.size] - item.quantity);
            }
            return { ...v, sizes: newSizes };
          }
          return v;
        });
        await base44.entities.Product.update(product.id, { variants: updatedVariants });
      }
    }

    let userId = null;
    try {
      const me = await base44.auth.me();
      userId = me?.id;
    } catch {}

    await base44.entities.Order.create({
      order_number: orderNum,
      ...form,
      items: items.map(i => ({
        product_id: i.product_id,
        product_name: i.product_name,
        color: i.color,
        size: i.size,
        quantity: i.quantity,
        price: i.price,
        image_url: i.image_url,
      })),
      total: grandTotal,
      status: 'Pending',
      payment_method: 'COD',
      is_guest: !userId,
      user_id: userId || '',
    });

    clearCart();
    setOrderNumber(orderNum);
    setOrderPlaced(true);
    setSubmitting(false);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-chart-1/10 flex items-center justify-center mb-6">
          <Check size={32} className="text-chart-1" />
        </div>
        <h1 className="font-display text-2xl md:text-3xl tracking-[0.15em] uppercase mb-3">Order Confirmed</h1>
        <p className="text-sm text-muted-foreground tracking-wide mb-2">
          Your order <span className="font-medium text-foreground">{orderNumber}</span> has been placed.
        </p>
        <p className="text-sm text-muted-foreground tracking-wide mb-8">Payment: Cash on Delivery</p>
        <Link
          to="/"
          className="bg-foreground text-background px-8 py-3.5 text-xs tracking-[0.25em] uppercase font-medium hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-muted-foreground tracking-wide text-sm">Your bag is empty</p>
        <Link to="/" className="text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[120rem] mx-auto px-[5vw] py-6 md:py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ChevronLeft size={14} /> Back to Shop
      </Link>

      <h1 className="font-display text-2xl md:text-3xl tracking-[0.15em] uppercase mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div>
            <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">Full Name *</label>
            <input
              type="text"
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              required
              className="w-full border border-border bg-transparent px-4 py-3.5 text-sm tracking-wide outline-none focus:border-foreground transition-colors"
              placeholder="Muhammad Ali"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">Phone Number *</label>
              <input
                type="tel"
                name="customer_phone"
                value={form.customer_phone}
                onChange={handleChange}
                required
                className="w-full border border-border bg-transparent px-4 py-3.5 text-sm tracking-wide outline-none focus:border-foreground transition-colors"
                placeholder="0300 1234567"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">Email (Optional)</label>
              <input
                type="email"
                name="customer_email"
                value={form.customer_email}
                onChange={handleChange}
                className="w-full border border-border bg-transparent px-4 py-3.5 text-sm tracking-wide outline-none focus:border-foreground transition-colors"
                placeholder="you@email.com"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">Shipping Address *</label>
            <textarea
              name="shipping_address"
              value={form.shipping_address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-border bg-transparent px-4 py-3.5 text-sm tracking-wide outline-none focus:border-foreground transition-colors resize-none"
              placeholder="House #, Street, Area"
            />
          </div>

          <div>
            <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">City *</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full border border-border bg-transparent px-4 py-3.5 text-sm tracking-wide outline-none focus:border-foreground transition-colors"
              placeholder="Lahore"
            />
          </div>

          <div className="border border-border p-5 bg-secondary/30">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-foreground rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-foreground rounded-full" />
              </div>
              <div>
                <p className="text-sm font-medium tracking-wide">Cash on Delivery</p>
                <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-foreground text-background py-4 text-xs tracking-[0.25em] uppercase font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? 'Placing Order...' : `Place Order — PKR ${grandTotal.toLocaleString()}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-32 border border-border p-6">
            <h2 className="font-display text-lg tracking-[0.15em] uppercase mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.key} className="flex gap-3">
                  <div className="w-14 h-16 bg-secondary flex-shrink-0 overflow-hidden">
                    {item.image_url && <img src={item.image_url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium tracking-wide truncate">{item.product_name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.color} / {item.size} × {item.quantity}</p>
                    <p className="text-xs mt-1">PKR {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-xs tracking-wide">
                <span className="text-muted-foreground">Subtotal</span>
                <span>PKR {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs tracking-wide">
                <span className="text-muted-foreground">Delivery</span>
                <span>{deliveryFee === 0 ? 'Free' : `PKR ${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-medium tracking-wide pt-2 border-t border-border">
                <span>Total</span>
                <span className="font-display text-lg">PKR {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}