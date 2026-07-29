'use client';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useCampaign, useParticipateSocialImpact } from '@/hooks/useCampaign';
import { Check, ExternalLink, Ticket, X, Clock, Megaphone } from 'lucide-react';
import { formatTimeRemaining, getActiveDeadline } from '@/lib/campaignTimelineStage';
import type { CampaignApplicationDto } from '@/types/campaign';

interface SocialImpactDetailSheetProps {
  campaignId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onParticipated: (application?: CampaignApplicationDto) => void;
  hideParticipateButton?: boolean;
  hasApplied?: boolean;
  showSubmitLiveLink?: boolean;
  hasSubmittedLiveLink?: boolean;
  onOpenSubmitLiveLink?: () => void;
}

export default function SocialImpactDetailSheet({
  campaignId,
  open,
  onOpenChange,
  onParticipated,
  hideParticipateButton = false,
  hasApplied = false,
  showSubmitLiveLink = false,
  hasSubmittedLiveLink = false,
  onOpenSubmitLiveLink,
}: SocialImpactDetailSheetProps) {
  const { data: campaign, isLoading, isError } = useCampaign(campaignId);
  const timeRemaining = campaign ? formatTimeRemaining(getActiveDeadline(campaign.timeline)) : null;
  const participate = useParticipateSocialImpact((application) => {
    onOpenChange(false);
    onParticipated(application);
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto p-0 [&>button]:hidden"
      >
        {isLoading && (
          <div className="flex flex-col gap-3 p-5">
            <div className="h-56 bg-[#f5f4fa] rounded-2xl animate-pulse" />
            <div className="h-5 w-2/3 bg-[#f5f4fa] rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-[#f5f4fa] rounded animate-pulse" />
          </div>
        )}

        {isError && (
          <p className="text-sm text-[#9a99b0] text-center py-10 px-5">
            Could not load campaign details.
          </p>
        )}

        {campaign && (
          <div className="flex flex-col">
            {/* Cover image — full bleed, overlay close + badges */}
            <div className="relative w-full h-56 bg-[#fef2f6] flex items-center justify-center shrink-0">
              {campaign.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={campaign.coverImage}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Megaphone size={36} className="text-brand-pink" />
              )}

              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
              >
                <X size={16} className="text-[#1a1a2e]" />
              </button>

              {timeRemaining && (campaign.status === 'live' || campaign.status === 'active') && (
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full">
                  <Clock size={10} />
                  {timeRemaining}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-5 p-5">
              {/* Title */}
              <h2 className="text-xl font-bold text-[#1a1a2e] leading-snug">{campaign.title}</h2>

              {/* Meta row — brand */}
              {campaign.brand && (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-brand-pink-light text-brand-pink font-semibold text-xs flex items-center justify-center shrink-0">
                    {campaign.brand.firstName?.[0]}
                    {campaign.brand.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a2e]">
                      {campaign.brand.firstName} {campaign.brand.lastName}
                    </p>
                    <p className="text-xs text-[#9a99b0]">@{campaign.brand.username}</p>
                  </div>
                </div>
              )}

              {/* Intro / brief teaser */}
              {campaign.campaignBrief && (
                <p className="text-sm text-[#4a4a5e] leading-relaxed">{campaign.campaignBrief}</p>
              )}

              {/* At-a-glance box */}
              <div className="border border-[#e8e6f0] rounded-2xl p-4">
                <p className="text-sm font-semibold text-[#1a1a2e] mb-3">Campaign at a glance</p>

                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-pink text-white text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      <Ticket size={12} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1a1a2e]">Token reward</p>
                      <p className="text-xs text-[#9a99b0]">{campaign.tokenReward ?? 0} Tokens</p>
                    </div>
                  </div>

                  {campaign.preferredPlatforms && campaign.preferredPlatforms.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-brand-pink text-white text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                        <Megaphone size={12} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1a1a2e]">Platforms</p>
                        <p className="text-xs text-[#9a99b0]">
                          {campaign.preferredPlatforms.map((p) => p.name).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Deliverables */}
              {campaign.deliverables && campaign.deliverables.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e] mb-2">Deliverables</p>
                  <ul className="flex flex-col gap-1.5">
                    {campaign.deliverables.map((d, i) => (
                      <li key={i} className="text-sm text-[#4a4a5e] flex gap-2">
                        <span className="text-brand-pink">•</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Content direction */}
              {campaign.contentDirection && campaign.contentDirection.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e] mb-2">Content direction</p>
                  <ul className="flex flex-col gap-1.5">
                    {campaign.contentDirection.map((d, i) => (
                      <li key={i} className="text-sm text-[#4a4a5e] flex gap-2">
                        <span className="text-brand-pink">•</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Guidelines */}
              {campaign.contentGuidelines && (
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e] mb-2">Content guidelines</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-emerald-100 bg-emerald-50/50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-emerald-600 mb-1.5">Do&apos;s</p>
                      <ul className="flex flex-col gap-1">
                        {campaign.contentGuidelines.dos.map((d, i) => (
                          <li key={i} className="text-xs text-[#4a4a5e]">
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border border-red-100 bg-red-50/50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-red-500 mb-1.5">Don&apos;ts</p>
                      <ul className="flex flex-col gap-1">
                        {campaign.contentGuidelines.donts.map((d, i) => (
                          <li key={i} className="text-xs text-[#4a4a5e]">
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Usage rights / success criteria */}
              {campaign.usageRights && (
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e] mb-1">Usage rights</p>
                  <p className="text-sm text-[#4a4a5e]">{campaign.usageRights}</p>
                </div>
              )}

              {campaign.successLooksLike && (
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e] mb-1">
                    What success looks like
                  </p>
                  <p className="text-sm text-[#4a4a5e]">{campaign.successLooksLike}</p>
                </div>
              )}

              {showSubmitLiveLink &&
                (hasSubmittedLiveLink ? (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-1.5 bg-[#f4f3f6] text-[#7a7a9a] font-semibold text-sm py-3.5 rounded-xl cursor-not-allowed"
                  >
                    <Check size={15} />
                    Submitted · {campaign.tokenReward ?? 0} tokens earned
                  </button>
                ) : (
                  <button
                    onClick={onOpenSubmitLiveLink}
                    className="w-full flex items-center justify-center gap-1.5 bg-brand-pink text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-brand-pink/90 transition-colors cursor-pointer"
                  >
                    <ExternalLink size={15} />
                    Submit live content
                  </button>
                ))}

              {!hideParticipateButton &&
                (hasApplied ? (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-1.5 bg-[#f4f3f6] text-[#7a7a9a] font-semibold text-sm py-3.5 rounded-xl cursor-not-allowed"
                  >
                    <Check size={15} />
                    Already applied
                  </button>
                ) : (
                  <button
                    onClick={() => participate.mutate(campaign.id)}
                    disabled={participate.isPending}
                    className="w-full bg-brand-pink text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-brand-pink/90 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {participate.isPending ? 'Joining…' : 'Participate'}
                  </button>
                ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
