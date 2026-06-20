// 20/06/2026
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-[5vw] py-8 md:py-16">
      <Link to="/" className="inline-flex items-center gap-1 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ChevronLeft size={14} /> Back to Shop
      </Link>
      <h1 className="font-display text-3xl tracking-[0.15em] uppercase mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed font-body">
        <p>At Mythic Store, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.</p>
        <h2 className="font-display text-lg tracking-[0.1em] uppercase text-foreground pt-4">Information We Collect</h2>
        <p>We collect information you provide directly, including your name, email address, phone number, and shipping address when you place an order.</p>
        <h2 className="font-display text-lg tracking-[0.1em] uppercase text-foreground pt-4">How We Use Your Information</h2>
        <p>Your information is used solely to process and deliver your orders, communicate order updates, and improve our services. We do not sell or share your personal data with third parties for marketing purposes.</p>
        <h2 className="font-display text-lg tracking-[0.1em] uppercase text-foreground pt-4">Data Security</h2>
        <p>We implement industry-standard security measures to protect your personal information. All data is stored securely and accessed only by authorized personnel.</p>
        <h2 className="font-display text-lg tracking-[0.1em] uppercase text-foreground pt-4">Contact</h2>
        <p>For any privacy-related inquiries, please contact us at <a href="mailto:hello@mythicstore.com" className="text-foreground border-b border-foreground">hello@mythicstore.com</a>.</p>
      </div>
    </div>
  );
}