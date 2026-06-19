import { Suspense } from 'react';
import VerifyOtpPage from './verifyOtpPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpPage />
    </Suspense>
  );
}
