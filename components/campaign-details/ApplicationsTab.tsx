'use client';

import { useState } from 'react';
import { AlertCircle, Lock, Rocket, X } from 'lucide-react';
import ApplicationListItem from './ApplicationListItem';
import ApplicationDetailSheet from './ApplicationDetailSheet';
import FeedbackModal from '@/shared/FeedBackModal';
import CreatorProfileSheet from '@/components/campaign-details/CreatorProfileSheet';
import type { CampaignApplicationDto, CampaignStatus } from '@/types/campaign';
import { useActivateCampaign, useToggleApplicationSelection } from '@/hooks/useCampaign';
import { cn } from '@/lib/utils';

interface ApplicationsTabProps {
  campaignId: string;
  campaignTitle: string;
  applicationsForLive?: CampaignApplicationDto[];
  campaignCurrency?: string;
  campaignStatus?: CampaignStatus;
}

function creatorName(app: CampaignApplicationDto) {
  return `${app?.creator?.firstName ?? ''} ${app?.creator?.lastName ?? ''}`.trim();
}

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export default function ApplicationsTab({
  campaignId,
  applicationsForLive,
  campaignTitle,
  campaignCurrency,
  campaignStatus,
}: ApplicationsTabProps) {
  const actionsDisabled = campaignStatus === 'paused' || campaignStatus === 'cancelled';
  const [selected, setSelected] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  // Applications with a select/unselect request in flight
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [profileCreatorId, setProfileCreatorId] = useState<string | null>(null);
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [confirmActivate, setConfirmActivate] = useState(false);

  const { mutate: toggleSelection } = useToggleApplicationSelection(campaignId);
  const { mutate: activateCampaign, isPending: isActivating } = useActivateCampaign(campaignId);

  const applications = applicationsForLive || [];
  // Selection is persisted server-side, so it survives reloads and other devices
  const selectedApplications = applications.filter((app) => app.status === 'selected');
  const selectedTotal = selectedApplications.reduce((sum, app) => sum + (app.feeRequest || 0), 0);
  const currency = campaignCurrency ?? 'NGN';
  const isToggling = togglingIds.size > 0;
  const canActivate = selectedApplications.length > 0 && !isToggling && !isActivating;

  function handleView(application: CampaignApplicationDto) {
    setSelected(application?.id);
    setSheetOpen(true);
  }

  function handleViewProfile(application: CampaignApplicationDto) {
    // Swap sheets: close the application detail sheet, open the profile sheet
    setSheetOpen(false);
    setProfileCreatorId(application.creator.id);
    setProfileSheetOpen(true);
  }

  function setToggling(id: string, toggling: boolean) {
    setTogglingIds((prev) => {
      const next = new Set(prev);
      if (toggling) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  // The endpoint toggles: it selects a pending application and unselects a selected one
  function handleToggleSelect(application: CampaignApplicationDto) {
    if (togglingIds.has(application.id) || isActivating) return;
    setToggling(application.id, true);
    toggleSelection(application.id, {
      onSettled: () => setToggling(application.id, false),
    });
  }

  function clearSelection() {
    selectedApplications.forEach(handleToggleSelect);
  }

  function handleActivate() {
    // Once active the page switches to the active-campaign view, so this tab unmounts
    activateCampaign(undefined, { onSettled: () => setConfirmActivate(false) });
  }

  return (
    <>
      {actionsDisabled && (
        <div className="mb-3 flex items-center gap-2 bg-[#fef2f2] border border-[#fee2e2] rounded-xl px-4 py-3">
          <AlertCircle size={15} className="text-[#dc2626] shrink-0" />
          <p className="text-xs font-medium text-[#b91c1c] capitalize">
            This campaign has been {campaignStatus} — creators can no longer be selected.
          </p>
        </div>
      )}

      {/* Selection summary + activate */}
      {!actionsDisabled && applications.length > 0 && (
        <div className="mb-3 bg-white border border-[#e8e6f0] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {selectedApplications.length > 0 && (
              <button
                onClick={clearSelection}
                disabled={isToggling || isActivating}
                className="cursor-pointer text-[#9a99b0] hover:text-[#1a1a2e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Clear selection"
              >
                <X size={16} />
              </button>
            )}
            {selectedApplications.length > 0 ? (
              <span className="text-sm font-medium text-[#1a1a2e]">
                {selectedApplications.length} selected
                {selectedTotal > 0 && (
                  <span className="font-normal text-[#9a99b0]">
                    {' '}
                    · {formatMoney(selectedTotal, currency)}
                  </span>
                )}
              </span>
            ) : (
              <span className="text-sm text-[#9a99b0]">
                Select at least one creator to activate this campaign
              </span>
            )}
          </div>

          <button
            onClick={() => setConfirmActivate(true)}
            disabled={!canActivate}
            className={cn(
              'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0',
              canActivate
                ? 'bg-brand-pink text-white hover:bg-brand-pink/90 cursor-pointer shadow-sm'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed',
            )}
          >
            <Rocket className="size-4" />
            Activate campaign
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {applications.map((app) => (
          <ApplicationListItem
            key={app.id}
            application={app}
            onView={handleView}
            selected={app.status === 'selected'}
            toggling={togglingIds.has(app.id)}
            onToggleSelect={actionsDisabled ? undefined : handleToggleSelect}
            currency={campaignCurrency}
          />
        ))}
      </div>

      <ApplicationDetailSheet
        applicationId={selected}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onViewProfile={handleViewProfile}
        currency={campaignCurrency}
      />

      <CreatorProfileSheet
        creatorId={profileCreatorId}
        open={profileSheetOpen}
        onOpenChange={(open) => {
          setProfileSheetOpen(open);
          // Optional: go back to the application sheet when the profile sheet closes
          if (!open && selected) setSheetOpen(true);
        }}
      />

      {/* Activation locks the selection, so confirm first */}
      {confirmActivate && (
        <FeedbackModal
          icon={Lock}
          iconColor="text-brand-pink"
          message={
            <div className="flex flex-col gap-3">
              <p>
                Activate <strong>{campaignTitle}</strong> with{' '}
                {selectedApplications.length === 1 ? (
                  <strong>{creatorName(selectedApplications[0])}</strong>
                ) : (
                  <strong>{selectedApplications.length} creators</strong>
                )}
                ?
              </p>
              <div className="flex flex-col gap-1 text-xs text-left py-2.5 px-3 rounded-lg border bg-amber-50 border-amber-100 text-amber-700">
                <span>
                  Total creator fees: <strong>{formatMoney(selectedTotal, currency)}</strong>
                </span>
                <span>Your selection will be locked — you won&apos;t be able to change it.</span>
              </div>
            </div>
          }
          actions={[
            {
              label: 'No, go back',
              onClick: () => setConfirmActivate(false),
            },
            {
              label: 'Yes, activate',
              variant: 'primary',
              onClick: handleActivate,
              loading: isActivating,
              disabled: isActivating,
            },
          ]}
        />
      )}
    </>
  );
}
