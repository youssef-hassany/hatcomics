import React from "react";
import { Modal } from "../ui/modal";
import { useGetUserDrafts } from "@/hooks/posts/useGetUserDrafts";
import Draft from "./Draft";
import DraftSkeleton from "./DraftSkeleton";
import { FileText, Edit3 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectDraft: (title: string, content: string, postId: string) => void;
}

const DraftsModal = ({ isOpen, onClose, onSelectDraft }: Props) => {
  const { data: drafts, isLoading, error } = useGetUserDrafts();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col min-h-[400px] max-h-[600px]">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-zinc-800">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
            <Edit3 size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">Your Drafts</h2>
            <p className="text-sm text-zinc-400">
              {drafts?.length
                ? `${drafts.length} draft${drafts.length > 1 ? "s" : ""}`
                : "No drafts yet"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-0">
              {[...Array(3)].map((_, i) => (
                <DraftSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="p-4 rounded-full bg-red-500/10 text-red-400 mb-4">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-medium text-zinc-100 mb-2">
                Failed to load drafts
              </h3>
              <p className="text-sm text-zinc-400 text-center">
                Something went wrong while loading your drafts. Please try
                again.
              </p>
            </div>
          ) : !drafts?.length ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="p-4 rounded-full bg-zinc-800 text-zinc-400 mb-4">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-medium text-zinc-100 mb-2">
                No drafts yet
              </h3>
              <p className="text-sm text-zinc-400 text-center max-w-sm">
                Your draft posts will appear here. Start writing to create your
                first draft!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {drafts.map((draft, index) => (
                <Draft
                  key={draft.id || index}
                  content={draft.content}
                  createdAt={draft.createdAt}
                  title={draft.title}
                  onSelectDraft={onSelectDraft}
                  id={draft.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DraftsModal;
