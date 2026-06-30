import { Suspense } from 'react';
import PageLoader from '@/components/skeletons/PageLoader';
import TiktokCallbackPage from './tiktokCallBackPage';

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <TiktokCallbackPage />
    </Suspense>
  );
}
