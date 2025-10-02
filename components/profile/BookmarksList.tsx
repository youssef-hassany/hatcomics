import React, { useEffect, useCallback } from "react";
import { Loader2, BookmarkX } from "lucide-react";
import { useGetBookmarks } from "@/hooks/bookmarks/useGetBookmarks";
import PostCardSkeleton from "../posts/PostCardSkeleton";
import PostCard from "../posts/PostCard";

const BookmarksList: React.FC = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useGetBookmarks();

  // Handle scroll pagination
  const handleScroll = useCallback(() => {
    // Check if we're near the bottom of the page
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.offsetHeight;
    const threshold = 1000; // Trigger when 1000px from bottom

    if (
      scrollPosition >= documentHeight - threshold &&
      hasNextPage &&
      !isFetchingNextPage &&
      status === "success"
    ) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, status]);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Handle loading state
  if (status === "pending") {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Handle error state
  if (status === "error") {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <BookmarkX size={48} className="mx-auto mb-2" />
          <p className="text-lg font-medium">Failed to load bookmarks</p>
          <p className="text-sm text-zinc-400 mt-1">
            {error?.message || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  // Get all posts from all pages
  const bookmarks = data?.pages.flatMap((page) => page.data) || [];

  // Handle empty state
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-zinc-400 mb-4">
          <BookmarkX size={48} className="mx-auto mb-2" />
          <p className="text-lg font-medium">No bookmarks yet</p>
          <p className="text-sm mt-1">
            Posts you bookmark will appear here for easy access later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Render all posts */}
      {bookmarks.map((bookmark) => (
        <PostCard
          key={bookmark.post.id}
          post={{
            id: bookmark.post.id,
            title: bookmark.post.title,
            user: {
              id: bookmark.post.id,
              fullname: bookmark.post.user.fullname,
              username: bookmark.post.user.username,
              photo: bookmark.post.user.photo,
              points: bookmark.post.user.points,
              role: bookmark.post.user.role,
              email: bookmark.post.user.email,
              isBanned: false,
            },
            likes: bookmark.post.likes || [],
            isLikedByCurrentUser: bookmark.isLikedByCurrentUser,
            isBookmarked: true, // Since these are bookmarked posts
            _count: bookmark.post._count || {
              bookmarks: 0,
              likes: 0,
              comments: 0,
            },
          }}
        />
      ))}

      {/* Loading indicator for infinite scroll */}
      {isFetchingNextPage && (
        <div className="text-center py-6">
          <div className="flex items-center justify-center text-zinc-400">
            <Loader2 className="animate-spin mr-2" size={20} />
            <span>Loading more bookmarks...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarksList;
