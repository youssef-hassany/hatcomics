"use client";

import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { useCreateRoadmap } from "@/hooks/roadmaps/useCreateRoadmap";
import React, { useState } from "react";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CreateRoadmapPage = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const { mutateAsync: createRoadmap, isPending: isLoading } =
    useCreateRoadmap();

  const handleCoverImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setImage(file);
    // Create a URL from the file for preview
    const imageUrl = URL.createObjectURL(file);
    setCoverImage(imageUrl);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCoverImageUpload(file);
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      title,
      description,
      image: image,
    };

    try {
      await createRoadmap(body);

      setTitle("");
      setDescription("");
      setCoverImage(null);
      toast.success("Roadmap Created");
      router.push("/roadmaps/draft");
    } catch (error) {
      console.error("Error Creating Roadmap:", error);
      toast.error("Error Creating Roadmap, Try Again");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Create Roadmap
              </h1>
              <p className="text-zinc-400">
                Create and share your Reading roadmap
              </p>
            </div>
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
              placeholder="Enter your roadmap title"
              className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Description
            </label>

            <div className="bg-zinc-700 rounded-md border border-zinc-600">
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Describe your roadmap and learning path..."
              />
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Cover Image
            </label>

            {!coverImage ? (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center hover:border-orange-500 transition-colors">
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-zinc-500 mb-2" />
                    <p className="text-zinc-400 mb-1">
                      Click to upload cover image
                    </p>
                    <p className="text-xs text-zinc-500">
                      Recommended: 21:9 aspect ratio
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-48 bg-zinc-700 rounded-lg overflow-hidden border border-zinc-600">
                <Image
                  src={coverImage}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
                <button
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 bg-zinc-900/80 hover:bg-zinc-900 text-white rounded-full p-1 transition-colors cursor-pointer"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-zinc-900/80 text-zinc-300 text-xs px-2 py-1 rounded">
                  <ImageIcon className="h-3 w-3 inline mr-1" />
                  Cover Image
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !title.trim() || !description.trim()}
              isLoading={isLoading}
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoadmapPage;
