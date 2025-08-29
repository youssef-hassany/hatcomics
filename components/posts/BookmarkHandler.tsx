import { useToggleBookmark } from "@/hooks/bookmarks/useToggleBookmark";
import { PostPreview } from "@/types/Post";
import { Bookmark } from "lucide-react";
import React, { useState } from "react";
import ComponentProtector from "../common/ComponentProtector";

const BookmarkHandler = ({ post }: { post: PostPreview }) => {
  const { mutateAsync: toggleBookmark } = useToggleBookmark();
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [optimisticCount, setOptimisticCount] = useState(post._count.bookmarks);

  const handleClick = async () => {
    // Optimistic updates
    const wasBookmarked = isBookmarked;
    setIsBookmarked(!wasBookmarked);
    setOptimisticCount((prev) => (wasBookmarked ? prev - 1 : prev + 1));

    try {
      await toggleBookmark({
        isBookmarked: wasBookmarked,
        postId: post.id,
      });
    } catch (error) {
      // Revert optimistic updates on error
      setIsBookmarked(wasBookmarked);
      setOptimisticCount((prev) => (wasBookmarked ? prev + 1 : prev - 1));
      console.error(error);
    }
  };

  return (
    <ComponentProtector>
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 text-sm transition-colors cursor-pointer disabled:opacity-50 ${
          isBookmarked
            ? "text-orange-500 hover:text-orange-400"
            : "text-zinc-400 hover:text-zinc-500"
        }`}
      >
        <Bookmark
          size={20}
          className={`${isBookmarked ? "fill-current" : ""}`}
        />

        <span className="text-sm">{optimisticCount}</span>
      </button>
    </ComponentProtector>
  );
};

export default BookmarkHandler;
