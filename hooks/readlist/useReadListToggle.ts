import { useMutation } from "@tanstack/react-query";

interface ReadlistToggleArgs {
  userId: string;
  comicId: string;
  isInReadlist: boolean;
}

const toggleReadlist = async ({
  userId,
  comicId,
  isInReadlist,
}: ReadlistToggleArgs) => {
  try {
    const response = await fetch(
      `/api/user/readlist/${userId}/comic/${comicId}`,
      {
        method: isInReadlist ? "DELETE" : "POST",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to ${isInReadlist ? "remove from" : "add to"} readlist`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useReadlistToggle = () => {
  return useMutation({
    mutationKey: ["readlist-toggle"],
    mutationFn: toggleReadlist,
  });
};
