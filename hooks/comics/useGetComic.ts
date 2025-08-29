import { ComicPreview } from "@/types/Comic";
import { useQuery } from "@tanstack/react-query";

const getComicById = async (comicId: string) => {
  try {
    const response = await fetch(`/api/comics/${comicId}`);
    const data = await response.json();
    return data.data as ComicPreview;
  } catch (error) {
    console.error(error);
  }
};

export const useGetComic = (comicId: string) => {
  return useQuery({
    queryKey: [comicId],
    queryFn: () => getComicById(comicId),
  });
};
