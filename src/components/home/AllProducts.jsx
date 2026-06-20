// 20/06/2026
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORIES = ['Shirts', 'Pants', 'Trousers', 'Jackets', 'Sweaters', 'Polos', 'T-Shirts'];
const COLORS = ['Black', 'White', 'Navy', 'Grey', 'Olive', 'Burgundy', 'Beige', 'Blue', 'Brown'];
const PRICE_RANGES = [
  { label: 'Under 2,000', min: 0, max: 2000 },
  { label: '2,000 - 4,000', min: 2000, max: 4000 },
  { label: '4,000 - 6,000', min: 4000, max: 6000 },
  { label: 'Above 6,000', min: 6000, max: Infinity },
];

function getEffectivePrice(product) {
  if (product.discount_enabled && product.discount_percent > 0) {
    return Math.round(product.price * (1 - product.discount_percent / 100));
  }
  return product.price;
}

export default function AllProducts() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    color: '',
    priceRange: '',
    size: '',
    inStockOnly: false,
  });

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setFilters(f => ({ ...f, category: cat }));
  }, [searchParams]);

  useEffect(() => {
    async function load() {
      const all = await base44.entities.Product.filter({ status: 'active' });
      setProducts(all);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (filters.category && p.category !== filters.category) return false;
      if (filters.color) {
        const hasColor = p.variants?.some(v => v.color?.toLowerCase() === filters.color.toLowerCase());
        if (!hasColor) return false;
      }
      if (filters.priceRange) {
        const range = PRICE_RANGES.find(r => r.label === filters.priceRange);
        const effective = getEffectivePrice(p);
        if (range && (effective < range.min || effective >= range.max)) return false;
      }
      if (filters.size) {
        const hasSize = p.variants?.some(v => v.sizes && v.sizes[filters.size] !== undefined);
        if (!hasSize) return false;
      }
      if (filters.inStockOnly) {
        const hasStock = p.variants?.some(v => v.sizes && Object.values(v.sizes).some(qty => qty > 0));
        if (!hasStock) return false;
      }
      return true;
    });
  }, [products, filters]);

  const activeFilterCount = Object.values(filters).filter(v => v && v !== false).length;
  const clearFilters = () => setFilters({ category: '', color: '', priceRange: '', size: '', inStockOnly: false });
  const allSizes = filters.category === 'Pants' ? ['30', '32', '34', '36'] : ['S', 'M', 'L', 'XL'];

  if (loading) {
    return (
      <section className="py-12 px-[5vw] max-w-[120rem] mx-auto" id="products">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-secondary" />
              <div className="h-3 bg-secondary mt-4 w-3/4" />
              <div className="h-3 bg-secondary mt-2 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 px-[5vw] max-w-[120rem] mx-auto" id="products">
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <div>
          <h2 className="font-display text-2xl md:text-3xl tracking-[0.15em] uppercase">
            {filters.category || 'All Products'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1 tracking-wide">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          </p>
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase border border-border px-4 py-2.5 hover:bg-secondary transition-colors relative"
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 bg-foreground text-background text-[10px] rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <div className={`overflow-hidden transition-all duration-500 ease-out ${filtersOpen ? 'max-h-[500px] mb-8' : 'max-h-0'}`}>
        <div className="border border-border p-6 grid grid-cols-2 md:grid-cols-5 gap-6">
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-3">Category</label>
            <div className="space-y-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setFilters(f => ({ ...f, category: f.category === cat ? '' : cat }))}
                  className={`block text-xs tracking-wide transition-opacity ${filters.category === cat ? 'font-semibold opacity-100' : 'opacity-50 hover:opacity-80'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-3">Color</label>
            <div className="space-y-2">
              {COLORS.map(color => (
                <button key={color} onClick={() => setFilters(f => ({ ...f, color: f.color === color ? '' : color }))}
                  className={`block text-xs tracking-wide transition-opacity ${filters.color === color ? 'font-semibold opacity-100' : 'opacity-50 hover:opacity-80'}`}>
                  {color}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-3">Price (PKR)</label>
            <div className="space-y-2">
              {PRICE_RANGES.map(r => (
                <button key={r.label} onClick={() => setFilters(f => ({ ...f, priceRange: f.priceRange === r.label ? '' : r.label }))}
                  className={`block text-xs tracking-wide transition-opacity ${filters.priceRange === r.label ? 'font-semibold opacity-100' : 'opacity-50 hover:opacity-80'}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-3">Size</label>
            <div className="flex flex-wrap gap-2">
              {allSizes.map(size => (
                <button key={size} onClick={() => setFilters(f => ({ ...f, size: f.size === size ? '' : size }))}
                  className={`w-10 h-10 border text-xs flex items-center justify-center transition-all ${
                    filters.size === size ? 'bg-foreground text-background border-foreground' : 'border-border hover:border-foreground'
                  }`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-3">Availability</label>
              <button onClick={() => setFilters(f => ({ ...f, inStockOnly: !f.inStockOnly }))}
                className={`text-xs tracking-wide transition-opacity ${filters.inStockOnly ? 'font-semibold opacity-100' : 'opacity-50 hover:opacity-80'}`}>
                {filters.inStockOnly ? '✓ ' : ''}In Stock Only
              </button>
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs tracking-wide text-destructive mt-4 hover:opacity-80 transition-opacity">
                <X size={12} /> Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted-foreground text-sm tracking-wide mb-4">No products match your filters</p>
          <button onClick={clearFilters} className="text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:opacity-60 transition-opacity">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product, i) => {
            const effectivePrice = getEffectivePrice(product);
            const hasDiscount = product.discount_enabled && product.discount_percent > 0;
            return (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}>
                <Link to={`/product/${product.id}`} className="group block">
                  <div className="aspect-[3/4] bg-secondary overflow-hidden mb-4 relative">
                    {product.variants?.[0]?.image_url ? (
                      <img src={product.variants[0].image_url} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-xs">No Image</div>
                    )}
                    {product.variants?.every(v => !v.sizes || Object.values(v.sizes).every(q => q <= 0)) && (
                      <div className="absolute top-3 left-3 bg-foreground/80 text-background text-[10px] tracking-[0.2em] uppercase px-3 py-1.5">Sold Out</div>
                    )}
                    {hasDiscount && (
                      <div className="absolute top-3 right-3 bg-foreground text-background text-[10px] tracking-[0.15em] uppercase px-2 py-1">
                        -{product.discount_percent}%
                      </div>
                    )}
                  </div>
                  <h3 className="text-xs md:text-sm tracking-[0.1em] uppercase font-medium truncate">{product.name}</h3>
                  <div className="mt-1">
                    {hasDiscount ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium">PKR {effectivePrice.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground line-through">PKR {product.price?.toLocaleString()}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground tracking-wide">PKR {product.price?.toLocaleString()}</p>
                    )}
                  </div>
                  {product.variants?.length > 1 && (
                    <div className="flex items-center gap-1.5 mt-2">
                      {product.variants.slice(0, 4).map(v => (
                        <span key={v.color} className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: v.color_hex || '#ccc' }} title={v.color} />
                      ))}
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}