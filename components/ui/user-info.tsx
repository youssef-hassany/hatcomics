import React from "react";
import { ActiveBadge } from "@/types/badge-types";
import BadgeDisplay from "./badge-display";

interface Props {
  fullname: string;
  username: string;
  points: number;
  activeBadge: ActiveBadge;
}

const UserInfo = ({ fullname, username, activeBadge }: Props) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <h3 className="text-zinc-100 font-semibold text-sm truncate">
          {fullname}
        </h3>
        <BadgeDisplay badge={activeBadge} size="sm" />
      </div>
      <p className="text-zinc-500 text-xs truncate">@{username}</p>
    </div>
  );
};

export default UserInfo;
