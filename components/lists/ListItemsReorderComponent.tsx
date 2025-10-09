import React, { useState, useRef } from "react";
import { GripVertical, Check, X, Plus, Trash2 } from "lucide-react";
import { ListEntry } from "@/types/List";
import { useReorderListItems } from "@/hooks/lists/useReorderListItems";
import { toast } from "sonner";
import Link from "next/link";
import DeleteItemFromListModal from "./DeleteItemFromListModal";

interface ListItemsReorderComponentProps {
  items: ListEntry[];
  onCancel: () => void;
  listId: string;
}

const ListItemsReorderComponent: React.FC<ListItemsReorderComponentProps> = ({
  items,
  onCancel,
  listId,
}) => {
  const [selectedItemForDelete, setSelectedItemForDelete] = useState<
    string | null
  >(null);

  const [tempItems, setTempItems] = useState<ListEntry[]>([...items]);
  const [draggedItem, setDraggedItem] = useState<ListEntry | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Desktop drag handlers
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: ListEntry
  ): void => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetItem: ListEntry
  ): void => {
    e.preventDefault();
    reorderItems(draggedItem, targetItem);
  };

  // Touch handlers for mobile
  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    item: ListEntry,
    index: number
  ): void => {
    e.preventDefault();
    setDraggedItem(item);
    setDraggedIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (!draggedItem || draggedIndex === -1) return;

    e.preventDefault();

    const touch = e.touches[0];
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (!containerRect) return;

    const elements = containerRef.current?.querySelectorAll("[data-item-id]");
    if (!elements) return;

    let targetIndex = -1;
    elements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom &&
        index !== draggedIndex
      ) {
        targetIndex = index;
      }
    });

    if (targetIndex !== -1 && targetIndex !== draggedIndex) {
      const newItems = [...tempItems];
      const [removed] = newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, removed);

      const updatedItems = newItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      setTempItems(updatedItems);
      setDraggedIndex(targetIndex);
    }
  };

  const handleTouchEnd = (): void => {
    setDraggedItem(null);
    setDraggedIndex(-1);
  };

  // Common reorder logic
  const reorderItems = (
    draggedItem: ListEntry | null,
    targetItem: ListEntry
  ): void => {
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const draggedIdx = tempItems.findIndex((i) => i.id === draggedItem.id);
    const targetIdx = tempItems.findIndex((i) => i.id === targetItem.id);

    const newItems = [...tempItems];
    const [removed] = newItems.splice(draggedIdx, 1);
    newItems.splice(targetIdx, 0, removed);

    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setTempItems(updatedItems);
    setDraggedItem(null);
  };

  const { mutateAsync: reorder, isPending: isLoading } =
    useReorderListItems(listId);

  const handleSubmitReorder = async () => {
    const updatedOrder = tempItems.map((item) => ({
      entryId: item.id,
      newOrder: item.order,
    }));

    try {
      await reorder({ listId, newOrder: { entryOrders: updatedOrder } });
      toast.success("Item reordered successfully");
      onCancel();
    } catch (error) {
      console.error(error);
      toast.error(error as string);
    }
  };

  return (
    <div className="space-y-4">
      {/* Items List with Drag & Drop */}
      <div ref={containerRef} className="space-y-3">
        {tempItems.map((item, index) => (
          <div
            key={item.id}
            data-item-id={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, item)}
            onTouchStart={(e) => handleTouchStart(e, item, index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`
              bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-xl p-4 border-2 
              shadow-lg transition-all duration-300 cursor-move
              hover:shadow-xl hover:border-orange-500 hover:-translate-y-1
              touch-none select-none
              ${
                draggedItem?.id === item.id
                  ? "opacity-50 scale-95 z-50 border-orange-500"
                  : "border-zinc-600"
              }
            `}
            style={{
              touchAction: "none",
              userSelect: "none",
              WebkitUserSelect: "none",
              WebkitTouchCallout: "none",
            }}
          >
            <div className="flex items-center gap-4">
              {/* Order Number & Drag Handle */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="bg-orange-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                  {index + 1}
                </div>
                <GripVertical className="w-6 h-6 text-orange-300" />
              </div>

              {/* Item Image */}
              {item.image && (
                <div className="relative flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover shadow-md pointer-events-none"
                    draggable={false}
                  />
                </div>
              )}

              {/* Item Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg truncate">
                  {item.title}
                </h3>
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItemForDelete(item.id);
                }}
                className="flex-shrink-0 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors duration-200 cursor-pointer"
                aria-label="Delete item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Link
        href={`/lists/${listId}/add-item`}
        className="w-full flex justify-center items-center gap-3 rounded-xl p-3 bg-orange-600 text-white cursor-pointer"
      >
        <Plus />
        Add Item
      </Link>

      {/* Reorder Controls */}
      <div className="flex flex-col md:flex-row items-center gap-3 p-4 bg-orange-900/30 border border-orange-600 rounded-xl">
        <div className="text-orange-300 text-sm flex-1">
          <span className="hidden sm:inline">
            Drag and drop items to reorder them
          </span>
          <span className="sm:hidden">
            Touch and drag items to reorder them
          </span>
        </div>
        <button
          type="button"
          onClick={handleSubmitReorder}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-4 h-4" />
          {isLoading ? "Saving..." : "Save Order"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>

      <DeleteItemFromListModal
        entryId={selectedItemForDelete}
        isOpen={!!selectedItemForDelete}
        listId={listId}
        onClose={() => setSelectedItemForDelete(null)}
      />
    </div>
  );
};

export default ListItemsReorderComponent;
