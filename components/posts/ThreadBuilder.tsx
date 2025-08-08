import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Image as ImageIcon, Trash2 } from "lucide-react";

interface ThreadBlock {
  id: string;
  text: string;
  imageFile?: File;
  imageUrl?: string;
  previewUrl?: string;
}

interface ThreadBuilderProps {
  onContentChange: (htmlContent: string) => void;
}

const ThreadBuilder: React.FC<ThreadBuilderProps> = ({ onContentChange }) => {
  const [blocks, setBlocks] = useState<ThreadBlock[]>([{ id: "1", text: "" }]);
  const [uploadingBlocks, setUploadingBlocks] = useState<Set<string>>(
    new Set()
  );

  const addBlock = () => {
    const newBlock: ThreadBlock = {
      id: Date.now().toString(),
      text: "",
    };
    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    generateHtmlContent(updatedBlocks);
  };

  const uploadImage = async (blockId: string, file: File) => {
    setUploadingBlocks((prev) => new Set(prev).add(blockId));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/posts", {
        method: "POST",
        body: formData,
      });

      const { fileUrl } = await response.json();

      const updatedBlocks = blocks.map((block) =>
        block.id === blockId
          ? { ...block, imageUrl: fileUrl, imageFile: file }
          : block
      );

      setBlocks(updatedBlocks);
      generateHtmlContent(updatedBlocks);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingBlocks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(blockId);
        return newSet;
      });
    }
  };

  const handleFileChange = (blockId: string, file: File) => {
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    const updatedBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, imageFile: file, previewUrl } : block
    );

    setBlocks(updatedBlocks);

    // Upload the image
    uploadImage(blockId, file);
  };

  const updateTextBlock = (blockId: string, text: string) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, text } : block
    );
    setBlocks(updatedBlocks);
    generateHtmlContent(updatedBlocks);
  };

  const removeImage = (blockId: string) => {
    const updatedBlocks = blocks.map((block) => {
      if (block.id === blockId) {
        // Revoke preview URL to prevent memory leaks
        if (block.previewUrl) {
          URL.revokeObjectURL(block.previewUrl);
        }
        return {
          ...block,
          imageFile: undefined,
          imageUrl: undefined,
          previewUrl: undefined,
        };
      }
      return block;
    });

    setBlocks(updatedBlocks);
    generateHtmlContent(updatedBlocks);
  };

  const removeBlock = (blockId: string) => {
    if (blocks.length === 1) return; // Don't remove the last block

    // Revoke preview URL before removing
    const blockToRemove = blocks.find((block) => block.id === blockId);
    if (blockToRemove?.previewUrl) {
      URL.revokeObjectURL(blockToRemove.previewUrl);
    }

    const updatedBlocks = blocks.filter((block) => block.id !== blockId);
    setBlocks(updatedBlocks);
    generateHtmlContent(updatedBlocks);
  };

  const generateHtmlContent = (currentBlocks: ThreadBlock[]) => {
    const htmlContent = currentBlocks
      .filter((block) => block.text.trim() !== "" || block.imageUrl)
      .map((block) => {
        let html = "";

        if (block.text.trim() !== "") {
          html += `<p>${block.text.trim()}</p>`;
        }

        if (block.imageUrl) {
          html += `<img src="${block.imageUrl}" alt="Thread image" />`;
        }

        html += `<br />`;

        return html;
      })
      .join("");

    onContentChange(htmlContent);
  };

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <ThreadBlockComponent
          key={block.id}
          block={block}
          index={index}
          totalBlocks={blocks.length}
          onTextChange={(text) => updateTextBlock(block.id, text)}
          onFileChange={(file) => handleFileChange(block.id, file)}
          onRemoveImage={() => removeImage(block.id)}
          onRemoveBlock={() => removeBlock(block.id)}
          isUploading={uploadingBlocks.has(block.id)}
        />
      ))}

      {/* Add Block Button */}
      <div className="flex justify-center pt-2">
        <Button
          type="button"
          onClick={addBlock}
          className="w-12 h-12 rounded-full"
        >
          <Plus size={20} />
        </Button>
      </div>
    </div>
  );
};

interface ThreadBlockComponentProps {
  block: ThreadBlock;
  index: number;
  totalBlocks: number;
  onTextChange: (text: string) => void;
  onFileChange: (file: File) => void;
  onRemoveImage: () => void;
  onRemoveBlock: () => void;
  isUploading: boolean;
}

const ThreadBlockComponent: React.FC<ThreadBlockComponentProps> = ({
  block,
  index,
  totalBlocks,
  onTextChange,
  onFileChange,
  onRemoveImage,
  onRemoveBlock,
  isUploading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  const getImageSrc = () => {
    if (block.imageUrl) return block.imageUrl;
    if (block.previewUrl) return block.previewUrl;
    return null;
  };

  return (
    <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6 relative group">
      {/* Block number and remove button */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-zinc-500 font-medium">
          Thread {index + 1}
        </span>

        {totalBlocks > 1 && (
          <Button
            type="button"
            onClick={onRemoveBlock}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 p-1 h-auto"
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>

      {/* Text Input */}
      <div className="relative mb-4">
        <textarea
          value={block.text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={`What's happening ?`}
          className="w-full min-h-[100px] p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Image Preview */}
      {(getImageSrc() || isUploading) && (
        <div className="relative mb-4">
          {isUploading ? (
            <div className="flex items-center justify-center p-8 bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-600">
              <div className="text-center">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <span className="text-zinc-400 text-sm">
                  Uploading image...
                </span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={getImageSrc()!}
                alt="Thread attachment"
                className="max-w-full h-auto rounded-lg max-h-48 object-cover"
              />
              <button
                type="button"
                onClick={onRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {!getImageSrc() && !isUploading && (
        <div className="flex items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 p-2"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden md:block text-sm">Add Image</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ThreadBuilder;
