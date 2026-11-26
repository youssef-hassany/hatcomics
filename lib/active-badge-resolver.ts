import { ActiveBadge, RawBadge } from "@/types/badge-types";
import { TIER_LISTS } from "./tier-lists";

export function resolveActiveBadge(
  points: number,
  badges?: RawBadge[],
): ActiveBadge {
  const specialBadge = badges?.find((b) => b.isApplied);

  if (badges && specialBadge) {
    return {
      kind: "special",
      url: specialBadge.badgeDefinition.url,
      title: specialBadge.badgeDefinition.title,
    };
  }

  const tier = [...TIER_LISTS].reverse().find((t) => points >= t.minPoints)!;
  return { kind: "rank", tierId: tier.id };
}
