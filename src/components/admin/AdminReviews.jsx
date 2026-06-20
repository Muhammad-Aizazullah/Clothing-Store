// 20/06/2026
import React, { useState, useEffect } from 'react';
import { Star, Eye, EyeOff, Trash2, MessageSquare } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  async function load() {
    const all = await base44.entities.Review.list('createdDate');
    setReviews(all);
    setLoading(false);
  }

  async function toggleHide(review) {
    await base44.entities.Review.update(review.id, { isHidden: !review.isHidden });
    toast({ description: review.isHidden ? 'Review visible' : 'Review hidden', duration: 3000 });

    const productReviews = await base44.entities.Review.filter({ productId: review.productId });
    const visible = productReviews.filter(r => r.id === review.id ? review.isHidden : !r.isHidden);
    const avg = visible.length > 0 ? visible.reduce((s, r) => s + r.rating, 0) / visible.length : 0;
    await base44.entities.Product.update(review.productId, {
      averageRating: Math.round(avg * 10) / 10,
      reviewCount: visible.length,
    });

    load();
  }

  async function deleteReview(review) {
    if (!window.confirm('Delete this review permanently?')) return;
    await base44.entities.Review.delete(review.id);

    const productReviews = await base44.entities.Review.filter({ productId: review.productId });
    const remaining = productReviews.filter(r => r.id !== review.id && !r.isHidden);
    const avg = remaining.length > 0 ? remaining.reduce((s, r) => s + r.rating, 0) / remaining.length : 0;
    await base44.entities.Product.update(review.productId, {
      averageRating: Math.round(avg * 10) / 10,
      reviewCount: remaining.length,
    });

    toast({ description: 'Review deleted', duration: 3000 });
    load();
  }

  async function submitReply() {
    if (!replyText.trim()) return;
    await base44.entities.Review.update(replyingTo, { adminReply: replyText });
    toast({ description: 'Reply added', duration: 3000 });
    setReplyingTo(null);
    setReplyText('');
    load();
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array(3).fill(0).map((dummy, i) => (
          <div key={i} className="animate-pulse border border-border p-4">
            <div className="h-3 bg-secondary w-1/3 mb-2" />
            <div className="h-3 bg-secondary w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16 border border-border">
        <p className="text-sm text-muted-foreground tracking-wide">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map(review => (
        <div key={review.id} className={`border border-border p-4 ${review.isHidden ? 'opacity-50' : ''}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-sm font-medium tracking-wide">{review.reviewerName}</p>
                <div className="flex gap-0.5">
                  {Array(5).fill(0).map((dummy, i) => (
                    <Star key={i} size={12} className={i < review.rating ? 'fill-foreground text-foreground' : 'text-border'} />
                  ))}
                </div>
                {review.isHidden && (
                  <span className="text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 bg-secondary text-muted-foreground">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
              <p className="text-[10px] text-muted-foreground mt-2">
                {new Date(review.createdDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>

              {review.adminReply && (
                <div className="mt-3 ml-4 pl-3 border-l-2 border-border">
                  <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-0.5">Your Reply</p>
                  <p className="text-sm text-muted-foreground">{review.adminReply}</p>
                </div>
              )}
            </div>

            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={() => { setReplyingTo(review.id); setReplyText(review.adminReply || ''); }}
                className="p-2 hover:bg-secondary transition-colors"
                title="Reply"
              >
                <MessageSquare size={14} />
              </button>
              <button
                onClick={() => toggleHide(review)}
                className="p-2 hover:bg-secondary transition-colors"
                title={review.isHidden ? 'Show' : 'Hide'}
              >
                {review.isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button
                onClick={() => deleteReview(review)}
                className="p-2 hover:bg-destructive/10 text-destructive transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {replyingTo === review.id && (
            <div className="mt-4 pt-4 border-t border-border">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                rows={2}
                placeholder="Write your reply..."
                className="w-full border border-border bg-transparent px-3 py-2.5 text-sm outline-none focus:border-foreground transition-colors resize-none mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setReplyingTo(null)}
                  className="px-4 py-2 text-xs tracking-[0.15em] uppercase border border-border hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReply}
                  className="px-4 py-2 text-xs tracking-[0.15em] uppercase bg-foreground text-background hover:opacity-90 transition-opacity"
                >
                  {review.adminReply ? 'Update Reply' : 'Add Reply'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}