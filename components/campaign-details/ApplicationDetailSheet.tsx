'use client';

import { Star, ArrowRight, ArrowUpRight, BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { CampaignApplication } from '@/types/application';

function fmt(n: number) {
  return `₦${n.toLocaleString('en-NG')}`;
}

interface ApplicationDetailSheetProps {
  application: CampaignApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: (application: CampaignApplication) => void;
  onReject: (application: CampaignApplication) => void;
  onViewProfile?: (application: CampaignApplication) => void;
  onReply?: (application: CampaignApplication) => void;
}

export default function ApplicationDetailSheet({
  application,
  open,
  onOpenChange,
  onAccept,
  onReject,
  onViewProfile,
  onReply,
}: ApplicationDetailSheetProps) {
  if (!application) return null;
  const { creator } = application;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[520px] p-0 overflow-y-auto">
        <SheetHeader className="sr-only">
          <SheetTitle>{creator.name}&apos;s application</SheetTitle>
        </SheetHeader>

        {/* Creator header card */}
        <div className="bg-[#1a1a4d] px-6 py-5 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-brand-pink shrink-0">
            <Image src={creator.avatarUrl} alt={creator.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold text-white truncate">{creator.name}</p>
              <span className="flex items-center gap-0.5 text-xs text-amber-400 shrink-0">
                <Star size={12} fill="currentColor" />
                {creator.rating}
              </span>
            </div>
            <p className="text-sm text-white/60">{creator.handle}</p>
            <p className="text-sm text-white/60">{creator.location}</p>
          </div>
          {creator.badge && (
            <span className="flex items-center gap-1 text-xs font-medium text-brand-pink bg-white px-3 py-1.5 rounded-full shrink-0">
              <BadgeCheck size={13} />
              {creator.badge}
            </span>
          )}
        </div>

        {onViewProfile && (
          <div className="px-6 pt-3">
            <button
              onClick={() => onViewProfile(application)}
              className="flex items-center gap-1 text-xs font-medium text-[#1a1a4d] hover:text-brand-pink transition-colors ml-auto"
            >
              View profile
              <ArrowRight size={12} />
            </button>
          </div>
        )}

        <div className="px-6 py-5 flex flex-col gap-6">
          {/* Application details */}
          <div className="border border-[#e8e6f0] rounded-xl p-5 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-[#1a1a2e]">Application Details</h3>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#9a99b0]">Fee request</span>
              <span className="text-sm font-semibold text-brand-pink">
                {fmt(application.feeRequest)}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-[#9a99b0]">Content Idea</span>
              <p className="text-sm text-[#1a1a2e] leading-relaxed">
                &quot;{application.contentIdea}&quot;
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#9a99b0]">Platforms</span>
              <span className="text-sm text-[#1a1a2e]">{application.platforms.join(', ')}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#9a99b0]">Past work</span>

              <a
                href={application.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-brand-pink hover:underline"
              >
                View Portfolio
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

          {/* Comment */}
          {application.comment && (
            <div className="border border-[#e8e6f0] rounded-xl p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1a1a2e]">Question/comment</h3>
                {onReply && (
                  <button
                    onClick={() => onReply(application)}
                    className="text-xs font-medium text-brand-pink hover:underline"
                  >
                    Reply
                  </button>
                )}
              </div>
              <p className="text-sm text-[#4a4a6a] leading-relaxed">{application.comment}</p>
            </div>
          )}

          {/* Actions */}
          {application.status === 'applied' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onAccept(application)}
                className="flex-1 cursor-pointer  flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => onReject(application)}
                className="flex-1 cursor-pointer  flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
