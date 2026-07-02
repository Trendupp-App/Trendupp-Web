import { Suspense } from 'react';
import PageLoader from '@/components/skeletons/PageLoader';
import BrandCampaignsPage from './CampaignPage';

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <BrandCampaignsPage />
    </Suspense>
  );
}
