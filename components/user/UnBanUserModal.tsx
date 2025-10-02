"use client";

import React from "react";
import { useUnBanUser } from "@/hooks/user/useUnBanUser";
import { useBanUserStore } from "@/store/userBanStore";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { toast } from "sonner";

export const UnBanUserModal: React.FC = () => {
  const { unbanUserId, setUnbanUserId } = useBanUserStore();
  const { mutateAsync, isPending: isLoading } = useUnBanUser();

  const handleClose = () => {
    if (!isLoading) {
      setUnbanUserId(null);
    }
  };

  const handleUnBanUser = async () => {
    if (!unbanUserId) return;

    try {
      await mutateAsync(unbanUserId);
      setUnbanUserId(null);
      toast.success("User ban removed successfully");
    } catch (error) {
      console.error("Failed to remove ban from user:", error);
      toast.error("Failed to remove ban from user");
    }
  };

  return (
    <Modal isOpen={!!unbanUserId} onClose={handleClose}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Remove Ban</h2>
          <p className="text-zinc-400">
            Are you sure you want to remove the ban of this user?
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
            onClick={handleUnBanUser}
            disabled={isLoading}
            className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-white font-medium transition-all duration-200 focus:outline-none bg-red-600 hover:bg-red-700 ${
              isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            Remove Ban
          </Button>
        </div>
      </div>
    </Modal>
  );
};
