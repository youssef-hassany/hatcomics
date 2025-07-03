"use client";

import { Modal } from "@/components/ui/modal";
import { useDeleteReview } from "@/hooks/reviews/useDeleteReview";

interface DeleteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: string;
  onSuccess?: () => void;
}

const DeleteReviewModal = ({
  isOpen,
  onClose,
  reviewId,
  onSuccess,
}: DeleteReviewModalProps) => {
  const { mutateAsync: deleteReview, isPending: isDeleting } =
    useDeleteReview();

  const handleDelete = async () => {
    try {
      await deleteReview(reviewId);
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 overflow-hidden">
        <h3 className="text-lg font-semibold text-white">Delete Review</h3>
        <p className="text-zinc-300">
          Are you sure you want to delete this review? This action cannot be
          undone and you will lose 2 points.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-lg transition-colors"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteReviewModal;
