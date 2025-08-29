"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteReviewModal from "./DeleteReviewModal";
import { useState } from "react";

interface ReviewActionsProps {
  reviewId: string;
  isOwner: boolean;
  onSuccess?: () => void;
}

const ReviewActions = ({
  reviewId,
  isOwner,
  onSuccess,
}: ReviewActionsProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!isOwner) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-600">
              <MoreHorizontal className="w-5 h-5 text-zinc-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              className="text-red-400 focus:text-red-300 focus:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteReviewModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        reviewId={reviewId}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default ReviewActions;
