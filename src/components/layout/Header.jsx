// 20/06/2026
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Sun, Moon, MessageCircle } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useTheme } from '@/lib/ThemeContext';
import { useStoreSettings } from '@/lib/useStoreSettings';
import SearchOverlay from '@/components/layout/SearchOverlay';

export default function Header() {
  const { totalItems, setIsOpen } = useCart();
  const { theme, toggle } = useTheme();
  const settings = useStoreSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}>
        {/* Announcement bar */}
        <div className="bg-foreground text-background text-center py-2 px-4">
          <p className="text-xs tracking-[0.25em] uppercase font-body">
            Free Delivery on Orders Above PKR 5,000
          </p>
        </div>

        <div className="max-w-[120rem] mx-auto px-[5vw]">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 -ml-2"
              aria-label="Toggle menu"
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link to="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
              <h1 className="font-display text-xl md:text-2xl tracking-[0.3em] uppercase font-medium">
                Mythic
              </h1>
            </Link>

            <nav className="hidden md:flex items-center gap-8 ml-16">
              {['Shirts', 'Pants', 'Jackets', 'Polos'].map(cat => (
                <Link
                  key={cat}
                  to={`/?category=${cat}`}
                  className="text-xs tracking-[0.2em] uppercase font-body hover:opacity-60 transition-opacity duration-300"
                >
                  {cat}
                </Link>
              ))}
              <Link
                to="/?featured=true"
                className="text-xs tracking-[0.2em] uppercase font-body hover:opacity-60 transition-opacity duration-300"
              >
                Featured
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <a 
                href={`https://wa.me/${settings.whatsappNumber || '923001234567'}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover:opacity-60 transition-opacity"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle size={18} strokeWidth={1.5} />
              </a>
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:opacity-60 transition-opacity"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
              <button
                onClick={toggle}
                className="p-2 hover:opacity-60 transition-opacity"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
              </button>
              <Link to="/account" className="p-2 hover:opacity-60 transition-opacity hidden md:block">
                <User size={18} strokeWidth={1.5} />
              </Link>
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 hover:opacity-60 transition-opacity relative"
                aria-label="Cart"
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-foreground text-background text-[10px] rounded-full flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}