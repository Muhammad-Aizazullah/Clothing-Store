// 20/06/2026
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Plus, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useCart } from '@/lib/cartContext';
import { useStoreSettings } from '@/lib/useStoreSettings';
import ProductReviews from '@/components/product/ProductReviews';
import SizeGuide from '@/components/product/SizeGuide';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem, getItemQuantity, setIsOpen } = useCart();
  const settings = useStoreSettings();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const products = await base44.entities.Product.filter({ id });
      if (products.length > 0) {
        const p = products[0];
        setProduct(p);
        if (p.variants?.length > 0) setSelectedColor(p.variants[0].color);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-muted-foreground tracking-wide">Product not found</p>
        <Link to="/" className="text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1">Back to Shop</Link>
      </div>
    );
  }

  const currentVariant = product.variants?.find(v => v.color === selectedColor) || product.variants?.[0];
  const availableSizes = currentVariant?.sizes ? Object.keys(currentVariant.sizes) : [];
  const currentStock = selectedSize && currentVariant?.sizes ? currentVariant.sizes[selectedSize] || 0 : 0;
  const cartQty = selectedSize ? getItemQuantity(product.id, selectedColor, selectedSize) : 0;
  const canAdd = selectedSize && currentStock > 0 && cartQty < currentStock;
  const isOutOfStock = selectedSize && currentStock <= 0;

  const discountedPrice = product.discount_enabled && product.discount_percent > 0
    ? Math.round(product.price * (1 - product.discount_percent / 100))
    : null;

  const whatsappNumber = settings.whatsapp_number || '923001234567';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    if (!canAdd) return;
    addItem(product, selectedColor, selectedSize, 1);
  };

  const handleIncreaseQty = () => {
    if (cartQty < currentStock) addItem(product, selectedColor, selectedSize, 1);
  };

  return (
    <div className="max-w-[120rem] mx-auto px-[5vw] py-6 md:py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ChevronLeft size={14} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        {/* Image */}
        <motion.div
          key={currentVariant?.image_url}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="aspect-[3/4] bg-secondary overflow-hidden md:sticky md:top-32"
        >
          {currentVariant?.image_url ? (
            <img src={currentVariant.image_url} alt={`${product.name} - ${selectedColor}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No Image</div>
          )}
        </motion.div>

        {/* Details */}
        <div className="py-4">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2 font-body">{product.category}</p>
          <h1 className="font-display text-3xl md:text-4xl tracking-[0.1em] uppercase mb-4">{product.name}</h1>

          {/* Price with discount */}
          <div className="mb-6">
            {discountedPrice ? (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-display text-2xl">PKR {discountedPrice.toLocaleString()}</span>
                <span className="font-display text-lg text-muted-foreground line-through">PKR {product.price?.toLocaleString()}</span>
                <span className="text-xs tracking-[0.1em] uppercase bg-foreground text-background px-2 py-1">
                  {product.discount_percent}% OFF
                </span>
              </div>
            ) : (
              <p className="font-display text-2xl">PKR {product.price?.toLocaleString()}</p>
            )}
          </div>

          {/* Rating */}
          {product.review_count > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-0.5">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(product.average_rating || 0) ? 'fill-foreground text-foreground' : 'text-border'} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.review_count} {product.review_count === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 font-body">{product.description}</p>
          )}

          <div className="border-t border-border my-6" />

          {/* Color Selector */}
          {product.variants?.length > 1 && (
            <div className="mb-8">
              <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-3">
                Color — {selectedColor}
              </label>
              <div className="flex items-center gap-3">
                {product.variants.map(v => (
                  <button
                    key={v.color}
                    onClick={() => { setSelectedColor(v.color); setSelectedSize(null); }}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      selectedColor === v.color ? 'border-foreground scale-110' : 'border-border hover:border-foreground/50'
                    }`}
                    style={{ backgroundColor: v.color_hex || '#ccc' }}
                    title={v.color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                Size {product.sizing_type === 'waist' ? '(Waist)' : ''}
              </label>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
              >
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => {
                const qty = currentVariant.sizes[size] || 0;
                const outOfStock = qty <= 0;
                return (
                  <button
                    key={size}
                    onClick={() => !outOfStock && setSelectedSize(size)}
                    disabled={outOfStock}
                    className={`min-w-[3rem] h-12 px-4 border text-sm tracking-wide transition-all duration-300 ${
                      outOfStock
                        ? 'border-border/50 text-muted-foreground/30 line-through cursor-not-allowed'
                        : selectedSize === size
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border hover:border-foreground'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cart Action */}
          {cartQty > 0 && selectedSize ? (
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-secondary">
                <ShoppingBag size={16} className="text-muted-foreground" />
                <span className="text-sm tracking-wide flex-1">{cartQty} in your bag</span>
                <button
                  onClick={handleIncreaseQty}
                  disabled={cartQty >= currentStock}
                  className={`flex items-center gap-2 px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all ${
                    cartQty >= currentStock ? 'opacity-30 cursor-not-allowed bg-muted' : 'bg-foreground text-background hover:opacity-90'
                  }`}
                >
                  <Plus size={12} /> Add More
                </button>
              </div>
              <button
                onClick={() => setIsOpen(true)}
                className="w-full py-3 text-xs tracking-[0.2em] uppercase border border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                View Bag
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!canAdd || isOutOfStock}
              className={`w-full py-4 text-xs tracking-[0.25em] uppercase font-medium transition-all duration-500 ${
                isOutOfStock
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : !selectedSize
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-foreground text-background hover:opacity-90'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : !selectedSize ? 'Select a Size' : 'Add to Bag'}
            </button>
          )}

          {/* Delivery info + WhatsApp */}
          <div className="mt-8 space-y-3 border-t border-border pt-6">
            <div className="flex items-center gap-3 text-xs text-muted-foreground tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-chart-1" />
              Cash on Delivery — Pay when it arrives
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-chart-1" />
              {settings.free_delivery_enabled
                ? `Free shipping on orders above PKR ${settings.free_delivery_minimum?.toLocaleString()}`
                : 'Standard delivery charges apply'}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-chart-1" />
              3-5 business days delivery nationwide
            </div>

            {/* WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full mt-4 py-3 border border-[#25D366] text-[#25D366] text-xs tracking-[0.2em] uppercase hover:bg-[#25D366] hover:text-white transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <SizeGuide isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} sizingType={product.sizing_type} />
      <ProductReviews productId={product.id} />
    </div>
  );
}