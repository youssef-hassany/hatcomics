import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreatePayload {
  title: string;
  description: string;
  image: File | null;
}

const createRoadmap = async (payload: CreatePayload) => {
  const { description, title, image } = payload;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  if (image) {
    formData.append("image", image);
  }

  try {
    const response = await fetch("/api/roadmaps/create", {
      body: formData,
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("error creating roadmap");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useCreateRoadmap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-roadmap"],
    mutationFn: createRoadmap,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roadmaps-draft"],
      });
      queryClient.invalidateQueries({
        queryKey: ["roadmaps"],
      });
    },
  });
};
