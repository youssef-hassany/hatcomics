"use client";

import DraftsModal from "@/components/posts/DarftsModal";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/ui/RichTextEditor";
import ThreadBuilder from "@/components/posts/ThreadBuilder";
import { useCreatePost } from "@/hooks/posts/useCreatePost";
import React, { useState } from "react";
import { toast } from "sonner";
import { FileText, MessageSquare } from "lucide-react";

type EditorMode = "blog" | "thread";

const CreatePostsPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [postId, setPostId] = useState<string | undefined>();
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>("blog");

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
      isDraft: false,
      postId,
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
      isDraft: true,
      postId,
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

  const handleSelectDraft = (
    title: string,
    content: string,
    postId: string
  ) => {
    setTitle(title);
    setContent(content);
    setIsDraftModalOpen(false);
    setPostId(postId);
  };

  const handleEditorModeChange = (mode: EditorMode) => {
    if (content && editorMode !== mode) {
      // Warn user about potential content loss when switching modes
      if (
        confirm(
          "Switching editor modes may affect your content formatting. Continue?"
        )
      ) {
        setEditorMode(mode);
        // Reset content when switching modes to avoid formatting conflicts
        setContent("");
      }
    } else {
      setEditorMode(mode);
    }
  };

  const handleThreadContentChange = (htmlContent: string) => {
    setContent(htmlContent);
  };

  return (
    <div className="min-h-screen bg-zinc-900 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Create Post
              </h1>
              <p className="text-zinc-400">Write and publish your thoughts</p>
            </div>

            <Button
              variant="secondary"
              onClick={() => setIsDraftModalOpen(true)}
            >
              Drafts
            </Button>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-lg p-3 md:p-6 space-y-6">
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

            {/* Editor Mode Toggle */}
            <div className="flex justify-center">
              <div className="w-full p-1 rounded-lg flex justify-evenly mb-2">
                <Button
                  type="button"
                  variant={editorMode !== "blog" ? "secondary" : "primary"}
                  onClick={() => handleEditorModeChange("blog")}
                  className="flex items-center gap-2"
                >
                  <FileText size={16} />
                  Blog
                </Button>

                <Button
                  type="button"
                  variant={editorMode !== "thread" ? "secondary" : "primary"}
                  onClick={() => handleEditorModeChange("thread")}
                  className="flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  Thread
                </Button>
              </div>
            </div>

            {editorMode === "blog" ? (
              <div className="bg-zinc-700 rounded-md border border-zinc-600">
                <RichTextEditor
                  onImageUpload={handleImageUpload}
                  value={content}
                  onChange={setContent}
                  placeholder="Start writing your post..."
                />
              </div>
            ) : (
              <div className="bg-zinc-700 rounded-md border border-zinc-600 py-4 px-1">
                <ThreadBuilder onContentChange={handleThreadContentChange} />
              </div>
            )}
          </div>

          {/* Content Preview (only show for thread mode) */}
          {/* {editorMode === "thread" && content && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">
                HTML Preview
              </label>
              <div className="bg-zinc-900 border border-zinc-600 rounded-md p-3">
                <code className="text-xs text-zinc-300 break-all">
                  {content || "<p>No content generated yet...</p>"}
                </code>
              </div>
            </div>
          )} */}

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

      <DraftsModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        onSelectDraft={handleSelectDraft}
      />
    </div>
  );
};

export default CreatePostsPage;
