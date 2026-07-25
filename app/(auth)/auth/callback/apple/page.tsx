import { Suspense } from 'react';
import PageLoader from '@/components/skeletons/PageLoader';
import AppleCallBackPage from './appleCallBackPage';

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AppleCallBackPage />
    </Suspense>
  );
}
