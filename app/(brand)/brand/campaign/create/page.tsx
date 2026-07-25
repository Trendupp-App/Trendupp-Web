import { Suspense } from 'react';
import CampaignDetailsSkeleton from '@/components/skeletons/CampaignDetailsSkeleton';
import NewCampaignPage from './CreatCampaignPage';

export default function Page() {
  return (
    <Suspense fallback={<CampaignDetailsSkeleton />}>
      <NewCampaignPage />
    </Suspense>
  );
}
