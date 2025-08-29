import { User } from "@/types/User";
import { useInfiniteQuery } from "@tanstack/react-query";

type BookmarkPost = {
  id: string;
  userId: string;
  title: string;
  content: string;
  isDraft: boolean;
  createdAt: string; // or `Date` if parsed
  updatedAt: string; // or `Date` if parsed
  _count: {
    comments: number;
    likes: number;
    bookmarks: number;
  };
  likes: {
    id: string;
    userId: string;
    postId: string;
    commentId: string | null;
    createdAt: string; // or `Date`
  }[];
  user: User;
};

interface BookmarksResponse {
  status: string;
  data: {
    id: string;
    postId: string;
    userId: string;
    createdAt: string;
    post: BookmarkPost;
    user: User;
    isBookmarked: boolean;
    isLikedByCurrentUser: boolean;
  };
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
}

const getBookmarks = async ({ pageParam = 1 }): Promise<BookmarksResponse> => {
  try {
    const response = await fetch(`/api/bookmarks?page=${pageParam}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useGetBookmarks = () => {
  return useInfiniteQuery({
    queryKey: ["bookmarks"],
    queryFn: getBookmarks,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
