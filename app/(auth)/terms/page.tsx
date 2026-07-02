import { Suspense } from 'react';
import TermsPage from './termsPage';
import PageLoader from '@/components/skeletons/PageLoader';
export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <TermsPage />
    </Suspense>
  );
}
