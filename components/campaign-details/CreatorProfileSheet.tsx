'use client';

import { useState } from 'react';
import { X, Star, Award, Image as ImageIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCreatorProfile } from '@/hooks/useProfile';
import CreatorProfileSkeleton from '@/components/skeletons/CreatorProfileSkeleton';
import EmptyState from '@/shared/EmptyState';
import UserAvatar from '@/shared/UserAvatar';
import { cn } from '@/lib/utils';
import { PLATFORMS } from '@/shared/Socials';
interface CreatorProfileSheetProps {
  creatorId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getPlatformMeta(key: string) {
  return PLATFORMS.find((p) => p.connectedKey === key);
}

export default function CreatorProfileSheet({
  creatorId,
  open,
  onOpenChange,
}: CreatorProfileSheetProps) {
  const [tab, setTab] = useState<'portfolio' | 'reviews'>('portfolio');
  const { data: profile, isLoading, isError } = useCreatorProfile(open ? creatorId : null);

  const initials = profile
    ? `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase()
    : 'U';

  const location = [profile?.city, profile?.state?.name, profile?.country?.name]
    .filter(Boolean)
    .join(', ');

  const platformEntries = profile ? Object.entries(profile.platforms ?? {}) : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[520px] overflow-y-auto p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>
            {profile ? `${profile.firstName} ${profile.lastName}` : 'Creator profile'}
          </SheetTitle>
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
            <div className="bg-[#1a1a4d] px-4 py-6 flex items-center gap-4 relative">
              <UserAvatar size={64} avatarUrl={profile.avatarUrl} initials={initials} />
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-white truncate">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="text-sm text-[#9a99b0]">@{profile.username}</p>
                {location && <p className="text-sm text-[#9a99b0]">{location}</p>}
              </div>
              {profile.assignedTier && (
                <span className="flex items-center mt-10 gap-1 text-xs font-medium text-brand-pink bg-white px-3 py-1.5 rounded-full shrink-0">
                  <Award size={13} />
                  {profile.assignedTier}
                </span>
              )}
            </div>

            {/* Stats strip */}
            <div className="px-4 py-4">
              <div className="border border-[#e8e6f0] rounded-2xl p-4 grid grid-cols-3 sm:grid-cols-3 gap-2 text-center">
                <div className="flex items-center gap-2 border-r-[1px] border-slate-200">
                  <span className="text-xs font-bold text-[#1a1a2e]">Rating</span>
                  <span className="text-[10px]  flex items-center justify-center gap-1">
                    {profile.avgRating ?? '—'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1a1a2e]">Reviews</span>
                  <span className="text-[10px]  flex items-center justify-center gap-1">
                    {profile.totalReviews}
                  </span>
                </div>
                <div className="flex items-center gap-2 border-l-[1px] border-slate-200 pl-2">
                  <span className="text-xs font-bold text-[#1a1a2e]">Tier</span>
                  <span className="text-[10px]  flex items-center justify-center gap-1">
                    {profile.assignedTier ?? '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-4">
              <div className="bg-[#f4f3f6] rounded-full p-1 flex items-center gap-1 w-full">
                <button
                  onClick={() => setTab('portfolio')}
                  className={cn(
                    'flex-1 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer',
                    tab === 'portfolio' ? 'bg-white text-brand-pink shadow-sm' : 'text-[#7a7a9a]',
                  )}
                >
                  Portfolio
                </button>
                <button
                  onClick={() => setTab('reviews')}
                  className={cn(
                    'flex-1 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer',
                    tab === 'reviews' ? 'bg-white text-brand-pink shadow-sm' : 'text-[#7a7a9a]',
                  )}
                >
                  Reviews
                </button>
              </div>
            </div>

            <div className="px-4 py-5 flex flex-col gap-5">
              {tab === 'portfolio' ? (
                <>
                  {/* Bio */}
                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-bold text-[#1a1a2e]">Bio</h4>
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

                  {/* Niches */}
                  <div className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                      Creator Niche
                    </span>
                    {profile.niches.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {profile.niches.map((n) => (
                          <span
                            key={n.id}
                            className="bg-[#f3f0ff] text-[#7c3aed] font-bold text-[10px] px-3 py-1 rounded-full border border-[#7c3aed]/10"
                          >
                            {n.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#9a99b0] italic">No niches selected yet</p>
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
                              className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-3"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-[#f4f3f6] flex items-center justify-center text-[#1a1a2e] shrink-0">
                                  {meta?.icon}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-[#1a1a2e]">
                                    {meta?.name ?? key}
                                  </p>
                                  <p className="text-[10px] text-[#7a7a9a]">@{data.username}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="bg-[#faf9fc] rounded-lg p-2 flex flex-col gap-0.5">
                                  <span className="text-[9px] text-[#9a99b0]">Followers</span>
                                  <span className="text-xs font-bold text-[#1a1a2e]">
                                    {data.followers ?? '—'}
                                  </span>
                                </div>
                                <div className="bg-[#faf9fc] rounded-lg p-2 flex flex-col gap-0.5">
                                  <span className="text-[9px] text-[#9a99b0]">Total likes</span>
                                  <span className="text-xs font-bold text-[#1a1a2e]">
                                    {data.totalLikes ?? '—'}
                                  </span>
                                </div>
                                <div className="bg-[#faf9fc] rounded-lg p-2 flex flex-col gap-0.5">
                                  <span className="text-[9px] text-[#9a99b0]">Total views</span>
                                  <span className="text-xs font-bold text-[#1a1a2e]">
                                    {data.totalViews ?? '—'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="border border-[#e8e6f0] rounded-2xl">
                        <EmptyState
                          title="No platforms connected"
                          description="This creator hasn't linked any social accounts yet."
                        />
                      </div>
                    )}
                  </div>

                  {/* Portfolio grid */}
                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-bold text-[#1a1a2e]">Portfolio</h4>
                    {profile.portfolio && profile.portfolio.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {profile.portfolio.map((item) => (
                          <div
                            key={item.id}
                            className="aspect-square rounded-xl overflow-hidden bg-zinc-100"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.imageUrl}
                              alt={item.brandName ?? 'Portfolio item'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-[#e8e6f0] rounded-2xl">
                        <EmptyState
                          icon={ImageIcon}
                          title="No portfolio items yet"
                          description="This creator hasn't uploaded any past work."
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Reviews tab
                <div className="flex flex-col gap-4">
                  {profile.totalReviews > 0 ? (
                    <>
                      <div className="flex items-center gap-6 border-b border-[#e8e6f0] pb-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-4xl font-black text-[#1a1a2e] leading-none">
                            {profile.avgRating ?? '—'}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={cn(
                                  i < Math.round(profile.avgRating ?? 0)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-zinc-200',
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-[#7a7a9a]">
                            {profile.totalReviews} reviews
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        {profile.reviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="border border-[#e8e6f0] rounded-2xl p-4 flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#1a1a2e]">
                                {rev.brandName}
                              </span>
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={11}
                                    className={cn(
                                      i < rev.rating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-zinc-200',
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-[10px] text-[#9a99b0]">{rev.date}</span>
                            <p className="text-xs text-[#5a5a7a] leading-relaxed">{rev.text}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="border border-[#e8e6f0] rounded-2xl">
                      <EmptyState
                        icon={Star}
                        title="No reviews yet"
                        description="This creator hasn't received any brand reviews yet."
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
