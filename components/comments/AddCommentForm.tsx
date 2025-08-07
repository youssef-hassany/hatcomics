"use client";

import { useCreateComment } from "@/hooks/comments/useCreateComment";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import { Image, Send, X } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "../ui/button";
import ComponentProtector from "../common/ComponentProtector";

interface AddCommentFormProps {
  postId: string;
}

const AddCommentForm = ({ postId }: AddCommentFormProps) => {
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
      await createCommentMutation.mutateAsync({ postId, formData });
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
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <p className="text-zinc-400 text-center">
          Please sign in to leave a comment.
        </p>
      </div>
    );
  }

  return (
    <ComponentProtector>
      <div className="bg-zinc-900 rounded-xl border border-zinc-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <img
              src={loggedInUser.photo || "/placeholder-avatar.png"}
              alt={loggedInUser.fullname}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-zinc-100">
                {loggedInUser.fullname}
              </p>
              <p className="text-sm text-zinc-500">@{loggedInUser.username}</p>
            </div>
          </div>

          {/* Comment Input */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your comment..."
              className="w-full min-h-[100px] p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={createCommentMutation.isPending}
            />
          </div>

          {/* Attachment Preview */}
          {previewUrl && (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Attachment preview"
                className="max-w-full h-auto rounded-lg max-h-48 object-cover"
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

          {/* Actions */}
          <div className="flex items-center gap-4">
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
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
                variant="secondary"
              >
                <Image className="w-4 h-4" />
                <span className="hidden md:block">Add Image</span>
              </Button>
            </div>

            <button
              type="submit"
              disabled={!content.trim() || createCommentMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg transition-colors"
            >
              {createCommentMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden md:block">
                {createCommentMutation.isPending
                  ? "Posting..."
                  : "Post Comment"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </ComponentProtector>
  );
};

export default AddCommentForm;
