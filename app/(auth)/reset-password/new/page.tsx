import { Suspense } from 'react';
import ResetPasswordPage from './resetNewPasswordPage';
import PageLoader from '@/components/skeletons/PageLoader';

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ResetPasswordPage />
    </Suspense>
  );
}
