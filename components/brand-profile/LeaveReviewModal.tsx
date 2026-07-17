'use client';

import { useState } from 'react';
import { X, Star } from 'lucide-react';
import Image from 'next/image';
import { Portal } from '@/components/ui/portal';

interface Creator {
  name: string;
  handle: string;
  avatarUrl: string;
}

interface LeaveReviewModalProps {
  creator: Creator;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
  isSubmitting?: boolean;
}

export default function LeaveReviewModal({
  creator,
  onClose,
  onSubmit,
  isSubmitting = false,
}: LeaveReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState('');

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
        <div className="bg-white rounded-2xl w-full max-w-[480px] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 className="text-base font-bold text-[#1a1a2e]">Leave a review</h2>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f4f3f8] text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-6 pb-6 flex flex-col gap-4">
            {/* Creator info */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#f0eef8] shrink-0">
                <Image src={creator.avatarUrl} alt={creator.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a2e]">{creator.name}</p>
                <p className="text-xs text-[#9a99b0]">{creator.handle}</p>
              </div>
            </div>

            {/* Star rating */}
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-[#1a1a2e]">Your rating:</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHovered(i + 1)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(i + 1)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={24}
                      className={
                        i < (hovered || rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-[#e8e6f0] fill-[#e8e6f0]'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review textarea */}
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-[#1a1a2e]">Review</p>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                placeholder="How was working with this creator? Quality, professionalism, communication"
                className="w-full border border-[#e8e6f0] rounded-xl px-3 py-2.5 text-sm font-light text-[#1a1a2e] resize-none focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink placeholder:text-[#c4c2d4]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#e8e6f0] text-sm font-light text-[#1a1a2e] hover:bg-[#faf9fc] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onSubmit(rating, review)}
                disabled={rating === 0 || isSubmitting}
                className="flex-1 py-3 rounded-xl bg-brand-pink text-white text-sm font-medium hover:bg-brand-pink/90 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting…' : 'Submit review'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
