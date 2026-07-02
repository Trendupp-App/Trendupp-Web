'use client';

import SocialsConnectUI, { type ConnectedAccount } from '@/shared/SocialsConnectUI';
import { useUpdateProfileSocials } from '@/hooks/useBrandProfileMutations';
import type { UpdateProfileSocialsPayload } from '@/types/profile';

interface ProfileSocialsEditProps {
  onSaved?: () => void;
  defaultValues?: { connected?: ConnectedAccount[] };
}

export default function ProfileSocialsEdit({ onSaved, defaultValues }: ProfileSocialsEditProps) {
  const { mutate: updateSocials, isPending } = useUpdateProfileSocials();

  return (
    <SocialsConnectUI
      defaultValues={defaultValues}
      isPending={isPending}
      ctaLabel="Save"
      onConnect={(payload, callbacks) =>
        updateSocials(payload as UpdateProfileSocialsPayload, callbacks)
      }
      onDone={() => onSaved?.()}
    />
  );
}
