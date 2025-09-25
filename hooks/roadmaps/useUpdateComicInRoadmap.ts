import { AddEntryRequest } from "@/types/Roadmap";
import { useMutation } from "@tanstack/react-query";

interface UpdateParams {
  roadmapId: string;
  entryId: string;
  entry: AddEntryRequest;
}

const updateEntry = async ({ entry, roadmapId, entryId }: UpdateParams) => {
  try {
    const response = await fetch(
      `/api/roadmaps/${roadmapId}/entries/${entryId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error updating entry in roadmap");
    }

    return await response.json();
  } catch (error) {
    console.error("Update entry error:", error);
    throw error;
  }
};

export const useUpdateComicInRoadmap = () => {
  return useMutation({
    mutationKey: ["update-comic-in-roadmap"],
    mutationFn: updateEntry,
  });
};
