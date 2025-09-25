"use client";

import { useGetComicVineComics } from "@/hooks/comic-vine/useGetComicVineComics";
import React, { useEffect, useRef, useState } from "react";
import { Calendar, Book, ExternalLink, Filter } from "lucide-react";
import { useDebounce } from "@/hooks/common/useDebounce";
import ComicCardSkeleton from "@/components/comics/ComicCardSekelton";
import { ComicIssue } from "@/types/comic-vine";
import { ImportedComic } from "@/types/Roadmap";

interface Props {
  onSelect: (comic: ImportedComic) => void;
}

const ExternalComicList = ({ onSelect }: Props) => {
  const [searchQuery, setSearchQuery] = useState("spider-man");
  const [resourceType, setResourceType] = useState("volume");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const searchDebounce = useDebounce(searchQuery);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useGetComicVineComics(searchDebounce, resourceType);

  // Flatten all pages of results
  const allComics = data?.pages.flatMap((page) => page.results) ?? [];
  const totalResults = data?.pages[0]?.totalResults ?? 0;

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stripHtmlTags = (html: string) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  };

  const resourceOptions = [
    { value: "issue", label: "Issues" },
    { value: "volume", label: "Volumes" },
    { value: "character", label: "Characters" },
    { value: "story_arc", label: "Story Arcs" },
    { value: "publisher", label: "Publishers" },
    { value: "person", label: "People" },
    { value: "team", label: "Teams" },
  ];

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    const cleanText = stripHtmlTags(text);
    return cleanText.length <= maxLength
      ? cleanText
      : cleanText.substring(0, maxLength) + "...";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically refetch due to dependency change
  };

  const handleSelect = (comic: ComicIssue) => {
    const selectedComic: ImportedComic = {
      externalId: comic.id,
      description: comic.description,
      name: comic.name,
      image: comic.image.original_url,
      externalSource: "comicvine",
      issueNumber: Number(comic.issue_number) || 0,
    };

    onSelect(selectedComic);
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-8 h-8 text-orange-400" />
            <h1 className="text-4xl font-bold">Comic Discovery</h1>
          </div>
          <p className="text-zinc-200 text-lg max-w-2xl mb-6">
            Search and discover comics, characters, volumes, and more from the
            Comic Vine database.
          </p>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
            <form onSubmit={handleSearch} className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for comics, characters, volumes..."
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </form>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-zinc-400" />
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                className="px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                {resourceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            <p>Error loading comics: {error.message}</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ComicCardSkeleton key={index} />
            ))}
          </div>
        ) : allComics.length === 0 ? (
          <div className="text-center py-20">
            <Book className="w-16 h-16 text-zinc-500 mx-auto mb-4" />
            <p className="text-zinc-300 text-lg">No Comics found</p>
            <p className="text-zinc-400 text-sm mt-2">Try a different search</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-zinc-300">
                Found{" "}
                <span className="font-semibold text-orange-400">
                  {totalResults.toLocaleString()}
                </span>{" "}
                •{" "}
                <span className="text-zinc-400">
                  Showing {allComics.length}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
              {allComics.map((comic, index) => (
                <div
                  key={`${comic.id}-${index}`}
                  className="bg-zinc-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-zinc-700"
                >
                  {/* Comic Cover */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-zinc-700">
                    <img
                      src={comic.image?.original_url || comic.image?.super_url}
                      alt={comic.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center bg-zinc-700">
                      <Book className="w-12 h-12 text-zinc-500" />
                    </div>

                    {/* Issue Number Badge */}
                    {comic.issue_number && (
                      <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-semibold shadow-lg">
                        #{comic.issue_number}
                      </div>
                    )}
                  </div>

                  {/* Comic Details */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 leading-tight">
                      {comic.name || "Untitled"}
                    </h3>

                    {/* Volume Info */}
                    {comic.volume?.name && (
                      <p className="text-orange-600 font-medium text-sm mb-2">
                        {comic.volume.name}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-zinc-300 text-sm mb-4 leading-relaxed">
                      {truncateText(comic.description, 120) ||
                        "No description available."}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-2 mb-4">
                      {comic.cover_date && (
                        <div className="flex items-center gap-2 text-zinc-400 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>Cover: {formatDate(comic.cover_date)}</span>
                        </div>
                      )}
                      {comic.store_date && (
                        <div className="flex items-center gap-2 text-zinc-400 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>Store: {formatDate(comic.store_date)}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleSelect(comic)}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium cursor-pointer"
                    >
                      <span>Add Comic</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            <div ref={loadMoreRef} className="mt-8">
              {isFetchingNextPage && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <ComicCardSkeleton key={index} />
                  ))}
                </div>
              )}

              {!hasNextPage && allComics.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-zinc-500">You&#39;ve reached the end!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExternalComicList;
