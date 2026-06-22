import { Suspense } from 'react';
import VerifyOtpPage from './verifyOtpPage';
import PageLoader from '@/components/skeletons/PageLoader';

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <VerifyOtpPage />
    </Suspense>
  );
}
