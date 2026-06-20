// 20/06/2026
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80 mt-auto">
      <div className="max-w-[120rem] mx-auto px-[5vw] py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="font-display text-2xl tracking-[0.3em] uppercase text-background mb-4">
              Mythic
            </h2>
            <p className="text-sm leading-relaxed opacity-60 max-w-xs">
              Where modern attire meets legendary craftsmanship. Every piece tells a story of precision and style.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs tracking-[0.25em] uppercase text-background mb-6">Shop</h3>
            <nav className="flex flex-col gap-3">
              {['Shirts', 'Pants', 'Jackets', 'Polos', 'T-Shirts', 'Sweaters'].map(cat => (
                <Link
                  key={cat}
                  to={`/?category=${cat}`}
                  className="text-sm opacity-60 hover:opacity-100 transition-opacity duration-300"
                >
                  {cat}
                </Link>
              ))}
            </nav>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs tracking-[0.25em] uppercase text-background mb-6">Help</h3>
            <nav className="flex flex-col gap-3">
              <Link to="/account" className="text-sm opacity-60 hover:opacity-100 transition-opacity duration-300">
                My Account
              </Link>
              <Link to="/checkout" className="text-sm opacity-60 hover:opacity-100 transition-opacity duration-300">
                Checkout
              </Link>
              <a href="mailto:support@mythicstore.com" className="text-sm opacity-60 hover:opacity-100 transition-opacity duration-300">
                Contact Us
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs tracking-[0.25em] uppercase text-background mb-6">Contact</h3>
            <div className="flex flex-col gap-3 text-sm opacity-60">
              <a href="mailto:hello@mythicstore.com" className="hover:opacity-100 transition-opacity">
                hello@mythicstore.com
              </a>
              {/* WhatsApp Link Updated */}
              <a 
                href="https://wa.me/923001234567" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-100 transition-opacity"
              >
                +92 300 123 4567
              </a>
              <p>Lahore, Pakistan</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-40 tracking-wide">
            © {new Date().getFullYear()} Mythic Store. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs opacity-40 hover:opacity-80 transition-opacity tracking-wide">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs opacity-40 hover:opacity-80 transition-opacity tracking-wide">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}