"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TIER_LISTS } from "@/lib/tier-lists";
import { Lock } from "lucide-react";

interface Props {
  points: number;
}

interface TooltipState {
  tierId: number;
  x: number;
  y: number;
}

const RankProgressBar = ({ points }: Props) => {
  const currentTier = [...TIER_LISTS]
    .reverse()
    .find((t) => points >= t.minPoints)!;

  const nextTier =
    TIER_LISTS[TIER_LISTS.findIndex((t) => t.id === currentTier.id) + 1];

  const progressPct = nextTier
    ? Math.min(
        100,
        ((points - currentTier.minPoints) /
          (nextTier.minPoints - currentTier.minPoints)) *
          100,
      )
    : 100;

  const [animatedPct, setAnimatedPct] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timeout = setTimeout(() => setAnimatedPct(progressPct), 120);
    return () => clearTimeout(timeout);
  }, [progressPct]);

  const isMaxTier = !nextTier;

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    tierId: number,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      tierId,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => setTooltip(null);

  const tooltipTier = tooltip
    ? TIER_LISTS.find((t) => t.id === tooltip.tierId)
    : null;
  const tooltipAchieved = tooltipTier ? points >= tooltipTier.minPoints : false;

  return (
    <div className="w-full space-y-5 scrollbar-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
            Rank Progress
          </p>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg leading-none">
              {currentTier.name}
            </span>
            {currentTier.renderBadge("md")}
          </div>
        </div>

        {isMaxTier ? (
          <div className="text-right">
            <span className="text-xs text-zinc-500 uppercase tracking-widest">
              Max Rank
            </span>
            <p className="text-orange-400 font-bold text-sm">
              {points.toLocaleString()} pts
            </p>
          </div>
        ) : (
          <div className="text-right">
            <span className="text-xs text-zinc-500">
              {(nextTier.minPoints - points).toLocaleString()} pts to{" "}
            </span>
            <span className="text-white text-xs font-semibold">
              {nextTier.name}
            </span>
            <p className="text-orange-400 font-bold text-sm mt-0.5">
              {points.toLocaleString()} / {nextTier.minPoints.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* ── Main progress track ── */}
      <div className="relative">
        <div className="h-2 w-full rounded-full bg-zinc-700/60" />
        <div
          className="absolute top-0 left-0 h-2 rounded-full bg-linear-to-r from-orange-600 to-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)] transition-all duration-700 ease-out"
          style={{ width: `${animatedPct}%` }}
        />
        {!isMaxTier && animatedPct > 2 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-orange-400 ring-2 ring-orange-300/30 shadow-[0_0_10px_rgba(251,146,60,0.8)] transition-all duration-700 ease-out"
            style={{ left: `calc(${animatedPct}% - 6px)` }}
          />
        )}
      </div>

      {/* ── Tier milestone track ── */}
      {/* outer: clips horizontally but NOT vertically, so ping rings aren't cut */}
      <div className="overflow-x-auto overflow-y-visible pb-1">
        <div
          className="relative flex items-start"
          style={{ minWidth: `${TIER_LISTS.length * 52}px` }}
        >
          {/* Connecting line inside the inner div so it matches the full width */}
          <div className="absolute top-5 left-0 right-0 h-px bg-zinc-700/50 pointer-events-none" />

          {TIER_LISTS.map((tier) => {
            const achieved = points >= tier.minPoints;
            const isCurrent = tier.id === currentTier.id;
            const isHovered = tooltip?.tierId === tier.id;

            return (
              <div
                key={tier.id}
                className="flex flex-col items-center gap-1.5 cursor-default relative"
                style={{ flex: 1, minWidth: 52 }}
                onMouseEnter={(e) => handleMouseEnter(e, tier.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Extra padding top so ping ring isn't clipped */}
                <div className="pt-1 pb-1">
                  <div
                    className={`
                      relative z-10 flex items-center justify-center w-10 h-10 rounded-full
                      border-2 transition-all duration-300
                      ${
                        isCurrent
                          ? "border-orange-500 bg-zinc-800 scale-110 shadow-[0_0_14px_rgba(249,115,22,0.5)]"
                          : achieved
                            ? "border-zinc-500 bg-zinc-800"
                            : "border-zinc-700 bg-zinc-900"
                      }
                      ${isHovered && !isCurrent ? "scale-105" : ""}
                    `}
                  >
                    {achieved ? (
                      tier.renderBadge("sm")
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-zinc-600" />
                    )}
                    {isCurrent && (
                      <span className="absolute inset-0 rounded-full animate-ping bg-orange-500/20" />
                    )}
                  </div>
                </div>

                {/* Tier name + pts */}
                <div
                  className={`text-center transition-all duration-200 ${
                    isHovered || isCurrent
                      ? "opacity-100"
                      : "opacity-0 md:opacity-60"
                  }`}
                >
                  <p
                    className={`text-[10px] font-semibold leading-tight whitespace-nowrap ${
                      isCurrent
                        ? "text-orange-400"
                        : achieved
                          ? "text-zinc-300"
                          : "text-zinc-600"
                    }`}
                  >
                    {tier.name}
                  </p>
                  <p
                    className={`text-[9px] leading-tight ${
                      achieved ? "text-zinc-500" : "text-zinc-700"
                    }`}
                  >
                    {tier.minPoints.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Portal tooltip — renders outside any overflow container ── */}
      {mounted &&
        tooltip &&
        tooltipTier &&
        createPortal(
          <div
            className="fixed z-9999 pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y - 8,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 shadow-2xl text-center min-w-32.5">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {tooltipTier.renderBadge("sm")}
                <span className="text-white text-xs font-bold">
                  {tooltipTier.name}
                </span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-snug">
                {tooltipTier.description}
              </p>
              <p
                className={`text-[11px] font-semibold mt-1 ${
                  tooltipAchieved ? "text-emerald-400" : "text-zinc-500"
                }`}
              >
                {tooltipAchieved
                  ? "✓ Achieved"
                  : `${tooltipTier.minPoints.toLocaleString()} pts needed`}
              </p>
            </div>
            {/* Arrow */}
            <div className="flex justify-center -mt-px">
              <div className="w-2 h-2 bg-zinc-800 border-r border-b border-zinc-700 rotate-45" />
            </div>
          </div>,
          document.body,
        )}

      {/* Current tier description */}
      <div className="flex items-center gap-3 bg-zinc-700/30 border border-zinc-700/50 rounded-xl px-4 py-3">
        <div className="shrink-0">{currentTier.renderBadge("lg")}</div>
        <div>
          <p className="text-white text-sm font-semibold leading-none mb-1">
            {currentTier.name}
          </p>
          <p className="text-zinc-400 text-xs leading-snug">
            {currentTier.description}
          </p>
        </div>
        {isMaxTier && (
          <div className="ml-auto shrink-0">
            <span className="text-xs bg-orange-500/15 text-orange-400 border border-orange-500/20 px-2 py-1 rounded-full font-semibold">
              MAX
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankProgressBar;
