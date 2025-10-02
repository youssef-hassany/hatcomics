"use client";

import React from "react";
import { useBanUser } from "@/hooks/user/useBanUser";
import { useBanUserStore } from "@/store/userBanStore";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { toast } from "sonner";

export const BanUserModal: React.FC = () => {
  const { banUserId, setBanUserId } = useBanUserStore();
  const { mutateAsync, isPending: isLoading } = useBanUser();

  const handleClose = () => {
    if (!isLoading) {
      setBanUserId(null);
    }
  };

  const handleBanUser = async () => {
    if (!banUserId) return;

    try {
      await mutateAsync(banUserId);
      setBanUserId(null);
      toast.success("User banned successfully");
    } catch (error) {
      console.error("Failed to ban user:", error);
      toast.error("Failed to ban user");
    }
  };

  return (
    <Modal isOpen={!!banUserId} onClose={handleClose}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Ban User</h2>
          <p className="text-zinc-400">
            Are you sure you want to ban this user? This action will restrict
            their access to the platform.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            isLoading={isLoading}
            onClick={handleBanUser}
            disabled={isLoading}
            className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-white font-medium transition-all duration-200 focus:outline-none bg-red-600 hover:bg-red-700 ${
              isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            Ban User
          </Button>
        </div>
      </div>
    </Modal>
  );
};
