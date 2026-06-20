// 20/06/2026
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';

function getEffectivePrice(product) {
  if (product.discount_enabled && product.discount_percent > 0) {
    return Math.round(product.price * (1 - product.discount_percent / 100));
  }
  return product.price;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const all = await base44.entities.Product.filter({ status: 'active', featured: true });
      setProducts(all.length > 0 ? all : (await base44.entities.Product.filter({ status: 'active' })).slice(0, 8));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-32 px-[5vw] max-w-[120rem] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array(4).fill(0).map((_, i) => (
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
    <section className="py-20 md:py-32 px-[5vw] max-w-[120rem] mx-auto">
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2 font-body">Curated</p>
          <h2 className="font-display text-3xl md:text-4xl tracking-[0.15em] uppercase">Featured</h2>
        </div>
        <Link to="/?featured=true" className="text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:opacity-60 transition-opacity hidden md:block">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, i) => {
          const effectivePrice = getEffectivePrice(product);
          const hasDiscount = product.discount_enabled && product.discount_percent > 0;
          return (
            <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}>
              <Link to={`/product/${product.id}`} className="group block">
                <div className="aspect-[3/4] bg-secondary overflow-hidden mb-4 relative">
                  {product.variants?.[0]?.image_url ? (
                    <img src={product.variants[0].image_url} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-xs tracking-wide">No Image</div>
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
                    {product.variants.length > 4 && (
                      <span className="text-[10px] text-muted-foreground">+{product.variants.length - 4}</span>
                    )}
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 text-center md:hidden">
        <Link to="/?featured=true" className="text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1">View All</Link>
      </div>
    </section>
  );
}