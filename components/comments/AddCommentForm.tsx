"use client";

import { useCreateComment } from "@/hooks/comments/useCreateComment";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import { Image, Send, X } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "../ui/button";
import ComponentProtector from "../common/ComponentProtector";

interface AddCommentFormProps {
  postId: string;
  commentId?: string;
  addReply?: boolean;
}

const AddCommentForm = ({
  postId,
  commentId = "",
  addReply = false,
}: AddCommentFormProps) => {
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: loggedInUser } = useGetLoggedInUser();
  const createCommentMutation = useCreateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    const formData = new FormData();
    formData.append("content", content);
    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      await createCommentMutation.mutateAsync({ postId, commentId, formData });
      setContent("");
      setAttachment(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!loggedInUser) {
    return (
      <div
        className={`rounded-xl p-4 ${
          addReply
            ? "bg-zinc-800/50 border border-zinc-700/50"
            : "bg-zinc-900 border border-zinc-800 p-6"
        }`}
      >
        <p className="text-zinc-400 text-center text-sm">
          Please sign in to {addReply ? "reply" : "leave a comment"}.
        </p>
      </div>
    );
  }

  // Different styling for replies vs main comments
  const containerClasses = addReply
    ? "bg-zinc-800/30 border border-zinc-700/30 rounded-lg p-4"
    : "bg-zinc-900 rounded-xl border border-zinc-700 p-6";

  const textareaClasses = addReply
    ? "w-full min-h-[80px] p-3 bg-zinc-800/50 border border-zinc-600 rounded-lg text-zinc-100 placeholder-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-sm"
    : "w-full min-h-[100px] p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent";

  return (
    <ComponentProtector>
      <div className={containerClasses}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info - Smaller for replies */}
          <div className="flex items-center gap-3">
            <img
              src={loggedInUser.photo || "/placeholder-avatar.png"}
              alt={loggedInUser.fullname}
              className={`rounded-full ${addReply ? "w-8 h-8" : "w-10 h-10"}`}
            />
            <div>
              <p
                className={`font-semibold text-zinc-100 ${
                  addReply ? "text-sm" : ""
                }`}
              >
                {loggedInUser.fullname}
              </p>
              <p
                className={`text-zinc-500 ${addReply ? "text-xs" : "text-sm"}`}
              >
                @{loggedInUser.username}
              </p>
            </div>
          </div>

          {/* Comment Input */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Write your ${addReply ? "reply" : "comment"}...`}
              className={textareaClasses}
              disabled={createCommentMutation.isPending}
            />
          </div>

          {/* Attachment Preview */}
          {previewUrl && (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Attachment preview"
                className={`w-full h-auto rounded-lg object-cover ${
                  addReply ? "max-h-32" : "max-h-48"
                }`}
              />
              <button
                type="button"
                onClick={removeAttachment}
                className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Actions - Simplified for replies */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-2 text-white hover:text-zinc-300 transition-colors ${
                  addReply ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"
                }`}
              >
                <Image className={addReply ? "w-3 h-3" : "w-4 h-4"} />
                <span
                  className={addReply ? "hidden lg:block" : "hidden md:block"}
                >
                  Add Image
                </span>
              </Button>
            </div>

            <button
              type="submit"
              disabled={!content.trim() || createCommentMutation.isPending}
              className={`flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg transition-colors ${
                addReply ? "px-3 py-1.5 text-sm" : "px-4 py-2"
              }`}
            >
              {createCommentMutation.isPending ? (
                <div
                  className={`border-2 border-white border-t-transparent rounded-full animate-spin ${
                    addReply ? "w-3 h-3" : "w-4 h-4"
                  }`}
                ></div>
              ) : (
                <Send className={addReply ? "w-3 h-3" : "w-4 h-4"} />
              )}
              <span
                className={addReply ? "hidden sm:block" : "hidden md:block"}
              >
                {addReply ? "Reply" : "Add Comment"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </ComponentProtector>
  );
};

export default AddCommentForm;
