'use client';

import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FeedbackModal from '@/shared/FeedBackModal';

interface CampaignSuccessModalProps {
  campaignTitle?: string;
  onNewCampaign: () => void;
}

export default function CampaignSuccessModal({
  campaignTitle,
  onNewCampaign,
}: CampaignSuccessModalProps) {
  const router = useRouter();

  return (
    <FeedbackModal
      icon={Check}
      iconColor="text-emerald-500"
      message={
        <>
          <span className="font-bold">{campaignTitle ?? 'Your campaign'}</span> is now live and
          accepting applications. Creators have <span className="font-bold">48 hours</span> to
          apply. You&apos;ll be notified as applications come in.
        </>
      }
      actions={[
        {
          label: 'View all campaign',
          onClick: () => router.push('/brand/campaign'),
        },
        {
          label: 'New campaign',
          variant: 'primary',
          onClick: onNewCampaign,
        },
      ]}
    />
  );
}
