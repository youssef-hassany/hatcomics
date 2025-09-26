"use client";

import { useGetRoadmapDetails } from "@/hooks/roadmaps/useGetRoadmapDetails";
import { useParams } from "next/navigation";
import Link from "next/link";
import React from "react";
import Avatar from "../ui/avatar";
import RoadmapLikeHandler from "./RoadmapLikeHandler";
import RoadmapShareButton from "./RoadmapShareButton";
import { CommentsSection } from "../comments";
import { Edit3 } from "lucide-react"; // Import the edit icon
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";

const RoadmapPageClient: React.FC = () => {
  const { id: roadmapId } = useParams();
  const { data: roadmap, isLoading } = useGetRoadmapDetails(
    roadmapId as string
  );
  const { data: loggedInUser } = useGetLoggedInUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-zinc-700 border-t-orange-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-orange-500 opacity-20"></div>
        </div>
      </div>
    );
  }

  const isOwner = loggedInUser?.id === roadmap?.creator.id;

  return (
    <div className="min-h-screen bg-zinc-950 px-4">
      {/* Header */}
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <div className="relative">
          {/* Background Image with Overlay - Desktop */}
          {roadmap?.image && (
            <div className="hidden md:block relative w-full aspect-[21/9]">
              <div className="absolute inset-0">
                <img
                  src={roadmap.image}
                  alt={roadmap.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
              </div>
            </div>
          )}

          {/* Mobile Background Image */}
          {roadmap?.image && (
            <div className="md:hidden relative w-full h-64">
              <div className="absolute inset-0">
                <img
                  src={roadmap.image}
                  alt={roadmap.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20"></div>
              </div>
            </div>
          )}

          {/* Content Overlay - Desktop */}
          <div
            className={`hidden md:block ${
              roadmap?.image ? "absolute bottom-0 left-0 right-0" : "relative"
            } max-w-6xl mx-auto px-4 pb-12 pt-8`}
          >
            {/* Edit Button - Positioned at top right */}
            {isOwner && (
              <div className="absolute top-4 right-4 z-20">
                <Link
                  href={`/roadmaps/${roadmapId}/manage`}
                  className="group relative inline-flex items-center justify-center p-3 bg-black/40 backdrop-blur-sm rounded-full border border-zinc-800/50 hover:border-orange-500/50 transition-all duration-300 hover:bg-orange-500/10"
                  title="Edit Roadmap"
                >
                  <Edit3 className="w-5 h-5 text-zinc-400 group-hover:text-orange-400 transition-colors duration-300" />

                  {/* Tooltip */}
                  <div className="absolute -bottom-10 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-zinc-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Manage Roadmap
                    </div>
                  </div>
                </Link>
              </div>
            )}

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              {/* Title Section */}
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {roadmap?.title}
                </h1>

                {/* like handler and share button */}
                {roadmap && (
                  <div className="flex items-center gap-3">
                    <RoadmapLikeHandler roadmap={roadmap} />
                    <RoadmapShareButton
                      roadmapTitle={roadmap.title}
                      roadmapCreator={roadmap.creator.username}
                    />
                  </div>
                )}
              </div>

              {/* Creator Card */}
              {roadmap?.creator && (
                <div className="flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-2xl border border-zinc-800/50 px-6 py-4 lg:mb-2">
                  <Avatar
                    url={roadmap.creator.photo || ""}
                    username={roadmap.creator.username}
                    width={56}
                    height={56}
                    className="w-14 h-14 ring-2 ring-orange-500/30"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs text-orange-400 font-medium tracking-wide uppercase">
                      Created by
                    </span>
                    <span className="text-white font-semibold text-lg">
                      {roadmap.creator.fullname}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Content - Fixed positioning */}
          <div className="md:hidden relative z-10 max-w-6xl mx-auto px-4 py-8">
            {/* Edit Button - Mobile */}
            {isOwner && (
              <div className="absolute top-4 right-4 z-20">
                <Link
                  href={`/roadmaps/${roadmapId}/manage`}
                  className="group relative inline-flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm rounded-full border border-zinc-800/50 hover:border-orange-500/50 transition-all duration-300 hover:bg-orange-500/10"
                  title="Edit Roadmap"
                >
                  <Edit3 className="w-5 h-5 text-zinc-400 group-hover:text-orange-400 transition-colors duration-300" />
                </Link>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight pr-16">
              {roadmap?.title}
            </h1>

            {/* Creator Card */}
            {roadmap?.creator && (
              <div className="flex items-center gap-4 bg-black/60 backdrop-blur-sm rounded-2xl border border-zinc-800/50 px-4 py-3 mb-6">
                <Avatar
                  url={roadmap.creator.photo || ""}
                  username={roadmap.creator.username}
                  width={48}
                  height={48}
                  className="w-12 h-12 ring-2 ring-orange-500/30"
                />
                <div className="flex flex-col">
                  <span className="text-xs text-orange-400 font-medium tracking-wide uppercase">
                    Created by
                  </span>
                  <span className="text-white font-semibold">
                    {roadmap.creator.fullname}
                  </span>
                </div>
              </div>
            )}

            {/* Like handler and share button */}
            {roadmap && (
              <div className="flex items-center gap-3">
                <RoadmapLikeHandler roadmap={roadmap} />
                <RoadmapShareButton
                  roadmapTitle={roadmap.title}
                  roadmapCreator={roadmap.creator.username}
                />
              </div>
            )}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent max-w-4xl mx-auto"></div>
      </div>

      {/* Description Section */}
      {roadmap?.description && (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800/50 p-8">
            <h2 className="text-orange-400 font-semibold text-lg mb-4 tracking-wide uppercase">
              About This Roadmap
            </h2>
            <div
              className="text-zinc-300 text-base leading-relaxed prose prose-invert max-w-none rich-text-editor"
              dangerouslySetInnerHTML={{
                __html: roadmap.description,
              }}
            />
          </div>
        </div>
      )}

      {/* Timeline Content */}
      <div className="max-w-6xl mx-auto relative pt-8">
        {/* Central vertical line - hidden on mobile */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-orange-600"></div>

        {/* Mobile left line */}
        <div className="md:hidden absolute left-8 w-0.5 h-full bg-orange-600"></div>

        {/* Timeline items */}
        <div className="relative">
          {roadmap?.entries.map((comic, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div key={comic.id} className="relative mb-16 md:mb-24">
                {/* Timeline dot - desktop */}
                <div className="hidden absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-zinc-900 rounded-full border-2 border-orange-600 md:flex items-center justify-center z-10">
                  <span className="text-orange-600 font-bold text-sm">
                    {index + 1}
                  </span>
                </div>

                {/* Timeline dot - mobile */}
                <div className="md:hidden absolute left-6 transform -translate-x-1/4 w-8 h-8 bg-zinc-900 rounded-full border-2 border-orange-600 flex items-center justify-center z-10">
                  <span className="text-orange-600 font-bold text-sm">
                    {index + 1}
                  </span>
                </div>

                {/* Comic card */}
                <div
                  className={`
                  w-full max-w-sm mx-auto
                  md:w-80 md:mx-0
                  ${isLeft ? "md:mr-auto md:pr-4" : "md:ml-auto md:pl-4"}
                  pl-16 md:pl-0
                `}
                >
                  <div className="bg-zinc-800 rounded-lg overflow-hidden shadow-xl">
                    {/* Comic image */}
                    <div className="h-40 sm:h-48">
                      <img
                        src={comic.image ? comic.image : comic.comic?.image}
                        alt={comic.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Comic info */}
                    <div className="p-4 sm:p-6">
                      <h3 className="text-orange-500 font-semibold text-base sm:text-lg mb-2 sm:mb-3">
                        {comic.title}
                      </h3>

                      <div
                        className="text-zinc-300 text-sm leading-relaxed rich-text-editor"
                        dangerouslySetInnerHTML={{
                          __html: comic.description || "",
                        }}
                      />
                    </div>

                    {comic.comicId && (
                      <div className="flex py-2 px-5">
                        <a
                          href={`/comics/${comic.comicId}`}
                          target="_blank"
                          className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-white font-medium transition-all duration-200 focus:outline-none bg-orange-600 hover:bg-orange-700"
                        >
                          Browse Comic
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* comment section here */}
      {roadmap && <CommentsSection referenceId={roadmap.id} type="roadmap" />}
    </div>
  );
};

export default RoadmapPageClient;
