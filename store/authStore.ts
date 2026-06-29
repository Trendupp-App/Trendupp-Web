// lib/auth/authStore.ts
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
  brandRepresentative: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
  } | null;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setSession: (accessToken, user) => set({ accessToken, user }),
      clearSession: () => set({ accessToken: null, user: null }),
      updateUser: (patch) => set((s) => ({ user: s.user ? { ...s.user, ...patch } : null })),
    }),
    {
      name: 'trendupp-auth',
      partialize: (s) => ({ accessToken: s.accessToken, user: s.user }),
    },
  ),
);
