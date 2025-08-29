import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Image as ImageIcon } from "lucide-react";

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
    <div className="space-y-3 md:space-y-4">
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
      <div className="flex justify-center pt-3">
        <Button
          type="button"
          onClick={addBlock}
          style={{ padding: "1rem", borderRadius: "50%" }}
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
    <div className="bg-zinc-800/50 rounded-lg border border-zinc-700/50 p-3 md:p-4 relative group">
      {/* Block number and remove button */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-zinc-400 font-medium">
          Thread {index + 1}
        </span>

        {totalBlocks > 1 && (
          <Button
            type="button"
            onClick={onRemoveBlock}
            style={{ padding: "0.5rem", borderRadius: "50%" }}
          >
            <X size={12} />
          </Button>
        )}
      </div>

      {/* Text Input */}
      <div className="mb-3">
        <textarea
          value={block.text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={`What's happening?`}
          className="w-full min-h-[80px] md:min-h-[100px] p-3 bg-transparent border border-zinc-600/50 rounded-md text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-colors"
        />
      </div>

      {/* Image Preview */}
      {(getImageSrc() || isUploading) && (
        <div className="mb-3">
          {isUploading ? (
            <div className="flex items-center justify-center p-6 md:p-8 bg-zinc-900/30 rounded-md border border-dashed border-zinc-600">
              <div className="text-center">
                <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <span className="text-zinc-400 text-sm">Uploading...</span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={getImageSrc()!}
                alt="Thread attachment"
                className="max-w-full h-auto rounded-md max-h-40 md:max-h-48 object-cover"
              />
              <button
                type="button"
                onClick={onRemoveImage}
                className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors backdrop-blur-sm"
              >
                <X className="w-3 h-3 md:w-4 md:h-4" />
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
            className="flex items-center gap-2 hover:bg-zinc-700/50 h-8 px-2"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Add Image</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ThreadBuilder;
