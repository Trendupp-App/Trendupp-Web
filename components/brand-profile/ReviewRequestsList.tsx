'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import LeaveReviewModal from './LeaveReviewModal';

interface ReviewRequest {
  id: string;
  creator: { name: string; handle: string; avatarUrl: string; tier: string };
  message: string;
}

const DUMMY_REVIEW_REQUESTS: ReviewRequest[] = [
  {
    id: 'rr-1',
    creator: {
      name: 'Adaeze Obi',
      handle: '@adaeze_creates',
      avatarUrl: '/dummy/avatars/adaeze.jpg',
      tier: 'Micro',
    },
    message:
      'Please, I would really appreciate it if you could leave me a review; it would help me a lot.',
  },
  {
    id: 'rr-2',
    creator: {
      name: 'Adaeze Obi',
      handle: '@adaeze_creates',
      avatarUrl: '/dummy/avatars/adaeze.jpg',
      tier: 'Micro',
    },
    message:
      'Please, I would really appreciate it if you could leave me a review; it would help me a lot.',
  },
];

export default function ReviewRequestsList() {
  const [selectedCreator, setSelectedCreator] = useState<ReviewRequest['creator'] | null>(null);

  function handleSubmitReview(rating: number, review: string) {
    // TODO: wire to review submission API when available
    console.log('Review submitted:', { rating, review });
    setSelectedCreator(null);
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {DUMMY_REVIEW_REQUESTS.map((req) => (
          <div
            key={req.id}
            className="flex items-start gap-3 border border-[#e8e6f0] rounded-xl px-5 py-4 bg-white"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#f0eef8] shrink-0">
              <Image
                src={req.creator.avatarUrl}
                alt={req.creator.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-[#1a1a2e]">{req.creator.name}</p>
                <span className="text-xs text-[#9a99b0]">{req.creator.handle}</span>
                <span className="text-[10px] font-medium text-[#7c6fe0] bg-[#ede9fb] px-2 py-0.5 rounded-full">
                  {req.creator.tier}
                </span>
              </div>
              <p className="text-sm text-[#4a4a6a] mt-1">{req.message}</p>
            </div>
            <button
              onClick={() => setSelectedCreator(req.creator)}
              className="flex items-center gap-1.5 text-xs font-medium text-amber-500 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors shrink-0"
            >
              <Star size={12} />
              Leave a review
            </button>
          </div>
        ))}
      </div>

      {selectedCreator && (
        <LeaveReviewModal
          creator={selectedCreator}
          onClose={() => setSelectedCreator(null)}
          onSubmit={handleSubmitReview}
        />
      )}
    </>
  );
}
