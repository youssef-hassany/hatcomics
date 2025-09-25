import { AddEntryRequest } from "@/types/Roadmap";
import { useMutation } from "@tanstack/react-query";

interface Params {
  roadmapId: string;
  entry: AddEntryRequest;
}

const addEntry = async ({ entry, roadmapId }: Params) => {
  try {
    const response = await fetch(`/api/roadmaps/${roadmapId}/entries`, {
      method: "POST",
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error("Error adding Entry to roadmap");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useAddComicToRoadmap = () => {
  return useMutation({
    mutationKey: ["add-comic-to-roadmap"],
    mutationFn: addEntry,
  });
};
