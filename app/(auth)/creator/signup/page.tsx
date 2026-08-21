import { Suspense } from 'react';
import PageLoader from '@/components/skeletons/PageLoader';
import CreatorSignUpPage from './CreatorSignUpPage';

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CreatorSignUpPage />
    </Suspense>
  );
}
