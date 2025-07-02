import {
  useEditor,
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Heading } from "@tiptap/extension-heading";
import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Type,
  Heading1,
  Heading2,
  ImageIcon,
  Link,
  Trash2,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>; // Returns the uploaded image URL
}

// Custom React NodeView for Image with remove button overlay
const ImageWithRemove: React.FC<any> = (props) => {
  const { node, editor, getPos } = props;
  const src = node.attrs.src;

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof getPos === "function") {
      const pos = getPos();
      if (typeof pos === "number") {
        editor
          .chain()
          .focus()
          .deleteRange({ from: pos, to: pos + node.nodeSize })
          .run();
      }
    }
  };

  return (
    <NodeViewWrapper className="relative group inline-block">
      <img
        src={src}
        alt=""
        className="rounded-lg max-w-full h-auto"
        draggable={false}
      />
      <button
        type="button"
        onClick={handleRemove}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-red-500 text-red-600 hover:text-white rounded-full p-1 shadow focus:outline-none cursor-pointer"
        title="Remove image"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </NodeViewWrapper>
  );
};

const RichTextEditor: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Start typing...",
  onImageUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImageNode, setSelectedImageNode] = useState<any>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // Disable default heading
      }),
      Heading.extend({
        renderHTML({ node, HTMLAttributes }) {
          const level = node.attrs.level;
          return [
            `h${level}`,
            {
              ...HTMLAttributes,
              class: `heading-${level}`,
            },
            0,
          ];
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto cursor-pointer",
        },
      }).extend({
        addNodeView() {
          return ReactNodeViewRenderer(ImageWithRemove);
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      // Check if an image is selected
      const { selection } = editor.state;
      const node = selection.$from.node();
      if (node?.type.name === "image") {
        setSelectedImageNode(node);
      } else {
        setSelectedImageNode(null);
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] p-3 prose-zinc",
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            handleImageUpload(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (const item of items) {
            if (item.type.startsWith("image/")) {
              const file = item.getAsFile();
              if (file) {
                handleImageUpload(file);
                return true;
              }
            }
          }
        }
        return false;
      },
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  const handleImageUpload = async (file: File) => {
    if (!editor || !onImageUpload) return;

    try {
      setIsUploading(true);
      const imageUrl = await onImageUpload(file);

      // Insert image at current cursor position
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const deleteSelectedImage = () => {
    if (editor && selectedImageNode) {
      editor.chain().focus().deleteSelection().run();
      setSelectedImageNode(null);
    }
  };

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    title,
    disabled = false,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      disabled={disabled}
      className={`p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive
          ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
          : "text-zinc-600 dark:text-zinc-400"
      } cursor-pointer`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-zinc-300 dark:border-zinc-600 rounded-lg overflow-hidden bg-white dark:bg-zinc-800">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="border-b border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 p-2 flex flex-wrap gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive("paragraph")}
          title="Paragraph"
        >
          <Type className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

        {/* Image Upload Button */}
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          title="Upload Image"
          disabled={isUploading || !onImageUpload}
        >
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>

        {/* Image URL Button */}
        <ToolbarButton onClick={handleImageUrl} title="Insert Image URL">
          <Link className="w-4 h-4" />
        </ToolbarButton>

        {/* Delete Image Button (only show when image is selected) */}
        {selectedImageNode && (
          <ToolbarButton
            onClick={deleteSelectedImage}
            title="Delete Selected Image"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </ToolbarButton>
        )}

        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>

        {/* Upload status */}
        {isUploading && (
          <div className="flex items-center px-2 text-sm text-zinc-500">
            Uploading...
          </div>
        )}
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} className="rich-text-editor" />
        {(!value || value === "") && (
          <div className="absolute top-3 left-3 text-zinc-400 dark:text-zinc-500 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="px-3 py-2 text-xs text-zinc-500 border-t border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700">
        💡 Tip: You can also drag & drop images or paste them directly into the
        editor.
      </div>
    </div>
  );
};

export default RichTextEditor;
