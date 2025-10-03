"use client";

import { CircleAlert, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteReviewModal from "./DeleteReviewModal";
import { useState } from "react";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import { useBanUserStore } from "@/store/userBanStore";
import { useReportStore } from "@/store/reportStore";
import ComponentProtector from "../common/ComponentProtector";

interface ReviewActionsProps {
  reviewId: string;
  isOwner: boolean;
  onSuccess?: () => void;
  reviewOwnerId: string;
}

const ReviewActions = ({
  reviewId,
  isOwner,
  onSuccess,
  reviewOwnerId,
}: ReviewActionsProps) => {
  const { data: loggedInUser } = useGetLoggedInUser();
  const { setBanUserId } = useBanUserStore();
  const { setReferenceUrl } = useReportStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <ComponentProtector>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-600">
              <MoreHorizontal className="w-5 h-5 text-zinc-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isOwner && (
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
            )}

            {(loggedInUser?.role === "owner" ||
              loggedInUser?.role === "admin") && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setBanUserId(reviewOwnerId);
                }}
                className="text-red-400 hover:text-red-300 hover:bg-zinc-700 cursor-pointer"
              >
                <CircleAlert className="w-4 h-4 mr-2" />
                Ban User
              </DropdownMenuItem>
            )}

            {!isOwner && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setReferenceUrl(`/reviews/${reviewId}`);
                }}
                className="hover:bg-zinc-700 cursor-pointer"
              >
                <CircleAlert className="w-4 h-4 mr-2" />
                Report
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteReviewModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        reviewId={reviewId}
        onSuccess={onSuccess}
      />
    </ComponentProtector>
  );
};

export default ReviewActions;
