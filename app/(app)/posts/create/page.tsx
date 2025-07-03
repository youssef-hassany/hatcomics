"use client";

import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { useCreatePost } from "@/hooks/posts/useCreatePost";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import React, { useState } from "react";
import { toast } from "sonner";

const CreatePostsPage = () => {
  const { data: loggedInUser } = useGetLoggedInUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isDraft, setIsDraft] = useState(false);

  const { mutateAsync: createPost, isPending: isLoading } = useCreatePost();

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
      userId: loggedInUser?.id as string,
      isDraft: false,
    };

    try {
      await createPost(body);

      setTitle("");
      setContent("");
      toast.success("Post Published, You Got 5 points!");
    } catch (error) {
      console.error("Error publishing post:", error);
      toast.error("Error publishing post, Try Again");
    }
  };

  const handleSaveAsDraft = async () => {
    setIsDraft(true);

    const body = {
      title,
      content,
      userId: loggedInUser?.id as string,
      isDraft: true,
    };

    try {
      await createPost(body);

      toast.success("Content Saved As Draft Successfully");
    } catch (error) {
      console.error("Error publishing post:", error);
      toast.error("Error publishing post, Try Again");
    } finally {
      setIsDraft(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Post</h1>
          <p className="text-zinc-400">Write and publish your thoughts</p>
        </div>

        <div className="bg-zinc-800 rounded-lg p-6 space-y-6">
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
                placeholder="Start writing your post post..."
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
              {isLoading && isDraft === true ? "Saving..." : "Save Draft"}
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isLoading || !title.trim() || !content.trim()}
            >
              {isLoading && isDraft === false ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostsPage;
