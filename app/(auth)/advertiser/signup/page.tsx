import { Suspense } from 'react';
import PageLoader from '@/components/skeletons/PageLoader';
import AdvertiserSignupPage from './AdvertiserSignUpPage';

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AdvertiserSignupPage />
    </Suspense>
  );
}
