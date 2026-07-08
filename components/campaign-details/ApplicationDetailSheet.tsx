'use client';

import { CircleCheck, CircleX, ArrowUpRight, XCircle, UserRound } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { CampaignApplicationDto } from '@/types/campaign';
import UserAvatar from '@/shared/UserAvatar';
import { useApplication } from '@/hooks/useCampaign';
import ApplicationDetailSkeleton from '@/components/skeletons/ApplicationDetailSkeleton';

function fmt(n: number) {
  return `₦${n.toLocaleString('en-NG')}`;
}

interface ApplicationDetailSheetProps {
  applicationId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: (application: CampaignApplicationDto) => void;
  onReject: (application: CampaignApplicationDto) => void;
  onViewProfile: (application: CampaignApplicationDto) => void;
}

export default function ApplicationDetailSheet({
  applicationId,
  open,
  onOpenChange,
  onAccept,
  onReject,
  onViewProfile,
}: ApplicationDetailSheetProps) {
  const { data: application, isLoading, isError } = useApplication(open ? applicationId : null);

  const initials = application?.creator
    ? `${application.creator.firstName?.[0] ?? ''}${application.creator.lastName?.[0] ?? ''}`.toUpperCase()
    : 'U';
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[520px] overflow-y-auto">
        <SheetHeader className="sr-only">
          <SheetTitle>
            {`${application?.creator?.firstName ?? ''} ${application?.creator?.lastName ?? ''}`.trim() ||
              ''}
          </SheetTitle>
        </SheetHeader>

        {isLoading && <ApplicationDetailSkeleton />}

        {!isLoading && isError && (
          <div className="px-6 py-10 flex flex-col items-center text-center gap-2">
            <p className="text-sm text-[#4a4a6a]">
              Couldn&apos;t load this application. Please try again.
            </p>
          </div>
        )}

        {!isLoading && !isError && application && (
          <>
            {/* Creator header card */}
            <div className="bg-[#1a1a4d] px-4 py-5 flex items-center gap-4">
              <UserAvatar
                size={42}
                avatarUrl={application.creator?.avatarUrl}
                initials={initials}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold text-white truncate">
                    {`${application.creator?.firstName ?? ''} ${application.creator?.lastName ?? ''}`.trim()}
                  </p>
                </div>
                <button
                  onClick={() => onViewProfile(application)}
                  className="flex items-center gap-1 text-xs font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  <UserRound size={13} />
                  View profile
                </button>
              </div>
            </div>
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
                  <span className="text-sm text-[#1a1a2e]">
                    {[application.primaryPlatform?.name, application.secondaryPlatform?.name]
                      .filter(Boolean)
                      .join(', ') || '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#9a99b0]">Past work</span>

                  <a
                    href={application.pastWorkLink || 'www.mywork.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-brand-pink hover:underline"
                  >
                    View Portfolio
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>

              {/* Comment + reply flow */}
              {application.comments && (
                <div className="border border-[#e8e6f0] rounded-xl p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#1a1a2e]">Question/comment</h3>
                  </div>
                  <p className="text-sm text-[#4a4a6a] leading-relaxed">{application.comments}</p>
                </div>
              )}

              {/* Actions */}
              {application.status === 'pending' && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onAccept(application)}
                    className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-colors"
                  >
                    <CircleCheck className="size-4" />
                    <p>Accept</p>
                  </button>
                  <button
                    onClick={() => onReject(application)}
                    className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors"
                  >
                    <CircleX className="size-4" />
                    <p>Reject</p>
                  </button>
                </div>
              )}

              {application.status === 'rejected' && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-red-50 border border-red-100">
                    <XCircle size={16} className="text-red-500 shrink-0" />
                    <span className="text-sm font-medium text-red-500">
                      This application has been rejected
                    </span>
                  </div>
                  <button
                    onClick={() => onAccept(application)}
                    className="w-full cursor-pointer flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-colors"
                  >
                    Accept anyway
                  </button>
                </div>
              )}

              {application.status === 'accepted' && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onReject(application)}
                    className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors"
                  >
                    <CircleX className="size-4" />
                    <p>Reject</p>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
