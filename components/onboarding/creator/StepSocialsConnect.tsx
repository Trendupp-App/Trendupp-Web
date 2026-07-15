'use client';

import SocialsOAuthConnect from '@/shared/SocialsOAuthConnect';

type ConnectedAccount = {
  platformId: string;
  username: string;
  followers: string;
};

interface Props {
  onNext: (data: { connected: ConnectedAccount[] }) => void;
  onSkip: () => void;
  defaultValues?: { connected?: ConnectedAccount[] };
}

/**
 * Onboarding Step 3: Connect socials — OAuth-verified.
 *
 * Connections are made through each platform's OAuth consent flow and the
 * backend verifies the identity and follower count against the platform API
 * (POST /api/v1/socials/:platform/connect), so usernames and audiences can no
 * longer be self-reported. Connection state lives on the server (GET /socials)
 * rather than in the wizard's local state.
 */
export default function StepSocials({ onNext, onSkip }: Props) {
  return (
    <SocialsOAuthConnect
      ctaLabel="Continue"
      onDone={() => onNext({ connected: [] })}
      onSkip={onSkip}
      backLabel="I'll do that later"
    />
  );
}
