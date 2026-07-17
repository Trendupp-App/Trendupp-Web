import { Suspense } from 'react';
import CampaignDetailsSkeleton from '@/components/skeletons/CampaignDetailsSkeleton';
import SuccessPage from './SuccessPage';

export default function Page() {
  return (
    <Suspense fallback={<CampaignDetailsSkeleton />}>
      <SuccessPage />
    </Suspense>
  );
}
