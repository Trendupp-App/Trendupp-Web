import { OnboardingStepsCompleted } from '@/types/Onboarding';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'creator' | 'brand';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  onboardingPercentage: number;
  onboardingStepsCompleted: OnboardingStepsCompleted;
  socialsConnected: {
    instagram: boolean;
    tiktok: boolean;
    youtube: boolean;
    twitter: boolean;
    facebook: boolean;
  };
  username: string | null;
  niches: Array<{ id: string; name: string; order: number }>;
  industries: Array<{ id: string; name: string }>;
  assignedTier: string | null;
  bio: string | null;
  avatarUrl: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  nationalityId?: string | null;
  countryId?: string | null;
  country?: { id: string; name: string } | null;
  stateId?: string | null;
  state?: { id: string; name: string } | null;
  city?: string | null;
  instagramUsername?: string | null;
  instagramFollowers?: number | null;
  tiktokUsername?: string | null;
  tiktokFollowers?: number | null;
  youtubeUsername?: string | null;
  youtubeFollowers?: number | null;
  twitterUsername?: string | null;
  twitterFollowers?: number | null;
  facebookUsername?: string | null;
  facebookFollowers?: number | null;
  brandRepresentative: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  avgRating?: number | null;
  totalReviews?: number | null;
  totalTokens?: number | null;
  badge?: string | null;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  hasHydrated: boolean;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: (redirect?: boolean) => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      hasHydrated: false,
      setSession: (accessToken, user) => set({ accessToken, user }),
      clearSession: (redirect = true) => {
        set({ accessToken: null, user: null });
        if (redirect && typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
      },
      updateUser: (patch) => set((s) => ({ user: s.user ? { ...s.user, ...patch } : null })),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'trendupp-auth',
      partialize: (s) => ({ accessToken: s.accessToken, user: s.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
