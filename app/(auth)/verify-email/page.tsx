import { Suspense } from 'react';
import VerifyPage from './verifyPage';
import PageLoader from '@/components/skeletons/PageLoader';

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <VerifyPage />
    </Suspense>
  );
}
