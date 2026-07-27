import { Suspense } from 'react';
import PageLoader from '@/components/skeletons/PageLoader';
import FacebookCallBackPage from './facebookCallBackPage';

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <FacebookCallBackPage />
    </Suspense>
  );
}
