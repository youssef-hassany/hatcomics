"use client";

import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { useUpdatePost } from "@/hooks/posts/useUpdatePost";
import { Post } from "@/types/Post";
import React, { useState } from "react";
import { toast } from "sonner";

interface EditPostFormProps {
  post: Post;
  onCancel: () => void;
}

const EditPostForm = ({ post, onCancel }: EditPostFormProps) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [isDraft, setIsDraft] = useState(post.isDraft);

  const { mutateAsync: updatePost, isPending: isLoading } = useUpdatePost(
    post.id
  );

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload/posts", {
      method: "POST",
      body: formData,
    });

    const { fileUrl } = await response.json();
    return fileUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      title,
      content,
      isDraft: false,
    };

    try {
      await updatePost(body);
      onCancel();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Error updating post, Try Again");
    }
  };

  const handleSaveAsDraft = async () => {
    setIsDraft(true);

    const body = {
      title,
      content,
      isDraft: true,
    };

    try {
      await updatePost(body);
      toast.success("Post saved as draft successfully");
      onCancel();
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Error saving draft, Try Again");
    } finally {
      setIsDraft(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header Section */}
      <div className="bg-zinc-900 border-b border-zinc-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-zinc-100">Edit Post</h1>
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Form Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden">
          <div className="p-8 lg:p-12 space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title"
                className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Content
              </label>
              <div className="bg-zinc-700 rounded-md border border-zinc-600">
                <RichTextEditor
                  onImageUpload={handleImageUpload}
                  value={content}
                  onChange={setContent}
                  placeholder="Start writing your post..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                type="button"
                onClick={handleSaveAsDraft}
                disabled={isLoading || !title.trim() || !content.trim()}
              >
                {isLoading && isDraft ? "Saving..." : "Save Draft"}
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isLoading || !title.trim() || !content.trim()}
              >
                {isLoading && !isDraft ? "Updating..." : "Update Post"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostForm;
