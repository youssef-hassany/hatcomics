import React from "react";
import { Plus, GripVertical, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { RoadmapEntry } from "@/types/Roadmap";

interface ComicsGridProps {
  comics: RoadmapEntry[];
  onReorderClick: () => void;
  roadmapId: string;
  onEditComic?: (comic: RoadmapEntry) => void;
  onDeleteComic?: (comicId: string) => void;
}

const ComicsReorderGrid: React.FC<ComicsGridProps> = ({
  comics,
  onReorderClick,
  roadmapId,
  onEditComic,
  onDeleteComic,
}) => {
  const handleEditClick = (e: React.MouseEvent, comic: RoadmapEntry) => {
    e.preventDefault();
    e.stopPropagation();
    onEditComic?.(comic);
  };

  const handleDeleteClick = (e: React.MouseEvent, comic: RoadmapEntry) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteComic?.(comic.id);
  };

  return (
    <div className="space-y-4">
      {/* Header with Comics Count and Reorder Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-200">
          Comics ({comics.length})
        </h3>
        {comics.length > 0 && (
          <button
            type="button"
            onClick={onReorderClick}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg transition-colors duration-200 border border-zinc-600"
          >
            <GripVertical className="w-4 h-4" />
            Reorder Comics
          </button>
        )}
      </div>

      {/* Comics Display */}
      {comics.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {comics.map((comic) => (
            <div
              key={comic.id}
              className="group relative bg-zinc-700 rounded-xl overflow-hidden border-2 border-zinc-600 hover:border-zinc-500 transition-all duration-300"
            >
              {/* Action Buttons - Edit and Delete */}
              <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => handleEditClick(e, comic)}
                  className="bg-orange-600 hover:bg-orange-700 text-white p-1.5 rounded-full transition-colors duration-200 shadow-lg cursor-pointer"
                  title="Edit comic"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => handleDeleteClick(e, comic)}
                  className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full transition-colors duration-200 shadow-lg cursor-pointer"
                  title="Delete comic"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={comic.image ? comic.image : comic.comic?.image}
                  alt={comic.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-3">
                <h4 className="text-sm font-medium text-zinc-200 truncate">
                  {comic.title}
                </h4>
              </div>
            </div>
          ))}

          {/* Add Comic Button */}
          <Link
            href={`/roadmaps/${roadmapId}/add-comic/${comics.length + 1}`}
            className="group aspect-[2/3] bg-gradient-to-br from-orange-600/20 to-orange-500/20 border-2 border-dashed border-orange-500/50 rounded-xl flex flex-col items-center justify-center hover:from-orange-600/30 hover:to-orange-500/30 hover:border-orange-400 transition-all duration-300 cursor-pointer"
          >
            <div className="bg-orange-600 rounded-full p-3 mb-3 group-hover:scale-110 transition-transform duration-200">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-orange-300 font-medium text-sm text-center px-2">
              Add Comic
            </span>
          </Link>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 border-2 border-dashed border-zinc-600 rounded-xl">
          <div className="text-zinc-400 mb-4">No comics added yet</div>
          <Link
            href={`/roadmaps/${roadmapId}/add-comic/${comics.length + 1}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Your First Comic
          </Link>
        </div>
      )}
    </div>
  );
};

export default ComicsReorderGrid;
