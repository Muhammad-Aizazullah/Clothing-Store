// 20/06/2026
import React, { useState } from 'react';
import { ChevronLeft, Plus, X, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

const CATEGORIES = ['Shirts', 'Pants', 'Trousers', 'Jackets', 'Sweaters', 'Polos', 'T-Shirts'];
const WAISTSIZES = ['30', '32', '34', '36'];
const LETTERSIZES = ['S', 'M', 'L', 'XL'];

function getSizingType(category) {
  return category === 'Pants' ? 'waist' : 'letter';
}

function getDefaultSizes(category) {
  const sizes = category === 'Pants' ? WAISTSIZES : LETTERSIZES;
  const obj = {};
  sizes.forEach(s => { obj[s] = 0; });
  return obj;
}

export default function ProductForm({ product, onClose }) {
  const isEdit = !!product;
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || 'Shirts',
    featured: product?.featured || false,
    status: product?.status || 'active',
    discountEnabled: product?.discountEnabled || false,
    discountPercent: product?.discountPercent || 0,
  });

  const [variants, setVariants] = useState(
    product?.variants?.map(v => ({
      color: v.color || '',
      colorHex: v.colorHex || '#000000',
      imageUrl: v.imageUrl || '',
      sizes: v.sizes || getDefaultSizes(product?.category || 'Shirts'),
      uploading: false,
    })) || [{ color: '', colorHex: '#000000', imageUrl: '', sizes: getDefaultSizes('Shirts'), uploading: false }]
  );

  const sizingType = getSizingType(form.category);
  const availableSizes = sizingType === 'waist' ? WAISTSIZES : LETTERSIZES;

  const discountedPrice = form.discountEnabled && form.discountPercent > 0
    ? Math.round(parseFloat(form.price || 0) * (1 - form.discountPercent / 100))
    : null;

  const handleCategoryChange = (category) => {
    setForm(f => ({ ...f, category }));
    setVariants(prev => prev.map(v => ({ ...v, sizes: getDefaultSizes(category) })));
  };

  const addVariant = () => {
    setVariants(prev => [...prev, { color: '', colorHex: '#000000', imageUrl: '', sizes: getDefaultSizes(form.category), uploading: false }]);
  };

  const removeVariant = (idx) => {
    if (variants.length <= 1) return;
    setVariants(prev => prev.filter((_, i) => i !== idx));
  };

  const updateVariant = (idx, field, value) => {
    setVariants(prev => prev.map((v, i) => i === idx ? { ...v, [field]: value } : v));
  };

  const updateSize = (variantIdx, size, qty) => {
    setVariants(prev => prev.map((v, i) => {
      if (i !== variantIdx) return v;
      return { ...v, sizes: { ...v.sizes, [size]: Math.max(0, parseInt(qty) || 0) } };
    }));
  };

  const handleImageUpload = async (idx, file) => {
    updateVariant(idx, 'uploading', true);
    const result = await base44.integrations.Core.UploadFile({ file });
    updateVariant(idx, 'imageUrl', result.fileUrl);
    updateVariant(idx, 'uploading', false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      toast({ description: 'Please fill in all required fields', variant: 'destructive', duration: 3000 });
      return;
    }
    if (variants.some(v => !v.color)) {
      toast({ description: 'Every variant needs a color name', variant: 'destructive', duration: 3000 });
      return;
    }

    setSaving(true);

    const data = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      sizingType: sizingType,
      featured: form.featured,
      status: form.status,
      discountEnabled: form.discountEnabled,
      discountPercent: form.discountEnabled ? parseFloat(form.discountPercent) || 0 : 0,
      variants: variants.map(v => ({
        color: v.color,
        colorHex: v.colorHex,
        imageUrl: v.imageUrl,
        sizes: v.sizes,
      })),
    };

    if (isEdit) {
      await base44.entities.Product.update(product.id, data);
      toast({ description: 'Product updated', duration: 3000 });
    } else {
      await base44.entities.Product.create(data);
      toast({ description: 'Product created', duration: 3000 });
    }

    setSaving(false);
    onClose();
  };

  return (
    <div>
      <button
        onClick={onClose}
        className="flex items-center gap-1 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft size={14} /> Back to Products
      </button>

      <h2 className="font-display text-xl tracking-[0.15em] uppercase mb-8">
        {isEdit ? 'Edit Product' : 'Add Product'}
      </h2>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
              placeholder="Classic Polo Shirt"
            />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">Original Price (PKR) *</label>
            <input
              type="number"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              required
              className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
              placeholder="5000"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
            className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground transition-colors resize-none"
            placeholder="Premium cotton polo with ribbed collar..."
          />
        </div>

        <div className="border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm tracking-wide font-medium">Discount</p>
              <p className="text-xs text-muted-foreground mt-0.5">Apply a percentage discount on this product</p>
            </div>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, discountEnabled: !f.discountEnabled }))}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                form.discountEnabled ? 'bg-foreground' : 'bg-border'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-background transition-transform duration-300 ${
                form.discountEnabled ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {form.discountEnabled && (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
                  Discount Percentage (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={form.discountPercent}
                  onChange={e => setForm(f => ({ ...f, discountPercent: e.target.value }))}
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
                  placeholder="50"
                />
              </div>
              {discountedPrice !== null && form.price && (
                <div className="bg-secondary/50 px-4 py-3 text-xs tracking-wide space-y-1">
                  <p className="text-muted-foreground">Original: <span className="line-through">PKR {parseFloat(form.price).toLocaleString()}</span></p>
                  <p className="font-medium">After {form.discountPercent}% off: <span className="text-foreground">PKR {discountedPrice.toLocaleString()}</span></p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">Category *</label>
            <select
              value={form.category}
              onChange={e => handleCategoryChange(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">Status</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer py-3">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="text-sm tracking-wide">Featured Product</span>
            </label>
          </div>
        </div>

        <div className="bg-secondary/50 p-4 text-xs text-muted-foreground tracking-wide">
          Sizing: {sizingType === 'waist' ? 'Waist sizes (30, 32, 34, 36)' : 'Letter sizes (S, M, L, XL)'}  auto selected based on category
        </div>

        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium tracking-[0.1em] uppercase">Color Variants</h3>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-1 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus size={12} /> Add Variant
            </button>
          </div>

          <div className="space-y-6">
            {variants.map((variant, idx) => (
              <div key={idx} className="border border-border p-4 relative">
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(idx)}
                    className="absolute top-3 right-3 p-1 hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">Color Name *</label>
                    <input
                      type="text"
                      value={variant.color}
                      onChange={e => updateVariant(idx, 'color', e.target.value)}
                      className="w-full border border-border bg-transparent px-3 py-2.5 text-sm outline-none focus:border-foreground transition-colors"
                      placeholder="Black"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">Color Code</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={variant.colorHex}
                        onChange={e => updateVariant(idx, 'colorHex', e.target.value)}
                        className="w-10 h-10 border border-border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={variant.colorHex}
                        onChange={e => updateVariant(idx, 'colorHex', e.target.value)}
                        className="flex-1 border border-border bg-transparent px-3 py-2.5 text-sm outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">Image</label>
                    {variant.imageUrl ? (
                      <div className="flex gap-2 items-center">
                        <img src={variant.imageUrl} alt="" className="w-10 h-10 object-cover border border-border" />
                        <label className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                          Change
                          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(idx, e.target.files[0])} />
                        </label>
                      </div>
                    ) : variant.uploading ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-4 h-4 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                        Uploading...
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 border border-border px-3 py-2.5 text-xs text-muted-foreground hover:border-foreground cursor-pointer transition-colors">
                        <Upload size={12} /> Upload Image
                        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(idx, e.target.files[0])} />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">Quantities per Size</label>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map(size => (
                      <div key={size} className="flex items-center gap-2">
                        <span className="text-xs font-medium w-6">{size}</span>
                        <input
                          type="number"
                          min="0"
                          value={variant.sizes[size] || 0}
                          onChange={e => updateSize(idx, size, e.target.value)}
                          className="w-16 border border-border bg-transparent px-2 py-1.5 text-sm text-center outline-none focus:border-foreground transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 border border-border text-xs tracking-[0.2em] uppercase hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-foreground text-background text-xs tracking-[0.2em] uppercase hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}