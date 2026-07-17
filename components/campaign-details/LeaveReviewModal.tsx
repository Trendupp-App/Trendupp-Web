'use client';

import { useState } from 'react';
import { X, Star, Loader2 } from 'lucide-react';
import UserAvatar from '@/shared/UserAvatar';
import { cn } from '@/lib/utils';
import { Portal } from '@/components/ui/portal';

interface LeaveReviewModalProps {
  creatorName: string;
  creatorUsername: string;
  creatorAvatarUrl?: string | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export default function LeaveReviewModal({
  creatorName,
  creatorUsername,
  creatorAvatarUrl,
  isSubmitting = false,
  onClose,
  onSubmit,
}: LeaveReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const initials = creatorName.slice(0, 2).toUpperCase();

  function handleSubmit() {
    if (rating === 0 || isSubmitting) return;
    onSubmit(rating, comment.trim());
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
        <div className="bg-white rounded-2xl w-full max-w-[480px] p-6 shadow-2xl flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-[#1a1a2e]">Leave a review</h3>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-[#9a99b0] hover:text-[#1a1a2e] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={18} />
            </button>
          </div>

          {/* Creator */}
          <div className="flex items-center gap-3">
            <UserAvatar size={44} avatarUrl={creatorAvatarUrl} initials={initials} />
            <div>
              <p className="text-sm font-semibold text-[#1a1a2e]">{creatorName}</p>
              <p className="text-xs text-[#9a99b0]">@{creatorUsername}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#1a1a2e]">Your rating:</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={isSubmitting}
                  className="cursor-pointer disabled:cursor-not-allowed"
                >
                  <Star
                    size={26}
                    className={cn(
                      'transition-colors',
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-zinc-300',
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1a1a2e]">Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              placeholder="How was working with this creator? Quality, professionalism, communication"
              className="w-full border border-[#e8e6f0] rounded-lg px-4 py-3 text-sm text-[#1a1a2e] resize-none focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink placeholder:text-[#c4c2d4] disabled:bg-[#faf9fc] disabled:cursor-not-allowed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl text-sm font-light border border-[#e8e6f0] text-[#1a1a2e] hover:bg-[#faf9fc] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className={cn(
                'flex-1 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2',
                rating === 0 || isSubmitting
                  ? 'bg-brand-pink/50 text-white/80 cursor-not-allowed'
                  : 'bg-brand-pink text-white hover:bg-brand-pink/90 cursor-pointer',
              )}
            >
              {isSubmitting && <Loader2 size={15} className="animate-spin" />}
              {isSubmitting ? 'Submitting…' : 'Submit review'}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
