import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AgeGateState {
  isAgeVerified: boolean;
  verifyAge: () => void;
  resetAgeVerification: () => void;
}

export const useAgeGateStore = create<AgeGateState>()(
  persist(
    (set) => ({
      isAgeVerified: false,
      verifyAge: () => set({ isAgeVerified: true }),
      resetAgeVerification: () => set({ isAgeVerified: false }),
    }),
    {
      name: 'elitebud-age-verification-v1',
    }
  )
);
