import { TierBadgeSize, TIER_LISTS } from "@/lib/tier-lists";
import { ActiveBadge } from "@/types/badge-types";
import React from "react";

interface Props {
  badge: ActiveBadge;
  size?: TierBadgeSize;
}

const BadgeDisplay = ({ badge, size = "sm" }: Props) => {
  if (badge.kind === "special") {
    const sizeMap: Record<TierBadgeSize, string> = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-7 h-7",
    };

    return (
      <img
        src={badge.url}
        alt={badge.title}
        title={badge.title}
        className={`${sizeMap[size]} object-contain`}
      />
    );
  }

  const tier = TIER_LISTS.find((t) => t.id === badge.tierId);
  if (!tier) return null;

  return <>{tier.renderBadge(size)}</>;
};

export default BadgeDisplay;
