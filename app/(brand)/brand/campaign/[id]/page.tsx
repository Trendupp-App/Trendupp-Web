import { Suspense } from 'react';
import CampaignDetailSkeleton from '@/components/skeletons/CampaignDetailsSkeleton';
import CampaignDetailPage from './CampaignDetailsPage';

export default function Page() {
  return (
    <Suspense fallback={<CampaignDetailSkeleton />}>
      <CampaignDetailPage />
    </Suspense>
  );
}
