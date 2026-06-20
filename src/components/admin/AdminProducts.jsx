// 20/06/2026
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ProductForm from '@/components/admin/ProductForm';

const CATEGORIES = ['Shirts', 'Pants', 'Trousers', 'Jackets', 'Sweaters', 'Polos', 'T-Shirts'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const all = await base44.entities.Product.list('createdDate');
    setProducts(all);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    await base44.entities.Product.delete(id);
    load();
  }

  function handleEdit(product) {
    setEditProduct(product);
    setShowForm(true);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditProduct(null);
    load();
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse border border-border p-4 flex gap-4">
            <div className="w-16 h-20 bg-secondary" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-secondary w-1/3" />
              <div className="h-3 bg-secondary w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (showForm) {
    return <ProductForm product={editProduct} onClose={handleFormClose} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{products.length} products</p>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-xs tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 border border-border">
          <p className="text-sm text-muted-foreground tracking-wide mb-4">No products yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map(product => {
            const totalStock = product.variants?.reduce((sum, v) =>
              sum + (v.sizes ? Object.values(v.sizes).reduce((s, q) => s + q, 0) : 0), 0) || 0;

            return (
              <div key={product.id} className="border border-border p-4 flex gap-4 items-start hover:bg-secondary/20 transition-colors">
                <div className="w-16 h-20 bg-secondary flex-shrink-0 overflow-hidden">
                  {product.variants?.[0]?.imageUrl ? (
                    <img src={product.variants[0].imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">No img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-medium tracking-wide">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {product.category} · PKR {product.price?.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {product.variants?.length || 0} color{(product.variants?.length || 0) !== 1 ? 's' : ''} · {totalStock} in stock
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <span className={`text-[10px] tracking-[0.1em] uppercase px-2 py-1 ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-secondary text-muted-foreground'
                      }`}>
                        {product.status}
                      </span>
                      {product.featured && (
                        <span className="text-[10px] tracking-[0.1em] uppercase px-2 py-1 bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-2">
                    {product.variants?.map(v => (
                      <span
                        key={v.color}
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: v.colorHex || '#ccc' }}
                        title={`${v.color}: ${v.sizes ? Object.entries(v.sizes).map(([s, q]) => `${s}(${q})`).join(', ') : 'No sizes'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 hover:bg-secondary transition-colors"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 hover:bg-destructive/10 text-destructive transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}