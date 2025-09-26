import {
  useEditor,
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Heading } from "@tiptap/extension-heading";
import { TextAlign } from "@tiptap/extension-text-align";
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
  Link as LinkIcon,
  Link2Off,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  X,
  MoreHorizontal,
  Languages,
} from "lucide-react";
import { DirectionExtension } from "@/lib/extensions";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

// Custom React NodeView for Image with remove button overlay
const ImageWithRemove: React.FC<any> = (props) => {
  const { node, editor, getPos } = props;
  const src = node.attrs.src;
  const [showActions, setShowActions] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <NodeViewWrapper className="relative group inline-block my-2">
      <img
        src={src}
        alt=""
        className="rounded-lg max-w-full h-auto cursor-pointer"
        draggable={false}
        onClick={() => setShowActions(!showActions)}
      />

      {/* Desktop hover remove button */}
      <button
        type="button"
        onClick={handleRemove}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-red-500 text-red-600 hover:text-white rounded-full p-1.5 shadow-lg focus:outline-none cursor-pointer hidden md:block"
        title="Remove image"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Mobile action overlay */}
      {showActions && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center md:hidden">
          <div className="bg-zinc-800 rounded-lg p-4 shadow-xl flex gap-3">
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowActions(false);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "format" | "align" | "media"
  >("format");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
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
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      DirectionExtension,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:text-blue-800 underline cursor-pointer",
        },
        validate: (href) => /^https?:\/\//.test(href),
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
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] p-3 prose-zinc`,
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setShowMobileMenu(false);
  };

  const handleImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setShowMobileMenu(false);
  };

  const handleSetLink = () => {
    if (!editor) return;

    const { selection } = editor.state;
    const { from, to } = selection;

    // Check if there's selected text
    if (from === to) {
      alert("Please select some text first to create a link.");
      return;
    }

    const selectedText = editor.state.doc.textBetween(from, to);
    const currentUrl = editor.getAttributes("link").href || "";

    const url = prompt(`Enter URL for "${selectedText}":`, currentUrl);

    if (url === null) return; // User cancelled

    if (url === "") {
      // Remove link
      editor.chain().focus().unsetLink().run();
      return;
    }

    // Validate URL format
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      const fullUrl = `https://${url}`;
      if (confirm(`Use "${fullUrl}" as the URL?`)) {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: fullUrl })
          .run();
      }
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }

    setShowMobileMenu(false);
  };

  const handleUnsetLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
    setShowMobileMenu(false);
  };

  const deleteSelectedImage = () => {
    if (editor && selectedImageNode) {
      editor.chain().focus().deleteSelection().run();
      setSelectedImageNode(null);
    }
  };

  // Get current block direction
  const getCurrentDirection = () => {
    if (!editor) return null;
    const { selection } = editor.state;
    const { $from } = selection;
    return $from.node().attrs.dir || null;
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
    className = "",
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
    className?: string;
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
      } cursor-pointer ${className}`}
    >
      {children}
    </button>
  );

  const MobileSectionButton = ({
    section,
    title,
    isActive,
  }: {
    section: "format" | "align" | "media";
    title: string;
    isActive: boolean;
  }) => (
    <button
      type="button"
      onClick={() => setActiveSection(section)}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
      }`}
    >
      {title}
    </button>
  );

  const currentDirection = getCurrentDirection();

  const renderDesktopToolbar = () => (
    <div className="hidden md:flex border-b border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 p-2 flex-wrap gap-1">
      {/* Direction Controls */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setDirection("ltr").run()}
        isActive={currentDirection === "ltr"}
        title="Set LTR Direction"
        className="border border-zinc-300 dark:border-zinc-600"
      >
        <span className="text-xs font-mono">LTR</span>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setDirection("rtl").run()}
        isActive={currentDirection === "rtl"}
        title="Set RTL Direction"
        className="border border-zinc-300 dark:border-zinc-600"
      >
        <span className="text-xs font-mono">RTL</span>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setDirection(null).run()}
        isActive={currentDirection === null}
        title="Auto Direction"
        className="border border-zinc-300 dark:border-zinc-600"
      >
        <Languages className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

      {/* Text Formatting */}
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

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
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

      {/* Text Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

      {/* Lists */}
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

      {/* Links */}
      <ToolbarButton
        onClick={handleSetLink}
        isActive={editor.isActive("link")}
        title="Add/Edit Link"
      >
        <LinkIcon className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={handleUnsetLink}
        title="Remove Link"
        disabled={!editor.isActive("link")}
      >
        <Link2Off className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

      {/* Media */}
      <ToolbarButton
        onClick={() => fileInputRef.current?.click()}
        title="Upload Image"
        disabled={isUploading || !onImageUpload}
      >
        <ImageIcon className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton onClick={handleImageUrl} title="Insert Image URL">
        <span className="text-xs">IMG</span>
      </ToolbarButton>

      {selectedImageNode && (
        <ToolbarButton
          onClick={deleteSelectedImage}
          title="Delete Selected Image"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </ToolbarButton>
      )}

      <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

      {/* Undo/Redo */}
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

      {isUploading && (
        <div className="flex items-center px-2 text-sm text-zinc-500">
          Uploading...
        </div>
      )}
    </div>
  );

  const renderMobileToolbar = () => (
    <div className="md:hidden border-b border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700">
      {/* Mobile Menu Toggle */}
      <div className="p-2 flex justify-between items-center">
        <div className="flex gap-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().setDirection("ltr").run()}
            isActive={currentDirection === "ltr"}
            title="LTR"
            className="border border-zinc-300 dark:border-zinc-600"
          >
            <span className="text-xs font-mono">LTR</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setDirection("rtl").run()}
            isActive={currentDirection === "rtl"}
            title="RTL"
            className="border border-zinc-300 dark:border-zinc-600"
          >
            <span className="text-xs font-mono">RTL</span>
          </ToolbarButton>
        </div>

        <button
          type="button"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="flex items-center gap-1 px-3 py-1 rounded-md bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300"
        >
          <MoreHorizontal className="w-4 h-4" />
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              showMobileMenu ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="border-t border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800">
          {/* Section Tabs */}
          <div className="p-2 border-b border-zinc-200 dark:border-zinc-600">
            <div className="flex gap-1">
              <MobileSectionButton
                section="format"
                title="Format"
                isActive={activeSection === "format"}
              />
              <MobileSectionButton
                section="align"
                title="Align"
                isActive={activeSection === "align"}
              />
              <MobileSectionButton
                section="media"
                title="Media"
                isActive={activeSection === "media"}
              />
            </div>
          </div>

          {/* Section Content */}
          <div className="p-2">
            {activeSection === "format" && (
              <div className="flex flex-wrap gap-2">
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
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  isActive={editor.isActive("bulletList")}
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  isActive={editor.isActive("orderedList")}
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                  isActive={editor.isActive("blockquote")}
                  title="Quote"
                >
                  <Quote className="w-4 h-4" />
                </ToolbarButton>
              </div>
            )}

            {activeSection === "align" && (
              <div className="flex flex-wrap gap-2">
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  isActive={editor.isActive({ textAlign: "left" })}
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  isActive={editor.isActive({ textAlign: "center" })}
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  isActive={editor.isActive({ textAlign: "right" })}
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4" />
                </ToolbarButton>
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
              </div>
            )}

            {activeSection === "media" && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || !onImageUpload}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Upload Image
                  </button>
                  <button
                    type="button"
                    onClick={handleImageUrl}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    <span className="text-xs">IMG</span>
                    Image URL
                  </button>
                </div>

                {/* Link Controls */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleSetLink}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      editor.isActive("link")
                        ? "bg-orange-500 text-white"
                        : "bg-purple-500 text-white hover:bg-purple-600"
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" />
                    {editor.isActive("link") ? "Edit Link" : "Add Link"}
                  </button>
                  {editor.isActive("link") && (
                    <button
                      type="button"
                      onClick={handleUnsetLink}
                      className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      <Link2Off className="w-4 h-4" />
                      Remove Link
                    </button>
                  )}
                </div>

                {selectedImageNode && (
                  <button
                    type="button"
                    onClick={deleteSelectedImage}
                    className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected
                  </button>
                )}

                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="border border-zinc-300 dark:border-zinc-600 rounded-lg overflow-hidden bg-white dark:bg-zinc-800">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {renderDesktopToolbar()}
      {renderMobileToolbar()}

      <div className="relative">
        <EditorContent editor={editor} className="rich-text-editor" />
        {(!value || value === "") && (
          <div className="absolute top-3 left-3 text-zinc-400 dark:text-zinc-500 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      <div className="px-3 py-2 text-xs text-zinc-500 border-t border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700">
        💡 Tip: Select text first, then click the link button to create URLs.
        Use LTR/RTL buttons to set direction per paragraph.
      </div>
    </div>
  );
};

export default RichTextEditor;
