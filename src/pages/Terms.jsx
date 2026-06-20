// 20/06/2026
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-[5vw] py-8 md:py-16">
      <Link to="/" className="inline-flex items-center gap-1 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ChevronLeft size={14} /> Back to Shop
      </Link>
      <h1 className="font-display text-3xl tracking-[0.15em] uppercase mb-8">Terms of Service</h1>
      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed font-body">
        <p>By using Mythic Store, you agree to the following terms and conditions governing the purchase and use of our products.</p>
        <h2 className="font-display text-lg tracking-[0.1em] uppercase text-foreground pt-4">Orders & Payment</h2>
        <p>All orders are subject to availability. We accept Cash on Delivery (COD) as our primary payment method. Orders are confirmed once placed and will be processed within 1-2 business days.</p>
        <h2 className="font-display text-lg tracking-[0.1em] uppercase text-foreground pt-4">Shipping & Delivery</h2>
        <p>We deliver nationwide across Pakistan within 3-5 business days. Free shipping is available on orders above PKR 5,000. A flat rate of PKR 200 applies to orders below this threshold.</p>
        <h2 className="font-display text-lg tracking-[0.1em] uppercase text-foreground pt-4">Returns & Exchanges</h2>
        <p>We accept returns and exchanges within 7 days of delivery for unworn items in original condition with tags attached. Please contact our support team to initiate a return.</p>
        <h2 className="font-display text-lg tracking-[0.1em] uppercase text-foreground pt-4">Contact</h2>
        <p>For any questions about these terms, reach out at <a href="mailto:hello@mythicstore.com" className="text-foreground border-b border-foreground">hello@mythicstore.com</a>.</p>
      </div>
    </div>
  );
}