import React from "react";
import { Modal } from "../ui/modal";
import { useDeleteRoadmap } from "@/hooks/roadmaps/useDeleteRoadmap";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  roadmapId: string;
}

const DeleteRoadmapModal = ({ isOpen, onClose, roadmapId }: Props) => {
  const router = useRouter();
  const { mutateAsync: deleteRoadmap, isPending: isDeleting } =
    useDeleteRoadmap();

  const handleDelete = async () => {
    try {
      await deleteRoadmap(roadmapId);
      toast.success("Roadmap Deleted Successfully");
      router.replace("/roadmaps");
    } catch (error) {
      console.error(error);
      toast.error("Error Deleting Roadmap");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 overflow-hidden">
        <h3 className="text-lg font-semibold text-white">Delete Roadmap</h3>
        <p className="text-zinc-300">
          Are you sure you want to delete this Roadmap? This action cannot be
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

export default DeleteRoadmapModal;
