import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUnFollowUser = () => {
  return useMutation({
    mutationKey: ["un-follow"],
    mutationFn: async (followingId: string) => {
      try {
        await fetch(`/api/follow/${followingId}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error(error);
        toast.error("Faild to remove follow from user, please try again");
      }
    },
  });
};
