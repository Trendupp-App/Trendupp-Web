'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkCampaign } from './WorkCampaignCard';

interface WorkDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: WorkCampaign | null;
}

export default function WorkDetailsDrawer({ isOpen, onClose, campaign }: WorkDetailsDrawerProps) {
  // Lock scrolling when the drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!campaign) return null;

  // Render text helper for campaign status column in details
  const getStatusText = (status: WorkCampaign['status']) => {
    switch (status) {
      case 'In progress':
      case 'Revision requested':
        return 'In progress';
      case 'Selected':
        return 'Selected';
      case 'Pending':
        return 'Pending';
      case 'Declined':
        return 'Declined';
      case 'Done':
        return 'Completed';
      default:
        return 'In progress';
    }
  };

  // Render text color helper for status in metadata grid
  const getStatusColor = (status: WorkCampaign['status']) => {
    switch (status) {
      case 'In progress':
      case 'Revision requested':
      case 'Pending':
        return 'text-[#d97706]';
      case 'Selected':
      case 'Done':
        return 'text-[#16a34a]';
      case 'Declined':
        return 'text-[#dc2626]';
      default:
        return 'text-[#d97706]';
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex justify-end transition-opacity duration-300',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px] transition-all"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div
        className={cn(
          'w-full max-w-[560px] h-full bg-white relative z-10 flex flex-col shadow-2xl transition-transform duration-300 ease-out overflow-y-auto auth-scrollbar p-6 pb-12',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition-colors focus:outline-none"
          aria-label="Close details"
        >
          <X size={18} />
        </button>

        {/* Hero image header banner */}
        <div className="relative w-full h-[220px] rounded-2xl overflow-hidden mb-6 shrink-0">
          <Image
            src={campaign.image}
            alt={campaign.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 560px) 100vw, 560px"
          />
          {/* Black bottom gradient/overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

          {/* Overlay Content */}
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
            <div className="flex flex-col min-w-0">
              <h2 className="text-lg font-bold text-white leading-tight truncate">
                {campaign.title}
              </h2>
              <span className="text-xs text-white/90 font-light mt-1 flex items-center gap-1 leading-none">
                {campaign.brand} &bull; <Clock size={11} className="text-white" />
                {campaign.daysLeft} left
              </span>
            </div>

            {/* Blue active badge */}
            <span className="bg-[#2563eb] text-white text-[10px] font-semibold px-3 py-1.5 rounded-full leading-none shadow-[0_2px_8px_rgba(37,99,235,0.2)] uppercase tracking-wide shrink-0">
              {campaign.status}
            </span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="border border-[#e8e6f0]/60 rounded-2xl p-4 grid grid-cols-4 divide-x divide-[#e8e6f0]/60 text-center mb-6 shrink-0 select-none bg-white">
          {/* Budget Range */}
          <div className="flex flex-col gap-0.5 justify-center">
            <span className="text-[10px] text-[#7a7a9a] font-light">Budget range</span>
            <span className="text-[11px] font-bold text-[#1a1a2e] leading-tight break-words px-1">
              {campaign.budgetString}
            </span>
          </div>

          {/* Platform */}
          <div className="flex flex-col gap-0.5 justify-center">
            <span className="text-[10px] text-[#7a7a9a] font-light">Platform</span>
            <span className="text-[11px] font-bold text-[#1a1a2e] leading-tight px-1">
              {campaign.platform}
            </span>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-0.5 justify-center">
            <span className="text-[10px] text-[#7a7a9a] font-light">Status</span>
            <span
              className={cn(
                'text-[11px] font-bold leading-tight px-1 capitalize',
                getStatusColor(campaign.status),
              )}
            >
              {getStatusText(campaign.status)}
            </span>
          </div>

          {/* Tier */}
          <div className="flex flex-col gap-0.5 justify-center">
            <span className="text-[10px] text-[#7a7a9a] font-light">Tier</span>
            <span className="text-[11px] font-bold text-[#1a1a2e] leading-tight px-1">
              {campaign.tier}
            </span>
          </div>
        </div>

        {/* Content Guidelines Reminder */}
        <div className="flex flex-col mb-8 select-none">
          <h3 className="text-sm font-bold text-[#1a1a2e] mb-2">Content Guidelines Reminder</h3>
          <p className="text-xs font-light text-[#7a7a9a] leading-relaxed">{campaign.guidelines}</p>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-4 mt-auto shrink-0 select-none">
          <button className="bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-colors flex-1 text-center cursor-pointer focus:outline-none">
            Submit content link
          </button>
          <button className="bg-[#f5f4f8] hover:bg-[#e8e7ee] text-[#5a5a7a] font-semibold text-xs py-3 px-6 rounded-xl transition-colors w-[35%] text-center cursor-pointer focus:outline-none">
            View brief
          </button>
        </div>
      </div>
    </div>
  );
}
