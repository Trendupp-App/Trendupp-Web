import { Suspense } from 'react';
import OnboardPage from './onboardingPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardPage />
    </Suspense>
  );
}
