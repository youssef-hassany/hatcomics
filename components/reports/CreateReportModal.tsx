"use client";

import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useReportStore } from "@/store/reportStore";
import { useCreateReport } from "@/hooks/reports/reports";

export const CreateReportModal: React.FC = () => {
  const { referenceUrl, setReferenceUrl } = useReportStore();
  const { mutateAsync, isPending: isLoading } = useCreateReport();
  const [description, setDescription] = useState("");

  const handleClose = () => {
    if (!isLoading) {
      setReferenceUrl(null);
    }
  };

  const handleCreateReport = async () => {
    if (!referenceUrl) return;

    try {
      await mutateAsync({ referenceUrl, description });
      setReferenceUrl(null);
      toast.success("Report sent successfully");
    } catch (error) {
      console.error("Failed to send report:", error);
      toast.error("Failed to send report");
    }
  };

  return (
    <Modal isOpen={!!referenceUrl} onClose={handleClose}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Report Content</h2>
        </div>

        <div className="space-y-2">
          <label className="block font-medium">
            Report Description (optional)
          </label>
          <input
            name="name"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
            disabled={isLoading}
            placeholder="what issue do you have with this content?"
          />
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
            onClick={handleCreateReport}
            disabled={isLoading}
          >
            Report
          </Button>
        </div>
      </div>
    </Modal>
  );
};
