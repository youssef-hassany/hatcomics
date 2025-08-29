import { ComicPreview } from "@/types/Comic";
import { useQuery } from "@tanstack/react-query";

interface ReadlistType {
  id: string;
  comicId: string;
  userId: string;
  comic: ComicPreview;
}

const getUserReadlist = async (userId: string) => {
  try {
    const response = await fetch(`/api/user/readlist/${userId}`);
    const data = await response.json();
    return data.data as ReadlistType[];
  } catch (error) {
    console.error(error);
  }
};

export const useGetReadlist = (userId: string) => {
  return useQuery({
    queryKey: ["readlist", userId],
    queryFn: () => getUserReadlist(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
