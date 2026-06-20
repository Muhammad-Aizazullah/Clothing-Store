// 20/06/2026
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Star, LogOut, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import AccountAuth from '@/components/account/AccountAuth';

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState(null);

  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const me = await base44.auth.me();
        setUser(me);
        loadOrders(me.id);
      }
    } catch {}
    setLoading(false);
  }

  async function loadOrders(userId) {
    setOrdersLoading(true);
    const all = await base44.entities.Order.filter({ user_id: userId });
    setOrders(all.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
    setOrdersLoading(false);
  }

  async function handleLogout() {
    await base44.auth.logout('/account');
  }

  async function submitReview() {
    if (!reviewForm?.comment?.trim() || !reviewForm?.rating) {
      toast({ description: 'Please add a rating and comment', variant: 'destructive' });
      return;
    }
    await base44.entities.Review.create({
      product_id: reviewForm.product_id,
      order_id: reviewForm.order_id,
      reviewer_name: user?.full_name || 'Customer',
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    });

    // Update product average rating
    const reviews = await base44.entities.Review.filter({ product_id: reviewForm.product_id });
    const visibleReviews = reviews.filter(r => !r.is_hidden);
    const avg = visibleReviews.reduce((s, r) => s + r.rating, 0) / visibleReviews.length;
    await base44.entities.Product.update(reviewForm.product_id, {
      average_rating: Math.round(avg * 10) / 10,
      review_count: visibleReviews.length,
    });

    toast({ description: 'Review submitted successfully' });
    setReviewForm(null);
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AccountAuth onAuth={checkAuth} />;
  }

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Packed': 'bg-blue-100 text-blue-800',
    'Dispatched': 'bg-purple-100 text-purple-800',
    'Completed': 'bg-green-100 text-green-800',
  };

  return (
    <div className="max-w-3xl mx-auto px-[5vw] py-8 md:py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Welcome back</p>
          <h1 className="font-display text-2xl md:text-3xl tracking-[0.1em] uppercase">
            {user.full_name || 'My Account'}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      {/* Orders */}
      <div>
        <h2 className="font-display text-lg tracking-[0.15em] uppercase mb-6 flex items-center gap-2">
          <Package size={18} strokeWidth={1.5} /> Order History
        </h2>

        {ordersLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse border border-border p-6">
                <div className="h-3 bg-secondary w-1/3 mb-2" />
                <div className="h-3 bg-secondary w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 border border-border">
            <Package size={40} strokeWidth={1} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground tracking-wide mb-4">No orders yet</p>
            <Link to="/" className="text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="border border-border">
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium tracking-wide">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(order.created_date).toLocaleDateString('en-PK', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                      {' · '}PKR {order.total?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-sm ${statusColors[order.status] || 'bg-secondary'}`}>
                      {order.status}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {expandedOrder === order.id && (
                  <div className="border-t border-border px-5 py-4 space-y-3">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="w-12 h-14 bg-secondary flex-shrink-0 overflow-hidden">
                          {item.image_url && <img src={item.image_url} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium tracking-wide">{item.product_name}</p>
                          <p className="text-[10px] text-muted-foreground">{item.color} / {item.size} × {item.quantity}</p>
                          <p className="text-xs mt-0.5">PKR {(item.price * item.quantity).toLocaleString()}</p>
                        </div>

                        {/* Review button for completed orders */}
                        {order.status === 'Completed' && (
                          <button
                            onClick={() => setReviewForm({
                              product_id: item.product_id,
                              order_id: order.id,
                              product_name: item.product_name,
                              rating: 5,
                              comment: '',
                            })}
                            className="text-[10px] tracking-[0.15em] uppercase border-b border-foreground pb-0.5 whitespace-nowrap"
                          >
                            Write Review
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewForm && (
        <div className="fixed inset-0 z-[90] bg-foreground/30 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-background w-full max-w-md p-6 border border-border">
            <h3 className="font-display text-lg tracking-[0.1em] uppercase mb-1">Write a Review</h3>
            <p className="text-xs text-muted-foreground mb-6">{reviewForm.product_name}</p>

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array(5).fill(0).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setReviewForm(f => ({ ...f, rating: i + 1 }))}
                >
                  <Star
                    size={24}
                    className={i < reviewForm.rating ? 'fill-foreground text-foreground' : 'text-border'}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={reviewForm.comment}
              onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
              rows={4}
              placeholder="Share your experience..."
              className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground transition-colors resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setReviewForm(null)}
                className="flex-1 py-3 text-xs tracking-[0.2em] uppercase border border-border hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                className="flex-1 py-3 text-xs tracking-[0.2em] uppercase bg-foreground text-background hover:opacity-90 transition-opacity"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}