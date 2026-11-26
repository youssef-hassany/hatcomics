import React from "react";
import {
  User,
  Sparkle,
  Zap,
  Shield,
  ShieldCheck,
  Sword,
  Swords,
  Hammer,
  Gem,
  Crown,
} from "lucide-react";
import { RawBadge } from "@/types/badge-types";

export type TierBadgeSize = "sm" | "md" | "lg";

const SIZE_MAP: Record<TierBadgeSize, number> = {
  sm: 14,
  md: 18,
  lg: 24,
};

export const TIER_LISTS = [
  {
    id: 1,
    name: "Civilian",
    minPoints: 0,
    icon: User,
    description: "Just entered the comic universe.",
    renderBadge: (size: TierBadgeSize = "sm") => (
      <User size={SIZE_MAP[size]} className="text-zinc-400" />
    ),
  },
  {
    id: 2,
    name: "Vigilante",
    minPoints: 20,
    icon: Sparkle,
    description: "Fighting crime from the shadows.",
    renderBadge: (size: TierBadgeSize = "sm") => (
      <Sparkle size={SIZE_MAP[size]} className="text-zinc-300" />
    ),
  },
  {
    id: 3,
    name: "Sidekick",
    minPoints: 50,
    icon: Zap,
    description: "Learning the path of heroism.",
    renderBadge: (size: TierBadgeSize = "sm") => (
      <Zap size={SIZE_MAP[size]} className="text-yellow-400" />
    ),
  },
  {
    id: 4,
    name: "Defender",
    minPoints: 120,
    icon: Shield,
    description: "Power and reputation are growing.",
    renderBadge: (size: TierBadgeSize = "sm") => (
      <Shield size={SIZE_MAP[size]} className="text-blue-400" />
    ),
  },
  {
    id: 5,
    name: "Champion",
    minPoints: 250,
    icon: ShieldCheck,
    description: "Protector of stories and knowledge.",
    renderBadge: (size: TierBadgeSize = "sm") => (
      <ShieldCheck size={SIZE_MAP[size]} className="text-green-400" />
    ),
  },
  {
    id: 6,
    name: "Titan",
    minPoints: 500,
    icon: Sword,
    description: "A proven force in the community.",
    renderBadge: (size: TierBadgeSize = "sm") => (
      <Sword size={SIZE_MAP[size]} className="text-orange-400" />
    ),
  },
  {
    id: 7,
    name: "Guardian",
    minPoints: 900,
    icon: Swords,
    description: "A trusted protector of the comic universe.",
    renderBadge: (size: TierBadgeSize = "sm") => (
      <Swords size={SIZE_MAP[size]} className="text-purple-400" />
    ),
  },
  {
    id: 8,
    name: "Asgardian",
    minPoints: 1500,
    icon: Hammer,
    description: "Stories will remember your name.",
    renderBadge: (size: TierBadgeSize = "sm") => (
      <span className="relative inline-flex items-center justify-center">
        {/* lightning glow behind the hammer */}
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{
            background: "radial-gradient(circle, #60a5fa, transparent 70%)",
          }}
        />
        <Hammer
          size={SIZE_MAP[size]}
          className="relative text-blue-400 drop-shadow-[0_0_6px_#3b82f6] animate-pulse"
        />
      </span>
    ),
  },
  {
    id: 9,
    name: "Avenger",
    minPoints: 2500,
    icon: Gem,
    description: "Beyond legend. A myth incarnate.",
    renderBadge: (size: TierBadgeSize = "sm") => (
      <span className="relative inline-flex items-center justify-center">
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{
            background: "radial-gradient(circle, #f59e0b, transparent 70%)",
          }}
        />
        <Gem
          size={SIZE_MAP[size]}
          className="relative text-amber-400 drop-shadow-[0_0_8px_#f59e0b] animate-pulse"
        />
      </span>
    ),
  },
  {
    id: 10,
    name: "Beyonder",
    minPoints: 4000,
    icon: Crown,
    description: "One of the most powerful beings in the multiverse.",
    renderBadge: (size: TierBadgeSize = "sm") => (
      <span className="relative inline-flex items-center justify-center">
        <span
          className="absolute inset-0 animate-spin-slow rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #a855f7, #ec4899, #f59e0b, #a855f7)",
            opacity: 0.4,
            filter: "blur(4px)",
          }}
        />
        <Crown
          size={SIZE_MAP[size]}
          className="relative text-white drop-shadow-[0_0_10px_#a855f7]"
        />
      </span>
    ),
  },
];

/** Returns the correct tier for a given points value */
export function getTierForPoints(points: number) {
  return [...TIER_LISTS].reverse().find((tier) => points >= tier.minPoints)!;
}

export const badgeTypeDecider = (badges: RawBadge[], points: number) => {
  const selectedBadge = badges.find((badge) => badge.isApplied);

  if (!selectedBadge) {
    return {
      kind: "rank",
      tierId: getTierForPoints(points).id,
    };
  }

  return {
    kind: "special",
    url: selectedBadge.badgeDefinition.url,
    title: selectedBadge.badgeDefinition.title,
  };
};
