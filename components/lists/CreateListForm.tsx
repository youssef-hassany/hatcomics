"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCreateList } from "@/hooks/lists/useCreateList";
import Toggle from "../ui/toggle";

const CreateListForm = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<"flat" | "numbered">("flat");
  const [image, setImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const { mutateAsync: createList, isPending: isLoading } = useCreateList();

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

  const toggleType = () => {
    const isNumbered = type === "numbered";

    if (isNumbered) {
      setType("flat");
    } else {
      setType("numbered");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      title,
      image: image,
      type,
    };

    try {
      const createdList = await createList(body);

      setTitle("");
      setCoverImage(null);
      toast.success("List Created");
      router.push(`/list/manage/${createdList.id}`);
    } catch (error) {
      console.error("Error Creating List:", error);
      toast.error("Error Creating List, Try Again");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-zinc-800 rounded-lg p-3 md:p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your List title"
              className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Cover Image
            </label>

            {!coverImage ? (
              <div className="relative aspect-[1/1.62] w-[250px] sm:w-[300px] mx-auto">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="border-2 border-dashed border-zinc-600 rounded-lg p-6 text-center hover:border-orange-500 transition-colors h-full flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-zinc-500 mb-2" />
                    <p className="text-zinc-400 mb-1">
                      Click to upload cover image
                    </p>
                    <p className="text-xs text-zinc-500">
                      Recommended: 1:1.6 aspect ratio
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative aspect-[1/1.62] w-[250px] sm:w-[300px] mx-auto bg-zinc-700 rounded-lg overflow-hidden border border-zinc-600">
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

          <Toggle
            checked={type === "numbered"}
            onChange={toggleType}
            label="Numbered List"
          />

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !title.trim()}
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

export default CreateListForm;
