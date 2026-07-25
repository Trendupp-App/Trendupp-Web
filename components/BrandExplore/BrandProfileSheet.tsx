'use client';

import { Globe, Megaphone } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useBrandProfile } from '@/hooks/useProfile';
import CreatorProfileSkeleton from '@/components/skeletons/CreatorProfileSkeleton';
import EmptyState from '@/shared/EmptyState';
import UserAvatar from '@/shared/UserAvatar';
import { PLATFORMS } from '@/shared/Socials';
import { formatCurrency } from '@/utils/Utilities';

interface BrandProfileSheetProps {
  brandId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getPlatformMeta(key: string) {
  return PLATFORMS.find((p) => p.connectedKey === key);
}

const LIVE_STATUSES = new Set(['live', 'active']);

export default function BrandProfileSheet({ brandId, open, onOpenChange }: BrandProfileSheetProps) {
  const { data: profile, isLoading, isError } = useBrandProfile(open ? brandId : null);

  const displayName =
    profile?.username || `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim() || 'Brand';
  const initials = displayName.slice(0, 2).toUpperCase();

  const location = [profile?.city, profile?.state?.name, profile?.country?.name]
    .filter(Boolean)
    .join(', ');

  const platformEntries = profile ? Object.entries(profile.platforms ?? {}) : [];

  const liveCampaigns = profile ? profile.campaigns.filter((c) => LIVE_STATUSES.has(c.status)) : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[520px] overflow-y-auto p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>{displayName}</SheetTitle>
        </SheetHeader>

        {isLoading && <CreatorProfileSkeleton />}

        {!isLoading && isError && (
          <div className="px-6 py-10 flex flex-col items-center text-center gap-2">
            <p className="text-sm text-[#4a4a6a]">
              Couldn&apos;t load this profile. Please try again.
            </p>
          </div>
        )}

        {!isLoading && !isError && profile && (
          <>
            {/* Header card */}
            <div className="bg-[#1a1a4d] px-4 py-6 flex items-center gap-4">
              <UserAvatar size={64} avatarUrl={profile.avatarUrl} initials={initials} />
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-white truncate">{displayName}</p>
                {location && <p className="text-sm text-[#9a99b0]">{location}</p>}
                {profile.websiteUrl && (
                  <a
                    href={profile.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-[#9a99b0] hover:text-white transition-colors mt-0.5 w-fit"
                  >
                    <Globe size={12} />
                    {profile.websiteUrl.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            </div>

            {/* Stats strip */}
            <div className="px-4 py-4">
              <div className="border border-[#e8e6f0] rounded-2xl p-4 grid grid-cols-2 gap-2 text-center">
                <div className="flex items-center justify-center gap-2 border-r border-slate-200">
                  <span className="text-xs font-bold text-[#1a1a2e]">Live campaigns</span>
                  <span className="text-[10px]">{liveCampaigns.length}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-bold text-[#1a1a2e]">Total campaigns</span>
                  <span className="text-[10px]">{profile.campaigns.length}</span>
                </div>
              </div>
            </div>

            <div className="px-4 py-2 flex flex-col gap-5">
              {/* Bio */}
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-bold text-[#1a1a2e]">About</h4>
                {profile.bio ? (
                  <div className="border border-[#e8e6f0] rounded-2xl p-4">
                    <p className="text-xs text-[#4a4a6a] leading-relaxed">{profile.bio}</p>
                  </div>
                ) : (
                  <div className="border border-[#e8e6f0] rounded-2xl">
                    <EmptyState title="No bio added yet" />
                  </div>
                )}
              </div>

              {/* Industries */}
              <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                  Industries
                </span>
                {profile.industries.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.industries.map((ind) => (
                      <span
                        key={ind.id}
                        className="bg-[#f3f0ff] text-[#7c3aed] font-bold text-[10px] px-3 py-1 rounded-full border border-[#7c3aed]/10"
                      >
                        {ind.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#9a99b0] italic">No industries selected yet</p>
                )}
              </div>

              {/* Platforms */}
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-bold text-[#1a1a2e]">Platforms</h4>
                {platformEntries.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {platformEntries.map(([key, data]) => {
                      const meta = getPlatformMeta(key);
                      return (
                        <div
                          key={key}
                          className="border border-[#e8e6f0] rounded-2xl p-4 flex items-center gap-3"
                        >
                          <div className="w-9 h-9 rounded-xl bg-[#f4f3f6] flex items-center justify-center text-[#1a1a2e] shrink-0">
                            {meta?.icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#1a1a2e]">{meta?.name ?? key}</p>
                            <p className="text-[10px] text-[#7a7a9a]">
                              @{data.username} · {data.followers ?? 0} followers
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="border border-[#e8e6f0] rounded-2xl">
                    <EmptyState
                      title="No platforms connected"
                      description="This brand hasn't linked any social accounts yet."
                    />
                  </div>
                )}
              </div>

              {/* Live campaigns */}
              <div className="flex flex-col gap-2 pb-6">
                <h4 className="text-sm font-bold text-[#1a1a2e]">Live campaigns</h4>
                {liveCampaigns.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {liveCampaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="border border-[#e8e6f0] rounded-2xl overflow-hidden flex items-center gap-3 p-3"
                      >
                        <div className="w-14 h-14 rounded-xl bg-zinc-100 shrink-0 overflow-hidden">
                          {campaign.coverImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={campaign.coverImage}
                              alt={campaign.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Megaphone size={18} className="text-[#9a99b0]" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#1a1a2e] truncate">
                            {campaign.title}
                          </p>
                          <p className="text-[10px] text-[#7a7a9a] mt-0.5">{campaign.goal}</p>
                          <p className="text-[10px] font-semibold text-brand-pink mt-0.5">
                            {formatCurrency(campaign.totalBudget, campaign.currency ?? 'NGN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-[#e8e6f0] rounded-2xl">
                    <EmptyState
                      icon={Megaphone}
                      title="No live campaigns"
                      description="This brand doesn't have any campaigns live right now."
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
