'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import WorkCampaignCard, { WorkCampaign } from '@/components/dashboard/WorkCampaignCard';
import WorkDetailsDrawer from '@/components/dashboard/WorkDetailsDrawer';

const MOCK_CAMPAIGNS: WorkCampaign[] = [
  // --- ACTIVE CAMPAIGNS (6 items) ---
  {
    id: 1,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'In progress',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'Revision requested',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'In progress',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'In progress',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'In progress',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'In progress',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  },

  // --- APPLIED CAMPAIGNS (6 items) ---
  {
    id: 7,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'Selected',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'Pending',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 9,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'Selected',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 10,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'Selected',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 11,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'Declined',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 12,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'Pending',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  },

  // --- DONE CAMPAIGNS (6 items) ---
  {
    id: 13,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'Payment released',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 14,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'Awaiting payment',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 15,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'Payment released',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 16,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'Payment released',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 17,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'Awaiting payment',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 18,
    title: 'Summer Style Collection',
    brand: 'Zara Africa',
    budgetMinMax: '₦150K–₦300K',
    budgetString: '₦150,000 – 300,000',
    daysLeft: '4d',
    status: 'Awaiting payment',
    platform: 'Instagram',
    tier: 'Micro',
    guidelines:
      'This is a content creation campaign. You will produce original content following the brief guidelines and submit it for brand approval before posting.',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  },
];

type FilterType = 'All' | 'Active' | 'Applied' | 'Done';

export default function MyWorkPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [selectedCampaign, setSelectedCampaign] = useState<WorkCampaign | null>(null);

  // Filter campaigns logic
  const filteredCampaigns = MOCK_CAMPAIGNS.filter((campaign) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Active') {
      return campaign.status === 'In progress' || campaign.status === 'Revision requested';
    }
    if (activeFilter === 'Applied') {
      return (
        campaign.status === 'Selected' ||
        campaign.status === 'Pending' ||
        campaign.status === 'Declined'
      );
    }
    if (activeFilter === 'Done') {
      return campaign.status === 'Payment released' || campaign.status === 'Awaiting payment';
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-bold text-[#1a1a2e]">My work</h1>
        <p className="text-sm font-light text-[#7a7a9a]">
          Track your active campaigns and earnings
        </p>
      </div>

      {/* Sub-Filters Pill Row */}
      <div className="flex items-center gap-2 mt-2 shrink-0">
        <button
          onClick={() => setActiveFilter('All')}
          className={cn(
            'px-4.5 py-2 h-9 text-xs font-medium rounded-full border border-transparent transition-all capitalize focus:outline-none flex items-center justify-center',
            activeFilter === 'All'
              ? 'bg-brand-pink text-white border-brand-pink shadow-[0_2px_8px_rgba(215,23,111,0.15)]'
              : 'bg-white text-[#7a7a9a] border-[#e8e6f0]/70 hover:border-[#d7176f]/30',
          )}
        >
          All
        </button>

        {(['Active', 'Applied', 'Done'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              'px-4.5 py-2 h-9 text-xs font-medium rounded-full border border-transparent transition-all capitalize focus:outline-none flex items-center justify-center',
              activeFilter === filter
                ? 'bg-brand-pink text-white border-brand-pink shadow-[0_2px_8px_rgba(215,23,111,0.15)]'
                : 'bg-white text-[#7a7a9a] border-[#e8e6f0]/70 hover:border-[#d7176f]/30',
            )}
          >
            {filter}
          </button>
        ))}

        <button className="px-4.5 py-2 h-9 text-xs font-medium rounded-full bg-white text-[#7a7a9a] border border-[#e8e6f0]/70 hover:border-[#d7176f]/30 transition-all focus:outline-none flex items-center gap-1.5">
          <SlidersHorizontal size={13} className="text-[#9a99b0]" />
          <span>Filter</span>
        </button>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredCampaigns.map((campaign) => (
          <WorkCampaignCard
            key={campaign.id}
            campaign={campaign}
            onShowMoreInfo={(c) => setSelectedCampaign(c)}
            isSelected={selectedCampaign?.id === campaign.id}
          />
        ))}
      </div>

      {/* Details Slide-out Drawer */}
      <WorkDetailsDrawer
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        campaign={selectedCampaign}
      />
    </div>
  );
}
