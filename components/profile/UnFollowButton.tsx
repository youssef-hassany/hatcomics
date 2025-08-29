import React from "react";
import { Button } from "../ui/button";
import { useUnFollowUser } from "@/hooks/follow/useUnfollowUser";

interface Props {
  setIsFollowed: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  userId: string;
}

const UnFollowButton = ({ setIsFollowed, userId }: Props) => {
  const { mutateAsync: unFollowUser } = useUnFollowUser();

  const handleUnFollow = async () => {
    try {
      setIsFollowed(false);
      await unFollowUser(userId);
    } catch (error) {
      setIsFollowed(true);
      console.error(error);
    }
  };

  return (
    <Button
      className="flex items-center gap-1"
      variant="secondary"
      onClick={handleUnFollow}
    >
      Followed
    </Button>
  );
};

export default UnFollowButton;
