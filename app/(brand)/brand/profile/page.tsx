'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import ProfileHeroBanner from '@/components/brand-profile/ProfileHeroBanner';
import SocialPlatformCards from '@/shared/SocialPlatformCards';
import SettingsList from '@/components/brand-profile/SettingsList';
import EditProfileSheet from '@/components/brand-profile/EditProfileSheet';
import NotificationsSheet from '@/components/brand-profile/NotificationsSheet';
import PrivacySecuritySheet from '@/components/brand-profile/PrivacySecuritySheet';
import HelpSupportSheet from '@/components/brand-profile/HelpSupportSheet';

type SheetType = 'notifications' | 'security' | 'help' | null;

export default function BrandProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [editOpen, setEditOpen] = useState(false);
  const [openSheet, setOpenSheet] = useState<SheetType>(null);

  const bio = user?.bio;
  const industries = user?.industries ?? [];

  return (
    <>
      <div className="flex flex-col gap-5 max-w-[900px] mx-auto">
        {/* Hero */}
        <ProfileHeroBanner onEditProfile={() => setEditOpen(true)} />

        {/* Social platform cards */}
        <SocialPlatformCards />

        {/* Bio */}
        {bio && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-[#1a1a2e]">Bio</p>
            <div className="bg-white border border-[#e8e6f0] rounded-xl px-4 py-3">
              <p className="text-sm text-[#4a4a6a] leading-relaxed line-clamp-3">{bio}</p>
            </div>
          </div>
        )}

        {/* Industries */}
        {industries.length > 0 && (
          <div className="bg-white border border-[#e8e6f0] rounded-xl px-4 py-4 flex items-start gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-[#9a99b0] uppercase tracking-wider">
                Industry
              </p>
              <div className="flex flex-wrap gap-2">
                {industries.map((ind) => (
                  <span
                    key={ind.id}
                    className="text-xs font-medium text-[#7c6fe0] bg-[#ede9fb] px-3 py-1 rounded-full"
                  >
                    {ind.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="flex flex-col gap-4">
          <SettingsList onOpen={(id) => setOpenSheet(id as SheetType)} />
          <p className="text-xs text-[#9a99b0] text-center">
            Trendupp v1.0.0 ·{' '}
            <a href="/terms" className="text-brand-pink hover:underline">
              Terms and Privacy
            </a>
          </p>
        </div>
      </div>

      {/* Sheets */}
      <EditProfileSheet open={editOpen} onOpenChange={setEditOpen} />
      <NotificationsSheet
        open={openSheet === 'notifications'}
        onOpenChange={(v) => !v && setOpenSheet(null)}
      />
      <PrivacySecuritySheet
        open={openSheet === 'security'}
        onOpenChange={(v) => !v && setOpenSheet(null)}
      />
      <HelpSupportSheet
        open={openSheet === 'help'}
        onOpenChange={(v) => !v && setOpenSheet(null)}
      />
    </>
  );
}
