'use client';

import { Info, ExternalLink, CheckCircle2, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import type { Campaign } from '@/types/campaign';
import { DUMMY_SUBMISSIONS } from '@/dummy/submissions';
import { cn } from '@/lib/utils';
function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

const BANNER_COPY: Record<string, string> = {
  in_progress:
    'Brands have 48 hours to review submitted content. Countdown starts when a creator drops their submission.',
  content_review:
    'Brands have 48 hours to review submitted content. Countdown starts when a creator drops their submission.',
  revision:
    "Creators are reworking their content based on your feedback. You'll be notified when they re-submit. Only 1 revision is permitted.",
  live_content: 'Content is live. You can view the post below.',
};

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  in_progress: { label: 'Awaiting review', cls: 'text-[#7a7a9a] border-[#e8e6f0]' },
  awaiting_review: { label: 'Awaiting review', cls: 'text-[#7a7a9a] border-[#e8e6f0]' },
  revision_requested: { label: 'Revision requested', cls: 'text-amber-600 border-amber-200' },
  live: { label: 'Live', cls: 'text-emerald-600 border-emerald-200' },
};

interface CampaignDeliverablesTabProps {
  campaign: Campaign;
}

export default function CampaignDeliverablesTab({ campaign }: CampaignDeliverablesTabProps) {
  const subStatus = campaign.subStatus ?? 'in_progress';
  const submissions = DUMMY_SUBMISSIONS[campaign.id] ?? [];
  const bannerText = BANNER_COPY[subStatus] ?? BANNER_COPY.in_progress;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3 bg-[#fff5f9] rounded-lg px-4 py-3.5">
        <Info size={16} className="text-brand-pink shrink-0 mt-0.5" />
        <p className="text-sm text-[#4a4a6a] leading-relaxed">{bannerText}</p>
      </div>

      {submissions.length === 0 ? (
        <div className="border border-[#e8e6f0] rounded-xl p-8 text-center text-sm text-[#9a99b0]">
          No submissions yet.
        </div>
      ) : (
        submissions.map((sub) => {
          const badge = STATUS_BADGE[sub.status] ?? STATUS_BADGE.awaiting_review;
          return (
            <div
              key={sub.id}
              className="border border-[#e8e6f0] rounded-xl p-5 flex flex-col gap-4"
            >
              {/* Creator row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={sub.creator.avatarUrl}
                      alt={sub.creator.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-[#1a1a2e]">{sub.creator.name}</p>
                      {sub.creator.rating && (
                        <span className="text-xs text-amber-500">★ {sub.creator.rating}</span>
                      )}
                    </div>
                    <p className="text-xs text-[#9a99b0]">
                      {sub.platform} · Submitted {timeAgo(sub.submittedAt)}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    'text-xs font-medium px-3 py-1 rounded-full border shrink-0',
                    badge.cls,
                  )}
                >
                  {badge.label}
                </span>
              </div>

              {/* Content link / placeholder */}
              {sub.status === 'in_progress' && !sub.contentLink ? (
                <div className="bg-[#fffbf0] border border-amber-200 rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-amber-700 mb-1">CONTENT LINK</p>
                  <p className="text-sm text-[#4a4a6a]">
                    The creator is currently working on your campaign. You&apos;ll be notified once
                    it&apos;s completed.
                  </p>
                </div>
              ) : (
                sub.contentLink && (
                  <div className="border border-[#e8e6f0] rounded-lg px-4 py-3">
                    <p className="text-xs font-semibold text-[#9a99b0] mb-1">CONTENT LINK</p>

                    <a
                      href={sub.contentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm font-medium text-[#1a1a2e] hover:text-brand-pink"
                    >
                      {sub.contentLink}
                      <ExternalLink size={13} />
                    </a>
                    {sub.caption && (
                      <p className="text-sm text-[#9a99b0] mt-1">&quot;{sub.caption}&quot;</p>
                    )}
                  </div>
                )
              )}

              {/* Revision feedback box */}
              {sub.status === 'revision_requested' && sub.revisionFeedback && (
                <div className="bg-[#fffbf0] border border-amber-200 rounded-lg px-4 py-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 mb-1">
                    <Info size={12} />
                    REVISION REQUEST
                  </p>
                  <p className="text-sm text-[#4a4a6a] leading-relaxed">{sub.revisionFeedback}</p>
                </div>
              )}

              {/* Approve / Request revision actions */}
              {sub.status === 'awaiting_review' && (
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => console.log('approve', sub.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-colors"
                  >
                    <CheckCircle2 size={14} />
                    Approve content
                  </button>
                  <button
                    onClick={() => console.log('request revision', sub.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100 transition-colors"
                  >
                    <RotateCcw size={14} />
                    Request revision
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
