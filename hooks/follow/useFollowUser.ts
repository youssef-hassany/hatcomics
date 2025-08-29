import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useFollowUser = () => {
  return useMutation({
    mutationKey: ["follow"],
    mutationFn: async (followingId: string) => {
      try {
        await fetch(`/api/follow/${followingId}`, {
          method: "POST",
        });
      } catch (error) {
        console.error(error);
        toast.error("Faild to follow user, please try again");
      }
    },
  });
};
