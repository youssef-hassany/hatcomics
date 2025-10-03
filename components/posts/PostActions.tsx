"use client";

import { MoreHorizontal, Edit, Trash2, CircleAlert } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import { useDeletePost } from "@/hooks/posts/useDeletePost";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import { useBanUserStore } from "@/store/userBanStore";
import { useReportStore } from "@/store/reportStore";
import ComponentProtector from "../common/ComponentProtector";

interface PostActionsProps {
  postId: string;
  onEdit: () => void;
  isOwner: boolean;
  showEdit?: boolean;
  postOwnerId: string;
}

const PostActions = ({
  postId,
  onEdit,
  isOwner,
  showEdit = true,
  postOwnerId,
}: PostActionsProps) => {
  const { data: loggedInUser } = useGetLoggedInUser();
  const { setBanUserId } = useBanUserStore();
  const { setReferenceUrl } = useReportStore();

  const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      await deletePost(postId);
      setShowDeleteModal(false);
      router.push("/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <ComponentProtector>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-600">
              <MoreHorizontal className="w-3 h-3 text-zinc-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {showEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
            )}
            {isOwner && (
              <DropdownMenuItem
                onClick={() => setShowDeleteModal(true)}
                className="text-red-400 focus:text-red-300 focus:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            )}

            {(loggedInUser?.role === "owner" ||
              loggedInUser?.role === "admin") && (
              <DropdownMenuItem
                onClick={() => setBanUserId(postOwnerId)}
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
                  setReferenceUrl(`/posts/${postId}`);
                }}
                className="cursor-pointer"
              >
                <CircleAlert className="w-4 h-4 mr-2" />
                Report
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="space-y-4 overflow-hidden">
          <h3 className="text-lg font-semibold text-white">Delete Post</h3>
          <p className="text-zinc-300">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowDeleteModal(false)}
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
    </ComponentProtector>
  );
};

export default PostActions;
