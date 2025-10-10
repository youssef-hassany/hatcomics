"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon, ArrowUpDown, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUpdateList } from "@/hooks/lists/useUpdateList";
import { useGetList } from "@/hooks/lists/useGetList";
import PageLoadingSpinner from "../ui/PageLoadingSpinner";
import ListItemsReorderComponent from "./ListItemsReorderComponent";
import Toggle from "../ui/toggle";
import Link from "next/link";
import DeleteListModal from "./DeleteListModal";

interface UpdateListFormProps {
  listId: string;
}

const UpdateListForm = ({ listId }: UpdateListFormProps) => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [type, setType] = useState<"flat" | "numbered">("flat");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: listData, isLoading: isLoadingList } = useGetList(listId);
  const { mutateAsync: updateList, isPending: isUpdating } = useUpdateList();

  // Load existing list data
  useEffect(() => {
    if (listData) {
      setTitle(listData.title || "");
      setCoverImage(listData.image || null);
      setType(listData.type);
    }
  }, [listData]);

  const handleCoverImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setImage(file);
    // Create a URL from the file for preview
    const imageUrl = URL.createObjectURL(file);
    setCoverImage(imageUrl);
    setHasChanges(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCoverImageUpload(file);
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setImage(null);
    setHasChanges(true);
  };

  const toggleType = () => {
    const isNumbered = type === "numbered";

    if (isNumbered) {
      setType("flat");
      setHasChanges(listData?.type === "numbered");
    } else {
      setType("numbered");
      setHasChanges(listData?.type === "flat");
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }

    const body = {
      listId,
      title,
      image: image,
      type,
    };

    try {
      await updateList(body);
      setHasChanges(false);
      toast.success("List Updated Successfully");
      router.push(`/lists/${listId}`);
    } catch (error) {
      console.error("Error Updating List:", error);
      toast.error("Error Updating List, Try Again");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleCancelReorder = () => {
    setIsReordering(false);
  };

  if (isLoadingList) {
    return <PageLoadingSpinner />;
  }

  // Show reordering view
  if (isReordering && listData?.entries) {
    return (
      <div className="min-h-screen bg-zinc-900 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-800 rounded-lg p-3 md:p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Reorder List Items
            </h2>
            <ListItemsReorderComponent
              items={listData.entries.map((entry) => ({
                ...entry,
                order: entry.order || 0,
              }))}
              onCancel={handleCancelReorder}
              listId={listData.id}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show normal edit view
  return (
    <div className="min-h-screen bg-zinc-900 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-zinc-800 rounded-lg p-3 md:p-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Update List</h2>
            {hasChanges && (
              <span className="text-xs text-orange-500">● Unsaved changes</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
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

          {/* Reorder Items Button */}
          {listData?.entries && listData.entries.length > 1 ? (
            <div className="border-t border-zinc-700 pt-6">
              <Button
                onClick={() => setIsReordering(true)}
                variant="outline"
                className="w-full bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600 hover:border-orange-500"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Manage List Items ({listData.entries.length})
              </Button>
            </div>
          ) : (
            <div className="border-t border-zinc-700 pt-6">
              <Link
                href={`/lists/${listId}/add-item`}
                className="w-full bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600 hover:border-orange-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Link>
            </div>
          )}

          <div className="flex justify-center gap-3 pt-4">
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isUpdating}
              className="bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Delete List
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isUpdating || !title.trim() || !hasChanges}
              isLoading={isUpdating}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <DeleteListModal
        isOpen={isDeleteOpen}
        listId={listId}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
};

export default UpdateListForm;
