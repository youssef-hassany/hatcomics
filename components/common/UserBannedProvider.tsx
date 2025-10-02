"use client";

import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import React from "react";
import UserBannedMsg from "./UserBannedMsg";

interface Props {
  children: React.ReactNode;
}

const UserBannedProvider = ({ children }: Props) => {
  const { data: loggedInUser } = useGetLoggedInUser();

  if (loggedInUser?.isBanned) {
    return <UserBannedMsg />;
  }

  return <>{children}</>;
};

export default UserBannedProvider;
