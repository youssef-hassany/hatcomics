import React, { useState } from "react";
import { GripVertical, Check, X } from "lucide-react";
import { ComicToReOrder } from "@/types/Roadmap";
import { useReorderComics } from "@/hooks/roadmaps/useReorderComics";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface ComicsReorderComponentProps {
  comics: ComicToReOrder[];
  onCancel: () => void;
  roadmapId: string;
}

const ComicsReorderComponent: React.FC<ComicsReorderComponentProps> = ({
  comics,
  onCancel,
  roadmapId,
}) => {
  const [tempComics, setTempComics] = useState<ComicToReOrder[]>([...comics]);
  const [draggedItem, setDraggedItem] = useState<ComicToReOrder | null>(null);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    comic: ComicToReOrder
  ): void => {
    setDraggedItem(comic);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetComic: ComicToReOrder
  ): void => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetComic.id) return;

    const draggedIndex = tempComics.findIndex((c) => c.id === draggedItem.id);
    const targetIndex = tempComics.findIndex((c) => c.id === targetComic.id);

    const newComics = [...tempComics];
    const [removed] = newComics.splice(draggedIndex, 1);
    newComics.splice(targetIndex, 0, removed);

    // Update order property
    const updatedComics = newComics.map((comic, index) => ({
      ...comic,
      order: index + 1,
    }));

    setTempComics(updatedComics);
    setDraggedItem(null);
  };

  const handleCancelReorder = (): void => {
    onCancel();
  };

  const { mutateAsync: reOrderComics, isPending } = useReorderComics(roadmapId);

  const handleSubmitReorder = async () => {
    try {
      let updatedOrder: Array<{
        entryId: string;
        newOrder: number;
      }> = [];

      tempComics.forEach((comic) => {
        updatedOrder = [
          ...updatedOrder,
          { entryId: comic.id, newOrder: comic.order },
        ];
      });

      await reOrderComics({
        roadmapId,
        newOrder: { entryOrders: updatedOrder },
      });
      toast.success("Comic re-ordered successfully");
      onCancel();
    } catch (error) {
      console.error(error);
      toast.error("Error re-ordering Comics, try again");
    }
  };

  return (
    <div className="space-y-4">
      {/* Comics Grid with Drag & Drop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tempComics.map((comic, index) => (
          <div
            key={comic.id}
            draggable
            onDragStart={(e) => handleDragStart(e, comic)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, comic)}
            className={`
              group relative bg-zinc-700 rounded-xl overflow-hidden border-2 transition-all duration-300
              border-orange-500 cursor-move hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25
              ${draggedItem?.id === comic.id ? "opacity-50 scale-95" : ""}
            `}
          >
            {/* Order Number */}
            <div className="absolute top-2 left-2 z-10 bg-orange-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {index + 1}
            </div>

            {/* Comic Image */}
            <div className="aspect-[2/3] overflow-hidden">
              <img
                src={comic.image}
                alt={comic.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Drag Overlay */}
            <div className="absolute inset-0 bg-orange-600/20 flex items-center justify-center">
              <GripVertical className="w-8 h-8 text-orange-300" />
            </div>

            {/* Comic Title */}
            <div className="p-3">
              <h3 className="text-sm font-medium text-zinc-200 truncate">
                {comic.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Reorder Controls */}
      <div className="flex items-center gap-3 p-4 bg-orange-900/30 border border-orange-600 rounded-xl">
        <div className="text-orange-300 text-sm flex-1">
          Drag and drop comics to reorder them
        </div>
        <Button
          isLoading={isPending}
          type="button"
          onClick={handleSubmitReorder}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
        >
          <Check className="w-4 h-4" />
          Save Order
        </Button>
        <button
          type="button"
          onClick={handleCancelReorder}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg transition-colors duration-200 cursor-pointer"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ComicsReorderComponent;
