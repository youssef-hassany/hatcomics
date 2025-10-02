import { useMutation } from "@tanstack/react-query";

const unBanUser = async (userId: string) => {
  try {
    const response = await fetch(`/api/user/management/${userId}/un-ban`, {
      method: "PATCH",
    });
    if (!response.ok) {
      throw new Error("Error banning user");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useUnBanUser = () => {
  return useMutation({
    mutationKey: ["unban-user"],
    mutationFn: unBanUser,
  });
};
