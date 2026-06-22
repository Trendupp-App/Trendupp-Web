import { Suspense } from 'react';
import OnboardPage from './onboardingPage';
import PageLoader from '@/components/skeletons/PageLoader';

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <OnboardPage />
    </Suspense>
  );
}
