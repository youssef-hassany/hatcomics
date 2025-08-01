import { useToggleBookmark } from "@/hooks/bookmarks/useToggleBookmark";
import { PostPreview } from "@/types/Post";
import { Bookmark } from "lucide-react";
import React from "react";

const BookmarkHandler = ({ post }: { post: PostPreview }) => {
  const { mutateAsync: toggleBookmark, isPending } = useToggleBookmark();

  const handleClick = async () => {
    try {
      await toggleBookmark({
        isBookmarked: post.isBookmarked,
        postId: post.id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-2 text-sm transition-colors cursor-pointer ${
        post.isBookmarked
          ? "text-orange-500 hover:text-orange-400"
          : "text-zinc-400 hover:text-zinc-500"
      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isPending ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <Bookmark
          size={20}
          className={`${post.isBookmarked ? "fill-current" : ""}`}
        />
      )}
      <span className="text-sm">{post._count.bookmarks}</span>
    </button>
  );
};

export default BookmarkHandler;
