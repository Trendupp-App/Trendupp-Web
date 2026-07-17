import { Suspense } from 'react';
import WelcomePage from './welcomePage';
import PageLoader from '@/components/skeletons/PageLoader';

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <WelcomePage />
    </Suspense>
  );
}
