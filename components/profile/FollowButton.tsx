import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useFollowUser } from "@/hooks/follow/useFollowUser";

interface Props {
  setIsFollowed: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  userId: string;
}

const FollowButton = ({ setIsFollowed, userId }: Props) => {
  const { mutateAsync: followUser } = useFollowUser();

  const handleFollow = async () => {
    try {
      setIsFollowed(true);
      await followUser(userId);
    } catch (error) {
      setIsFollowed(false);
      console.error(error);
    }
  };

  return (
    <Button className="flex items-center gap-1" onClick={handleFollow}>
      Follow
      <Plus />
    </Button>
  );
};

export default FollowButton;
