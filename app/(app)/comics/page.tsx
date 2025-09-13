"use client";

import { useGetComicsList } from "@/hooks/comics/useGetComicsList";
import React, { useState } from "react";
import { Book, Filter, Search, X, ArrowUpDown } from "lucide-react";
import ComicCardSkeleton from "@/components/comics/ComicCardSekelton";
import { ComicPreview } from "@/types/Comic";
import { useDebounce } from "@/hooks/common/useDebounce";
import { motion, AnimatePresence } from "framer-motion";
import ComicCard from "@/components/comics/ComicCard";

const StoredComicsPage = () => {
  const [characterFilter, setCharacterFilter] = useState("");
  const [publisherFilter, setPublisherFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [isBeginnerFriendlyFilter, setisBeginnerFriendlyFilter] = useState<
    boolean | undefined
  >(undefined);
  const [isIndieFilter, setIsIndieFilter] = useState<boolean | undefined>(
    undefined
  );
  const [longevityFilter, setLongevityFilter] = useState<
    "short" | "medium" | "long" | undefined
  >(undefined);
  const [sortBy, setSortBy] = useState<
    "A-Z" | "Z-A" | "rating" | "none" | undefined
  >(undefined);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedCharacter = useDebounce(characterFilter, 500);
  const debouncedPublisher = useDebounce(publisherFilter, 500);
  const debouncedAuthor = useDebounce(authorFilter, 500);

  const filters = {
    character: debouncedCharacter || undefined,
    publisher: debouncedPublisher || undefined,
    author: debouncedAuthor || undefined,
    isBeginnerFriendly: isBeginnerFriendlyFilter,
    isIndie: isIndieFilter,
    longevity: longevityFilter,
    sortBy: sortBy,
  };

  const { data: comicsList, isLoading, error } = useGetComicsList(filters);

  const clearAllFilters = () => {
    setCharacterFilter("");
    setPublisherFilter("");
    setAuthorFilter("");
    setisBeginnerFriendlyFilter(undefined);
    setIsIndieFilter(undefined);
    setLongevityFilter(undefined);
    setSortBy(undefined);
  };

  const hasActiveFilters =
    characterFilter ||
    publisherFilter ||
    authorFilter ||
    isBeginnerFriendlyFilter !== undefined ||
    isIndieFilter !== undefined ||
    longevityFilter ||
    sortBy;

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
            <div className="flex items-center gap-4 flex-wrap">
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

              {/* Sort Dropdown - Always Visible */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-zinc-400" />
                <select
                  value={sortBy || "none"}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSortBy(
                      value === "none"
                        ? undefined
                        : (value as "A-Z" | "Z-A" | "rating")
                    );
                  }}
                  className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-600 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                >
                  <option value="none">Default Order</option>
                  <option value="A-Z">Title (A-Z)</option>
                  <option value="Z-A">Title (Z-A)</option>
                  <option value="rating">Rating (High to Low)</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  <span>Clear All</span>
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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
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

                    {/* Author Filter */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.2 }}
                    >
                      <label className="block text-zinc-300 text-sm font-medium mb-2">
                        Author
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          type="text"
                          value={authorFilter}
                          onChange={(e) => setAuthorFilter(e.target.value)}
                          placeholder="e.g., Hickman"
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

                    {/* Indie Comics Filter */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.2 }}
                    >
                      <label className="block text-zinc-300 text-sm font-medium mb-2">
                        Indie Comics
                      </label>
                      <select
                        value={
                          isIndieFilter === undefined
                            ? ""
                            : isIndieFilter.toString()
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          setIsIndieFilter(
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
                      transition={{ delay: 0.35, duration: 0.2 }}
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
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
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
                {hasActiveFilters && (
                  <span className="text-zinc-400"> (filtered)</span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {comicsList.map((comic: ComicPreview) => (
                <ComicCard comic={comic} key={comic.id} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StoredComicsPage;
