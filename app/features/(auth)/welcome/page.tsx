import { Suspense } from 'react';
import WelcomePage from './welcomePage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WelcomePage />
    </Suspense>
  );
}
