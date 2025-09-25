import { Heart } from "lucide-react";
import React, { useState } from "react";
import ComponentProtector from "../common/ComponentProtector";
import { useRoadmapLike } from "@/hooks/roadmaps/useRoadmapLike";
import { RoadmapType } from "@/types/Roadmap";

const RoadmapLikeHandler: React.FC<{ roadmap: RoadmapType }> = ({
  roadmap,
}) => {
  const { mutateAsync: toggleLike } = useRoadmapLike();

  const [isLiked, setIsLiked] = useState(roadmap.isLikedByCurrentUser || false);
  const [optimisticCount, setOptimisticCount] = useState(
    roadmap._count.likes || 0
  );

  const handleLike = async () => {
    // Optimistic updates
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setOptimisticCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      await toggleLike({
        roadmapId: roadmap.id,
        isLiked: wasLiked, // Pass the original state
      });
    } catch (error) {
      // Revert optimistic updates on error
      setIsLiked(wasLiked);
      setOptimisticCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <ComponentProtector>
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 text-sm transition-colors cursor-pointer ${
          isLiked
            ? "text-orange-500 hover:text-orange-400"
            : "text-zinc-400 hover:text-zinc-500"
        }`}
      >
        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        <span>{optimisticCount}</span>
      </button>
    </ComponentProtector>
  );
};

export default RoadmapLikeHandler;
