// 20/06/2026
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const all = await base44.entities.Review.filter({ product_id: productId });
      setReviews(all.filter(r => !r.is_hidden));
      setLoading(false);
    }
    if (productId) load();
  }, [productId]);

  if (loading) return null;

  if (reviews.length === 0) {
    return (
      <section className="mt-16 md:mt-24 border-t border-border pt-12">
        <h2 className="font-display text-xl tracking-[0.15em] uppercase mb-4">Reviews</h2>
        <p className="text-sm text-muted-foreground tracking-wide">
          No reviews yet. Be the first to share your experience.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-16 md:mt-24 border-t border-border pt-12">
      <h2 className="font-display text-xl tracking-[0.15em] uppercase mb-8">
        Reviews ({reviews.length})
      </h2>
      <div className="space-y-8">
        {reviews.map(review => (
          <div key={review.id} className="border-b border-border/50 pb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-xs font-medium uppercase">
                {review.reviewer_name?.[0] || '?'}
              </div>
              <div>
                <p className="text-sm font-medium tracking-wide">{review.reviewer_name}</p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {Array(5).fill(0).map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      className={i < review.rating ? 'fill-foreground text-foreground' : 'text-border'}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
            {review.admin_reply && (
              <div className="mt-4 ml-8 pl-4 border-l-2 border-border">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Mythic Store</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.admin_reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}