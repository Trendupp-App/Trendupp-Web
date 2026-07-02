'use client';

import Link from 'next/link';
import BrandCampaignCard from './BrandCampaignCard';

type CampaignStatus = 'live' | 'content_review' | 'revision' | 'completed' | 'draft';
type CreatorTier = 'Nano' | 'Micro' | 'Macro' | 'Mega';

interface Campaign {
  id: string;
  title: string;
  category: string;
  budget: number;
  status: CampaignStatus;
  timeLeft: string;
  tier: CreatorTier;
  imageSrc?: string;
  applicantsCount?: number;
}

const ACTIVE_CAMPAIGNS: Campaign[] = [
  {
    id: 'act-1',
    title: 'Lagos Tech Week Coverage',
    category: 'Technology',
    budget: 150000,
    status: 'content_review',
    timeLeft: '31 hours left',
    tier: 'Micro',
    imageSrc: '/dashboard/img1.jpg',
  },
  {
    id: 'act-2',
    title: 'Lagos Tech Week Coverage',
    category: 'Technology',
    budget: 150000,
    status: 'revision',
    timeLeft: '31 hours left',
    tier: 'Micro',
    imageSrc: '/dashboard/img1.jpg',
  },
  {
    id: 'act-3',
    title: 'Lagos Tech Week Coverage',
    category: 'Technology',
    budget: 150000,
    status: 'content_review',
    timeLeft: '31 hours left',
    tier: 'Micro',
    imageSrc: '/dashboard/img1.jpg',
  },
];

const LIVE_CAMPAIGNS: Campaign[] = [
  {
    id: 'live-1',
    title: 'Summer Style Collection',
    category: 'Technology',
    budget: 150000,
    status: 'live',
    timeLeft: '4 days left',
    tier: 'Micro',
    applicantsCount: 47,
    imageSrc: '/dashboard/img1.jpg',
  },
  {
    id: 'live-2',
    title: 'Lagos Tech Week Coverage',
    category: 'Technology',
    budget: 150000,
    status: 'live',
    timeLeft: '4 days left',
    tier: 'Micro',
    applicantsCount: 47,
    imageSrc: '/dashboard/img1.jpg',
  },
  {
    id: 'live-3',
    title: 'Lagos Tech Week Coverage',
    category: 'Technology',
    budget: 150000,
    status: 'live',
    timeLeft: '4 days left',
    tier: 'Micro',
    applicantsCount: 47,
    imageSrc: '/dashboard/img1.jpg',
  },
];

interface CampaignSectionProps {
  campaigns: Campaign[];
  title: string;
  subtitle: string;
  seeAllHref: string;
}

function CampaignSection({ campaigns, title, subtitle, seeAllHref }: CampaignSectionProps) {
  return (
    <section>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-[#1a1a2e]">{title}</h2>
          <p className="text-sm text-[#9a99b0] mt-0.5">{subtitle}</p>
        </div>
        <Link
          href={seeAllHref}
          className="text-sm text-[#9a99b0] hover:text-brand-pink transition-colors shrink-0 mt-1"
        >
          See all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((c) => (
          <BrandCampaignCard key={c.id} {...c} />
        ))}
      </div>
    </section>
  );
}

interface BrandCampaignSectionsProps {
  activeCampaigns?: Campaign[];
  liveCampaigns?: Campaign[];
  isProfileComplete?: boolean;
}

export default function BrandCampaignSections({
  activeCampaigns = ACTIVE_CAMPAIGNS,
  liveCampaigns = LIVE_CAMPAIGNS,
  isProfileComplete = true,
}: BrandCampaignSectionsProps) {
  return (
    <>
      {/* Active campaigns — only shown when profile complete */}
      {isProfileComplete && activeCampaigns.length > 0 && (
        <CampaignSection
          campaigns={activeCampaigns}
          title="Active campaigns"
          subtitle="Creators selected • Content being created"
          seeAllHref="/brand/campaigns?status=active"
        />
      )}

      {/* Live campaigns */}
      <section>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a2e]">Live Campaigns</h2>
            <p className="text-sm text-[#9a99b0] mt-0.5">
              Published and currently accepting creator applications
            </p>
          </div>
          <a
            href="/brand/campaigns?status=live"
            className="text-sm text-[#9a99b0] hover:text-brand-pink transition-colors shrink-0 mt-1"
          >
            See all
          </a>
        </div>

        {!isProfileComplete ? (
          /* Locked state */
          <div className="w-full border border-dashed border-[#e0ddef] rounded-2xl flex flex-col items-center justify-center py-16 gap-3 bg-white/60">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c4c2d4"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="text-sm text-[#9a99b0]">
              Complete your brand profile first to unlock campaigns.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveCampaigns.map((c) => (
              <BrandCampaignCard key={c.id} {...c} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
