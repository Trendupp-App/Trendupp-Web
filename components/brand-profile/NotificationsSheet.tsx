'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotificationSettings, useUpdateNotifications } from '@/hooks/useBrandProfileMutations';
import type { NotificationSettings } from '@/types/profile';

interface NotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div>
        <p className="text-sm font-medium text-[#1a1a2e]">{label}</p>
        {description && <p className="text-xs text-[#9a99b0] mt-0.5">{description}</p>}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-brand-pink"
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-[#9a99b0] uppercase tracking-wider px-1 mb-1">
        {title}
      </p>
      <div className="bg-white border border-[#e8e6f0] rounded-xl divide-y divide-[#f0eef8]">
        {children}
      </div>
    </div>
  );
}

export default function NotificationsSheet({ open, onOpenChange }: NotificationsSheetProps) {
  const { data: settings, isLoading } = useNotificationSettings();
  const { mutate: updateNotifications } = useUpdateNotifications();

  function toggle(key: keyof NotificationSettings) {
    if (!settings) return;
    updateNotifications({ [key]: !settings[key] });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[480px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-base font-semibold text-[#1a1a2e]">Notification</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : !settings ? (
          <p className="text-sm text-[#9a99b0]">Could not load notification settings.</p>
        ) : (
          <div className="flex flex-col gap-3 px-3 mb-4">
            <Section title="Activity">
              <ToggleRow
                label="New Campaigns"
                description="Get alerted when matching campaigns go live"
                checked={settings.newCampaigns}
                onChange={() => toggle('newCampaigns')}
              />
              <ToggleRow
                label="Application Updates"
                description="Status changes on your applications"
                checked={settings.applicationUpdates}
                onChange={() => toggle('applicationUpdates')}
              />
              <ToggleRow
                label="Payment Alerts"
                description="Deposits, withdrawals and escrow releases"
                checked={settings.paymentAlerts}
                onChange={() => toggle('paymentAlerts')}
              />
              <ToggleRow
                label="Brand Messages"
                description="Campaign Chat Notifications"
                checked={settings.brandMessages}
                onChange={() => toggle('brandMessages')}
              />
            </Section>

            <Section title="Channels">
              <ToggleRow
                label="Push Notifications"
                checked={settings.pushNotifications}
                onChange={() => toggle('pushNotifications')}
              />
              <ToggleRow
                label="Email Notifications"
                checked={settings.emailNotifications}
                onChange={() => toggle('emailNotifications')}
              />
            </Section>

            <Section title="Digest">
              <ToggleRow
                label="Weekly summary"
                description="Highlights every Monday morning"
                checked={settings.weeklySummary}
                onChange={() => toggle('weeklySummary')}
              />
              <ToggleRow
                label="Marketing & Offers"
                description="Promotions and platform news"
                checked={settings.marketingOffers}
                onChange={() => toggle('marketingOffers')}
              />
            </Section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
