// 20/06/2026
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const all = await base44.entities.Product.filter({ status: 'active' });
      const q = query.toLowerCase();
      const filtered = all.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.variants?.some(v => v.color?.toLowerCase().includes(q))
      );
      setResults(filtered.slice(0, 8));
      setLoading(false);
    }, 300);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto px-6 pt-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-display text-2xl tracking-[0.2em] uppercase">Search</h2>
          <button onClick={onClose} className="p-2 hover:opacity-60 transition-opacity">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="relative border-b-2 border-foreground pb-4 mb-8">
          <Search size={20} strokeWidth={1.5} className="absolute left-0 top-1/2 -translate-y-1/2 opacity-40" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products, categories..."
            className="w-full pl-8 bg-transparent text-lg font-body tracking-wide outline-none placeholder:text-muted-foreground/50"
          />
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <p className="text-center text-muted-foreground py-12 text-sm tracking-wide">
            No products found for "{query}"
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map(product => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              onClick={onClose}
              className="group"
            >
              <div className="aspect-[3/4] bg-secondary overflow-hidden mb-3">
                {product.variants?.[0]?.image_url ? (
                  <img
                    src={product.variants[0].image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No Image
                  </div>
                )}
              </div>
              <h3 className="text-xs tracking-[0.1em] uppercase font-medium truncate">{product.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">PKR {product.price?.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}