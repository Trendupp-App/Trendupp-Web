'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, CircleCheck, CircleX, X, Loader2 } from 'lucide-react';
import ApplicationListItem from './ApplicationListItem';
import ApplicationDetailSheet from './ApplicationDetailSheet';
import FeedbackModal from '@/shared/FeedBackModal';
import CreatorProfileSheet from '@/components/campaign-details/CreatorProfileSheet';
import type {
  CampaignApplicationDto,
  CampaignStatus,
  ValidateSelectionResult,
} from '@/types/campaign';
import { useReviewApplicationsBatch, useValidateSelection } from '@/hooks/useCampaign';
import { useQueryClient } from '@tanstack/react-query';
interface ApplicationsTabProps {
  campaignId: string;
  campaignTitle: string;
  applicationsForLive?: CampaignApplicationDto[];
  campaignCurrency?: string;
  campaignStatus?: CampaignStatus;
}

type PendingAction = {
  type: 'accept' | 'reject';
  applications: CampaignApplicationDto[];
} | null;

type BudgetCheck = { status: 'loading' | 'done'; data?: ValidateSelectionResult } | null;

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
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [budgetCheck, setBudgetCheck] = useState<BudgetCheck>(null);
  const [profileCreatorId, setProfileCreatorId] = useState<string | null>(null);
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [resultDialog, setResultDialog] = useState<{
    type: 'accept' | 'reject';
    applications: CampaignApplicationDto[];
  } | null>(null);

  const { mutate: reviewApplicationsBatch, isPending: isReviewing } = useReviewApplicationsBatch(
    campaignId,
    (applicationIds) => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      applicationIds.forEach((id) => {
        queryClient.invalidateQueries({ queryKey: ['application', id] });
      });
    },
  );

  const { mutate: validateSelection } = useValidateSelection(campaignId);

  const applications = applicationsForLive || [];

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

  function handleToggleSelect(application: CampaignApplicationDto) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(application.id)) next.delete(application.id);
      else next.add(application.id);
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function handleBulkRequest(type: 'accept' | 'reject') {
    const chosen = applications.filter((app) => selectedIds.has(app.id));
    if (!chosen.length) return;
    setPendingAction({ type, applications: chosen });

    if (type === 'accept') {
      setBudgetCheck({ status: 'loading' });
      validateSelection(
        chosen.map((a) => a.id),
        {
          onSuccess: (data) => setBudgetCheck({ status: 'done', data }),
          onError: () => setPendingAction(null),
        },
      );
    }
  }

  function handleCancelAction() {
    setPendingAction(null);
    setBudgetCheck(null);
  }

  function handleConfirmAction() {
    if (!pendingAction) return;
    const action = pendingAction;
    const status = action.type === 'accept' ? 'accepted' : 'rejected';
    reviewApplicationsBatch(
      { applicationIds: action.applications.map((a) => a.id), status },
      {
        onSuccess: () => {
          setResultDialog(action);
          clearSelection();
          setPendingAction(null);
          setBudgetCheck(null);
        },
        onError: () => {
          setPendingAction(null);
          setBudgetCheck(null);
        },
      },
    );
  }

  return (
    <>
      {actionsDisabled && (
        <div className="mb-3 flex items-center gap-2 bg-[#fef2f2] border border-[#fee2e2] rounded-xl px-4 py-3">
          <AlertCircle size={15} className="text-[#dc2626] shrink-0" />
          <p className="text-xs font-medium text-[#b91c1c] capitalize">
            This campaign has been {campaignStatus} — applications can no longer be accepted or
            rejected.
          </p>
        </div>
      )}

      {/* Bulk action bar */}
      {!actionsDisabled && selectedIds.size > 0 && (
        <div className="mb-3 bg-white border border-[#e8e6f0] rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={clearSelection}
              className="cursor-pointer text-[#9a99b0] hover:text-[#1a1a2e] transition-colors"
              aria-label="Clear selection"
            >
              <X size={16} />
            </button>
            <span className="text-sm font-medium text-[#1a1a2e]">{selectedIds.size} selected</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleBulkRequest('reject')}
              className="flex items-center cursor-pointer gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors"
            >
              <CircleX className="size-4" />
              Reject
            </button>
            <button
              onClick={() => handleBulkRequest('accept')}
              className="flex items-center cursor-pointer gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-colors"
            >
              <CircleCheck className="size-4" />
              Accept
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {applications.map((app) => (
          <ApplicationListItem
            key={app.id}
            application={app}
            onView={handleView}
            selected={selectedIds.has(app.id)}
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

      {/* Confirm accept/reject */}
      {pendingAction && (
        <FeedbackModal
          icon={AlertCircle}
          iconColor="text-amber-500"
          message={
            <div className="flex flex-col gap-3">
              <p>
                Are you sure you want to {pendingAction.type === 'accept' ? 'accept' : 'reject'}{' '}
                {pendingAction.applications.length === 1 ? (
                  <>
                    <strong>{creatorName(pendingAction.applications[0])}</strong>&apos;s
                    application?
                  </>
                ) : (
                  <>
                    <strong>{pendingAction.applications.length} applications</strong>?
                  </>
                )}
              </p>

              {pendingAction.type === 'accept' && budgetCheck?.status === 'loading' && (
                <div className="flex items-center justify-center gap-2 text-xs text-[#9a99b0] py-2 px-3 rounded-lg bg-[#faf9fc]">
                  <Loader2 size={14} className="animate-spin" />
                  Checking campaign budget…
                </div>
              )}

              {pendingAction.type === 'accept' && budgetCheck?.status === 'done' && (
                <div
                  className={`flex flex-col gap-1 text-xs text-left py-2.5 px-3 rounded-lg border ${
                    budgetCheck.data?.isValid
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                      : 'bg-red-50 border-red-100 text-red-600'
                  }`}
                >
                  <span>{budgetCheck.data?.message}</span>
                  {budgetCheck.data?.isValid ? (
                    <span>
                      Balance after this selection:{' '}
                      <strong>
                        {formatMoney(
                          budgetCheck.data.amountAvailable - budgetCheck.data.selectedTotal,
                          budgetCheck.data.currency,
                        )}
                      </strong>
                    </span>
                  ) : (
                    <span>
                      Short by{' '}
                      <strong>
                        {formatMoney(budgetCheck.data!.shortfall, budgetCheck.data!.currency)}
                      </strong>
                    </span>
                  )}
                </div>
              )}
            </div>
          }
          actions={[
            {
              label: 'No, go back',
              onClick: handleCancelAction,
            },
            {
              label: pendingAction.type === 'accept' ? 'Yes, approve' : 'Yes, reject',
              variant: 'primary',
              onClick: handleConfirmAction,
              loading:
                isReviewing ||
                (pendingAction.type === 'accept' && budgetCheck?.status === 'loading'),
              disabled:
                pendingAction.type === 'accept' &&
                (budgetCheck?.status === 'loading' || budgetCheck?.data?.isValid === false),
            },
          ]}
        />
      )}

      {/* Result */}
      {resultDialog && (
        <FeedbackModal
          icon={CheckCircle2}
          iconColor={resultDialog.type === 'accept' ? 'text-emerald-500' : 'text-red-500'}
          message={
            <>
              You have successfully {resultDialog.type === 'accept' ? 'accepted' : 'rejected'}{' '}
              {resultDialog.applications.length === 1 ? (
                <strong>{creatorName(resultDialog.applications[0])}&apos;s</strong>
              ) : (
                <strong>{resultDialog.applications.length}</strong>
              )}{' '}
              application{resultDialog.applications.length === 1 ? '' : 's'} for{' '}
              <strong>{campaignTitle}</strong>
            </>
          }
          actions={[
            {
              label: 'Ok, got it',
              variant: 'primary',
              onClick: () => setResultDialog(null),
            },
          ]}
        />
      )}
    </>
  );
}
