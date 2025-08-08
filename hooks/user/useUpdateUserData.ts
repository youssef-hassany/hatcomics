import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Payload {
  newUsername: string;
  bio: string;
  fullName: string;
}

interface UpdateUserVars {
  username: string;
  payload: Payload;
}

const updateUserData = async ({ username, payload }: UpdateUserVars) => {
  const response = await fetch(`/api/user/${username}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-me"],
    mutationFn: updateUserData,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });
};
