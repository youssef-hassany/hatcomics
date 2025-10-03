import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Params {
  formData: FormData;
  comicId: string;
  onUploadProgress?: (progress: number) => void;
}

const createThought = async (params: Params) => {
  try {
    const response = await axios.post(
      `/api/comics/${params.comicId}/book-club`,
      params.formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(
              "Upload progress:",
              progress,
              "Loaded:",
              progressEvent.loaded,
              "Total:",
              progressEvent.total
            );
            params.onUploadProgress?.(progress);
          } else {
            console.log("Upload progress (no total):", progressEvent.loaded);
          }
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("error creating thought");
  }
};

export const useCreateThought = (comicId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["book-club", comicId],
    mutationFn: createThought,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["book-club", comicId] }),
  });
};
