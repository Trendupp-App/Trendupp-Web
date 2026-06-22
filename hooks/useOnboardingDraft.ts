// hooks/useOnboardingDraft.ts
import { useEffect, useRef } from 'react';

export function useOnboardingDraft<T>(
  userId: string | undefined,
  state: { stepIndex: number; data: T },
) {
  const key = userId ? `onboarding-draft:${userId}` : null;

  useEffect(() => {
    if (!key) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch {
        // storage full / disabled — fail silently, not worth surfacing
      }
    }, 400); // debounce so every keystroke doesn't hit storage
    return () => clearTimeout(t);
  }, [key, state]);
}

export function readOnboardingDraft<T>(
  userId: string | undefined,
): { stepIndex: number; data: T } | null {
  if (!userId) return null;
  try {
    const raw = localStorage.getItem(`onboarding-draft:${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearOnboardingDraft(userId: string | undefined) {
  if (!userId) return;
  localStorage.removeItem(`onboarding-draft:${userId}`);
}
