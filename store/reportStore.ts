import { create } from "zustand";

interface BanUserStore {
  referenceUrl: string | null;
  setReferenceUrl: (referenceUrl: string | null) => void;
}

export const useReportStore = create<BanUserStore>((set) => ({
  referenceUrl: null,
  setReferenceUrl: (referenceUrl) => set({ referenceUrl: referenceUrl }),
}));
