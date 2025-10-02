import { useMutation } from "@tanstack/react-query";

const banUser = async (userId: string) => {
  try {
    const response = await fetch(`/api/user/management/${userId}/ban`, {
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

export const useBanUser = () => {
  return useMutation({
    mutationKey: ["ban-user"],
    mutationFn: banUser,
  });
};
