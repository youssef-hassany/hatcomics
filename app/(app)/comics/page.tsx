"use client";

import { useGetComicsList } from "@/hooks/comics/useGetComicsList";
import React, { useState } from "react";
import { Book, Star, ExternalLink, Filter, Search, X } from "lucide-react";
import ComicCardSkeleton from "@/components/comics/ComicCardSekelton";
import { ComicPreview } from "@/types/Comic";
import { useDebounce } from "@/hooks/common/useDebounce";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const StoredComicsPage = () => {
  const [characterFilter, setCharacterFilter] = useState("");
  const [publisherFilter, setPublisherFilter] = useState("");
  const [isBeginnerFriendlyFilter, setisBeginnerFriendlyFilter] = useState<
    boolean | undefined
  >(undefined);
  const [longevityFilter, setLongevityFilter] = useState<
    "short" | "medium" | "long" | undefined
  >(undefined);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedCharacter = useDebounce(characterFilter, 500);
  const debouncedPublisher = useDebounce(publisherFilter, 500);

  const filters = {
    character: debouncedCharacter || undefined,
    publisher: debouncedPublisher || undefined,
    isBeginnerFriendly: isBeginnerFriendlyFilter,
    longevity: longevityFilter,
  };

  const { data: comicsList, isLoading, error } = useGetComicsList(filters);

  // const formatDate = (dateString: string | Date) => {
  //   if (!dateString) return "Unknown";
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //   });
  // };

  // const truncateText = (text: string, maxLength: number) => {
  //   if (!text) return "";
  //   return text.length <= maxLength
  //     ? text
  //     : text.substring(0, maxLength) + "...";
  // };

  const renderStars = (rating: number | null) => {
    if (rating === null)
      return <span className="text-zinc-400">No ratings</span>;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-zinc-400" />);
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-zinc-300 text-sm ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-8 h-8 text-orange-400" />
            <h1 className="text-4xl font-bold">Comics</h1>
          </div>
          <p className="text-zinc-200 text-lg max-w-2xl mb-6">
            Browse through all the comics that have been added to our collection
            by our community.
          </p>

          {/* Filter Controls */}
          <div className="flex flex-col gap-4 max-w-4xl">
            {/* Filter Toggle Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-colors duration-200 border border-zinc-600"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {showFilters ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Filter className="w-4 h-4" />
                )}
              </button>

              {/* Clear Filters Button */}
              {(characterFilter ||
                publisherFilter ||
                isBeginnerFriendlyFilter !== undefined ||
                longevityFilter) && (
                <button
                  onClick={() => {
                    setCharacterFilter("");
                    setPublisherFilter("");
                    setisBeginnerFriendlyFilter(undefined);
                    setLongevityFilter(undefined);
                  }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                    y: -20,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    y: -20,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                    height: { duration: 0.4 },
                  }}
                  className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-600 overflow-hidden"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      delay: 0.1,
                      duration: 0.2,
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                  >
                    {/* Character Filter */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15, duration: 0.2 }}
                    >
                      <label className="block text-zinc-300 text-sm font-medium mb-2">
                        Character
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          type="text"
                          value={characterFilter}
                          onChange={(e) => setCharacterFilter(e.target.value)}
                          placeholder="e.g., Spider-Man"
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                        />
                      </div>
                    </motion.div>

                    {/* Publisher Filter */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.2 }}
                    >
                      <label className="block text-zinc-300 text-sm font-medium mb-2">
                        Publisher
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          type="text"
                          value={publisherFilter}
                          onChange={(e) => setPublisherFilter(e.target.value)}
                          placeholder="e.g., Marvel"
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                        />
                      </div>
                    </motion.div>

                    {/* Beginner Friendly Filter */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25, duration: 0.2 }}
                    >
                      <label className="block text-zinc-300 text-sm font-medium mb-2">
                        Beginner Friendly
                      </label>
                      <select
                        value={
                          isBeginnerFriendlyFilter === undefined
                            ? ""
                            : isBeginnerFriendlyFilter.toString()
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          setisBeginnerFriendlyFilter(
                            value === "" ? undefined : value === "true"
                          );
                        }}
                        className="w-full px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                      >
                        <option value="">All</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </motion.div>

                    {/* Longevity Filter */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.2 }}
                    >
                      <label className="block text-zinc-300 text-sm font-medium mb-2">
                        Series Length
                      </label>
                      <select
                        value={longevityFilter || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setLongevityFilter(
                            value === ""
                              ? undefined
                              : (value as "short" | "medium" | "long")
                          );
                        }}
                        className="w-full px-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                      >
                        <option value="">All</option>
                        <option value="short">Short (1-12 issues)</option>
                        <option value="medium">Medium (13-30 issues)</option>
                        <option value="long">Long (30+ issues)</option>
                      </select>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
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
        ) : !comicsList || comicsList.length === 0 ? (
          <div className="text-center py-20">
            <Book className="w-16 h-16 text-zinc-500 mx-auto mb-4" />
            <p className="text-zinc-300 text-lg">No comics found</p>
            <p className="text-zinc-400 text-sm mt-2">
              Start by adding some comics to the collection
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-zinc-300">
                Found{" "}
                <span className="font-semibold text-orange-400">
                  {comicsList.length}
                </span>{" "}
                comics
                {(characterFilter ||
                  publisherFilter ||
                  isBeginnerFriendlyFilter !== undefined ||
                  longevityFilter) && (
                  <span className="text-zinc-400"> (filtered)</span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {comicsList.map((comic: ComicPreview) => (
                <div
                  key={comic.id}
                  className="bg-zinc-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-zinc-700"
                >
                  {/* Comic Cover */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-zinc-700">
                    <img
                      src={comic.image}
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

                    {/* Beginner Friendly Badge */}
                    {comic.isBeginnerFriendly && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Beginner Friendly
                      </div>
                    )}

                    {/* Rating Badge */}
                    {comic.averageRating && (
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        {comic.averageRating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Comic Details */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 leading-tight">
                      {comic.name}
                    </h3>

                    {/* Publisher */}
                    {comic.publisher && (
                      <p className="text-orange-600 font-medium text-sm mb-2">
                        {comic.publisher}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="space-y-2 mb-4">
                      {/* Number of Issues */}
                      {comic.numberOfIssues > 0 && (
                        <div className="flex items-center gap-2 text-zinc-400 text-xs">
                          <span>📚 {comic.numberOfIssues} issues</span>
                        </div>
                      )}

                      {/* Reviews */}
                      <div className="flex items-center gap-2 text-zinc-400 text-xs">
                        <span>💬 {comic.totalReviews} reviews</span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 text-zinc-400 text-xs">
                        {renderStars(comic.averageRating)}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {/* View Details Button */}
                      <Link
                        href={`/comics/${comic.id}`}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium cursor-pointer"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StoredComicsPage;
