import { create } from "zustand";

interface ModalState {
  // Modal visibility states
  isFollowersModalOpen: boolean;
  isFollowingModalOpen: boolean;

  // Username of the user whose followers/following we're viewing
  username: string;

  // Actions for followers modal
  openFollowersModal: (username: string) => void;
  closeFollowersModal: () => void;

  // Actions for following modal
  openFollowingModal: (username: string) => void;
  closeFollowingModal: () => void;

  // Action to close all modals
  closeAllModals: () => void;
}

export const useFollowModalStore = create<ModalState>((set) => ({
  // Initial state
  isFollowersModalOpen: false,
  isFollowingModalOpen: false,
  username: "",

  // Followers modal actions
  openFollowersModal: (username: string) =>
    set({
      isFollowersModalOpen: true,
      isFollowingModalOpen: false, // Close following modal if open
      username,
    }),

  closeFollowersModal: () =>
    set({
      isFollowersModalOpen: false,
      username: "",
    }),

  // Following modal actions
  openFollowingModal: (username: string) =>
    set({
      isFollowingModalOpen: true,
      isFollowersModalOpen: false, // Close followers modal if open
      username,
    }),

  closeFollowingModal: () =>
    set({
      isFollowingModalOpen: false,
      username: "",
    }),

  // Close all modals
  closeAllModals: () =>
    set({
      isFollowersModalOpen: false,
      isFollowingModalOpen: false,
      username: "",
    }),
}));
