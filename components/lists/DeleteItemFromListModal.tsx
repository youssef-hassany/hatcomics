import React from "react";
import { Modal } from "../ui/modal";
import { toast } from "sonner";
import { useDeleteItemFromList } from "@/hooks/lists/useDeleteItemFromList";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  entryId: string | null;
}

const DeleteItemFromListModal = ({
  isOpen,
  onClose,
  listId,
  entryId,
}: Props) => {
  const { mutateAsync: removeComic, isPending: isDeleting } =
    useDeleteItemFromList();

  if (!entryId) return;

  const handleDelete = async () => {
    try {
      await removeComic({ listId, entryId });
      toast.success("Comic Removed Successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error Removing Comic");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 overflow-hidden">
        <h3 className="text-lg font-semibold text-white">Remove Item</h3>
        <p className="text-zinc-300">
          Are you sure you want to remove this item? This action cannot be
          undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
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

export default DeleteItemFromListModal;
