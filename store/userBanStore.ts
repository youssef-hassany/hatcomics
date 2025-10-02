import { create } from "zustand";

interface BanUserStore {
  banUserId: string | null;
  unbanUserId: string | null;
  setBanUserId: (userId: string | null) => void;
  setUnbanUserId: (userId: string | null) => void;
}

export const useBanUserStore = create<BanUserStore>((set) => ({
  banUserId: null,
  unbanUserId: null,
  setBanUserId: (userId) => set({ banUserId: userId }),
  setUnbanUserId: (userId) => set({ unbanUserId: userId }),
}));
