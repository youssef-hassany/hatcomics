import { ComicPreview } from "@/types/Comic";
import { useQuery } from "@tanstack/react-query";

interface ComicsFilters {
  character?: string;
  publisher?: string;
  isBeginnerFriendly?: boolean;
  longevity?: "short" | "medium" | "long";
}

const fetchComicsList = async (filters: ComicsFilters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.character) params.append("character", filters.character);
    if (filters.publisher) params.append("publisher", filters.publisher);
    if (filters.isBeginnerFriendly !== undefined)
      params.append(
        "isBeginnerFriendly",
        filters.isBeginnerFriendly.toString()
      );
    if (filters.longevity) params.append("longevity", filters.longevity);

    const url = `/api/comics${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data as ComicPreview[];
  } catch (error) {
    console.error(error);
  }
};

export const useGetComicsList = (filters: ComicsFilters = {}) => {
  return useQuery({
    queryKey: ["comics", filters],
    queryFn: () => fetchComicsList(filters),
  });
};
