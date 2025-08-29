import React from "react";
import UnFollowButton from "./UnFollowButton";
import FollowButton from "./FollowButton";

interface Props {
  isFollowed: boolean;
  setIsFollowed: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  userId: string;
}

const FollowHandler = ({ isFollowed, setIsFollowed, userId }: Props) => {
  if (isFollowed) {
    return <UnFollowButton setIsFollowed={setIsFollowed} userId={userId} />;
  }

  return <FollowButton setIsFollowed={setIsFollowed} userId={userId} />;
};

export default FollowHandler;
