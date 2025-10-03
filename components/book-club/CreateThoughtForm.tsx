"use client";

import React, { useState, useRef } from "react";
import { X, ImagePlus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useCreateThought } from "@/hooks/book-club/useCreateThought";
import { Button } from "../ui/button";

interface CreateThoughtFormProps {
  comicId: string;
}

const CreateThoughtForm: React.FC<CreateThoughtFormProps> = ({ comicId }) => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const remainingSlots = 4 - images.length;
    const newImages = files.slice(0, remainingSlots);
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const { mutateAsync: createThought, isPending } = useCreateThought(comicId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("hasSpoiler", hasSpoiler.toString());

      images.forEach((file) => {
        formData.append("images", file);
      });

      console.log("Starting upload...");

      await createThought({
        comicId,
        formData,
        onUploadProgress: (progress) => {
          console.log("Progress update received in form:", progress);
          setUploadProgress(progress);
        },
      });

      console.log("Upload complete");

      // Reset form
      setContent("");
      setImages([]);
      setHasSpoiler(false);
      setUploadProgress(0);

      toast.success("Thought added successfully");
    } catch (error) {
      console.error(error);
      setUploadProgress(0);
      toast.error("Couldn't post, try again");
    }
  };

  const canAddMoreImages = images.length < 4;

  return (
    <div className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden">
      <form onSubmit={handleSubmit} className="p-4">
        {/* Content Textarea */}
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            placeholder="What's on your mind? Share your thoughts..."
            className="w-full bg-zinc-900 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200"
            rows={4}
            disabled={isPending}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-zinc-500">
              {content.length} characters
            </span>
            {content.length > 1000 && (
              <span className="text-xs text-orange-400">
                Long posts are great for detailed discussions!
              </span>
            )}
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <ImagePlus className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-300">
              Images ({images.length}/4)
            </span>
          </div>

          {/* Image Preview Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 lg:h-48 object-cover rounded-lg border border-zinc-600"
                    onClick={() => !isPending && removeImage(index)}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={isPending}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Images Button */}
          {canAddMoreImages && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ImagePlus className="w-4 h-4" />
              Add Images
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isPending}
          />
        </div>

        {/* Upload Progress Bar */}
        {isPending && uploadProgress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-300">Uploading...</span>
              <span className="text-sm text-orange-400 font-medium">
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-orange-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Spoiler Toggle */}
        <div className="mb-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={hasSpoiler}
                onChange={(e) => setHasSpoiler(e.target.checked)}
                className="sr-only"
                disabled={isPending}
              />
              <div
                className={`w-11 h-6 rounded-full transition-colors ${
                  hasSpoiler ? "bg-orange-500" : "bg-zinc-600"
                } ${isPending ? "opacity-50" : ""}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform ${
                    hasSpoiler ? "translate-x-5" : "translate-x-0.5"
                  } translate-y-0.5`}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle
                className={`w-4 h-4 ${
                  hasSpoiler ? "text-orange-400" : "text-zinc-400"
                }`}
              />
              <span className="text-sm text-zinc-300">Contains spoilers</span>
            </div>
          </label>
          {hasSpoiler && (
            <p className="text-xs text-zinc-500 mt-1 ml-14">
              Your post will be marked with a spoiler warning
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-700">
          <Button
            type="submit"
            disabled={!content.trim() || isPending}
            variant={!content.trim() ? "secondary" : "primary"}
            className="px-6 py-2 disabled:cursor-not-allowed font-medium rounded-lg text-sm"
            isLoading={isPending}
          >
            {isPending ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateThoughtForm;
