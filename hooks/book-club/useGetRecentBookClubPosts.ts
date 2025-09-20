import { ThoughtPreviewResponse } from "@/types/BookClub";
import { useQuery } from "@tanstack/react-query";

const getRecentThoughts = async () => {
  try {
    const response = await fetch("/api/book-club/recent");

    if (!response.ok) throw new Error("error getting latest thoughts");

    const data = await response.json();
    return data.data as ThoughtPreviewResponse[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useGetRecentBookClubPosts = () => {
  return useQuery({
    queryKey: ["recent-book-club"],
    queryFn: () => getRecentThoughts(),
  });
};
