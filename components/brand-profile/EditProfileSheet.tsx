'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import ProfilePersonalInfoEdit from '@/components/brand-profile/ProfilePersonalInfoEdit';
import ProfileIndustryEdit from '@/components/brand-profile/ProfileIndustryEdit';
import ProfileRepresentativeEdit from '@/components/brand-profile/ProfileRepresentativeEdit';
import ProfileSocialsEdit from '@/components/brand-profile/ProfileSocialsEdit';
import ProfilePaymentEdit from '@/components/brand-profile/ProfilePaymentEdit';

type EditTab = 'personal' | 'industry' | 'representative' | 'socials' | 'payment';

const TABS: { id: EditTab; label: string }[] = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'industry', label: 'Industry' },
  { id: 'representative', label: 'Representative' },
  { id: 'socials', label: 'Socials' },
  { id: 'payment', label: 'Payment' },
];

interface EditProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileSheet({ open, onOpenChange }: EditProfileSheetProps) {
  const [activeTab, setActiveTab] = useState<EditTab>('personal');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[640px] overflow-y-auto p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-[#e8e6f0]">
          <SheetTitle className="text-base font-semibold text-[#1a1a2e]">Edit profile</SheetTitle>
        </SheetHeader>

        <div className="px-3 pt-4 pb-3">
          <div className="bg-[#f4f3f8] rounded-xl p-1 flex items-center gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 py-2 cursor-pointer px-2 rounded-lg text-[10px] font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-white text-brand-pink shadow-sm'
                    : 'text-[#7a7a9a] hover:text-[#1a1a2e]',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-3 pb-8">
          {activeTab === 'personal' && <ProfilePersonalInfoEdit />}
          {activeTab === 'industry' && <ProfileIndustryEdit />}
          {activeTab === 'representative' && <ProfileRepresentativeEdit />}
          {activeTab === 'socials' && <ProfileSocialsEdit />}
          {activeTab === 'payment' && <ProfilePaymentEdit />}
        </div>
      </SheetContent>
    </Sheet>
  );
}
