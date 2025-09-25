import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface RoadmapLikeArgs {
  roadmapId: string;
  isLiked: boolean;
}

const toggleRoadmapLike = async ({ roadmapId, isLiked }: RoadmapLikeArgs) => {
  try {
    const response = await fetch(`/api/roadmaps/${roadmapId}/like`, {
      method: isLiked ? "DELETE" : "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to ${isLiked ? "unlike" : "like"} roadmap`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useRoadmapLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["roadmap-like"],
    mutationFn: toggleRoadmapLike,
    onSuccess: (_, variables) => {
      // Update the infinite query cache
      queryClient.setQueriesData({ queryKey: ["roadmaps"] }, (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((roadmap: any) => {
              if (roadmap.id === variables.roadmapId) {
                const newLikeCount = variables.isLiked
                  ? roadmap._count.likes - 1
                  : roadmap._count.likes + 1;

                return {
                  ...roadmap,
                  _count: {
                    ...roadmap._count,
                    likes: newLikeCount,
                  },
                  isLikedByCurrentUser: !variables.isLiked,
                };
              }
              return roadmap;
            }),
          })),
        };
      });

      // update the the bookmark states
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (error, variables) => {
      toast.error(`Failed to ${variables.isLiked ? "unlike" : "like"} roadmap`);
    },
  });
};
