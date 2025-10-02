import React from "react";
import { Button } from "../ui/button";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import { useBanUserStore } from "@/store/userBanStore";

interface Props {
  isBanned?: boolean;
  userId?: string;
}

const UserBanToggle = ({ isBanned, userId }: Props) => {
  const { data: loggedInUser } = useGetLoggedInUser();
  const { setBanUserId, setUnbanUserId } = useBanUserStore();

  const handleClick = () => {
    if (isBanned === true) {
      setUnbanUserId(userId as string);
    } else {
      setBanUserId(userId as string);
    }
  };

  if (loggedInUser?.role !== "owner" && loggedInUser?.role !== "admin")
    return null;

  if (!userId) {
    return null;
  }

  return (
    <Button onClick={handleClick}>
      {isBanned ? "Unban Account" : "Ban Account"}
    </Button>
  );
};

export default UserBanToggle;
