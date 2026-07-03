'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import ApplicationListItem from './ApplicationListItem';
import ApplicationDetailSheet from './ApplicationDetailSheet';
import FeedbackModal from '@/shared/FeedBackModal';
import { CampaignApplication } from '@/types/campaign';
import { useReviewApplication } from '@/hooks/useCampaign';
import { useQueryClient } from '@tanstack/react-query';
interface ApplicationsTabProps {
  campaignId: string;
  campaignTitle: string;
  applicationsForLive?: CampaignApplication[];
}

type PendingAction = { type: 'accept' | 'reject'; application: CampaignApplication } | null;

export default function ApplicationsTab({
  campaignId,
  applicationsForLive,
  campaignTitle,
}: ApplicationsTabProps) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [resultDialog, setResultDialog] = useState<{
    type: 'accept' | 'reject';
    application: CampaignApplication;
  } | null>(null);

  const { mutate: reviewApplication, isPending: isReviewing } = useReviewApplication(
    campaignId,
    (appId) => {
      // keep detail sheet + campaign application list fresh
      queryClient.invalidateQueries({ queryKey: ['application', appId] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
    },
  );

  function handleView(application: CampaignApplication) {
    setSelected(application?.id);
    setSheetOpen(true);
  }

  function handleAcceptRequest(application: CampaignApplication) {
    setPendingAction({ type: 'accept', application });
    setSheetOpen(false);
  }

  function handleRejectRequest(application: CampaignApplication) {
    setPendingAction({ type: 'reject', application });
    setSheetOpen(false);
  }

  function handleConfirmAction() {
    if (!pendingAction) return;
    const status = pendingAction.type === 'accept' ? 'accepted' : 'rejected';

    reviewApplication(
      { appId: pendingAction.application.id, status },
      {
        onSuccess: () => setResultDialog(pendingAction),
      },
    );
    setPendingAction(null);
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {(applicationsForLive || []).map((app) => (
          <ApplicationListItem key={app.id} application={app} onView={handleView} />
        ))}
      </div>

      <ApplicationDetailSheet
        applicationId={selected}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
      />

      {/* Confirm accept/reject */}
      {pendingAction && (
        <FeedbackModal
          icon={AlertCircle}
          iconColor="text-amber-500"
          message={
            <>
              Are you sure you want to {pendingAction.type === 'accept' ? 'accept' : 'reject'}{' '}
              <strong>
                {pendingAction?.application?.creator?.firstName ||
                  pendingAction?.application?.creator?.lastName}
              </strong>
              {pendingAction.type === 'accept' ? ' content?' : "'s application?"}
            </>
          }
          actions={[
            {
              label: 'No, go back',
              onClick: () => setPendingAction(null),
            },
            {
              label: pendingAction.type === 'accept' ? 'Yes, approve' : 'Yes, reject',
              variant: 'primary',
              onClick: handleConfirmAction,
              loading: isReviewing,
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
              You have successfully {resultDialog.type === 'accept' ? 'selected' : 'rejected'}{' '}
              <strong>
                {resultDialog.application?.creator?.firstName ||
                  resultDialog.application?.creator?.lastName}
              </strong>{' '}
              application for <strong>{campaignTitle}</strong>
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
