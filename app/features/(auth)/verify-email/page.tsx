import { Suspense } from 'react';
import VerifyPage from './verifyPage';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VerifyPage />
    </Suspense>
  );
}
