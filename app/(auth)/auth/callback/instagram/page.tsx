import { Suspense } from 'react';
import PageLoader from '@/components/skeletons/PageLoader';
import InstagramCallBackPage from './instagramCallBackPage';

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <InstagramCallBackPage />
    </Suspense>
  );
}
