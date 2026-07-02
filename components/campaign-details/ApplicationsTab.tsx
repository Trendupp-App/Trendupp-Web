'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import ApplicationListItem from './ApplicationListItem';
import ApplicationDetailSheet from './ApplicationDetailSheet';
import FeedbackModal from '@/shared/FeedBackModal';
import type { CampaignApplication } from '@/types/application';

interface ApplicationsTabProps {
  applications: CampaignApplication[];
  campaignTitle: string;
}

type PendingAction = { type: 'accept' | 'reject'; application: CampaignApplication } | null;

export default function ApplicationsTab({ applications, campaignTitle }: ApplicationsTabProps) {
  const [selected, setSelected] = useState<CampaignApplication | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [resultDialog, setResultDialog] = useState<{
    type: 'accept' | 'reject';
    application: CampaignApplication;
  } | null>(null);

  function handleView(application: CampaignApplication) {
    setSelected(application);
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
    // TODO: wire to real accept/reject mutation once endpoint is available
    setResultDialog(pendingAction);
    setPendingAction(null);
    setSheetOpen(false);
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {applications.map((app) => (
          <ApplicationListItem key={app.id} application={app} onView={handleView} />
        ))}
      </div>

      <ApplicationDetailSheet
        application={selected}
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
              <strong>{pendingAction.application.creator.name}</strong>
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
              <strong>{resultDialog.application.creator.name}</strong> application for{' '}
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
