import { Suspense } from 'react';
import PageLoader from '@/components/skeletons/PageLoader';
import SocialConnectCallback from '@/components/socials/SocialConnectCallback';

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SocialConnectCallback platform="twitter" />
    </Suspense>
  );
}
