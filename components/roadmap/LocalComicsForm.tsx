"use client";

import { useGetComicsList } from "@/hooks/comics/useGetComicsList";
import React, { useState } from "react";
import { Book, Search, X } from "lucide-react";
import ComicCardSkeleton from "@/components/comics/ComicCardSekelton";
import { ComicPreview } from "@/types/Comic";
import { useDebounce } from "@/hooks/common/useDebounce";
import ComicCard from "@/components/comics/ComicCard";
import { ImportedComic } from "@/types/Roadmap";

interface Props {
  onSelect: (comic: ImportedComic) => void;
}

const LocalComicsList = ({ onSelect }: Props) => {
  const [comicNameFilter, setComicNameFilter] = useState("");

  const debouncedComicName = useDebounce(comicNameFilter, 500);

  const filters = {
    name: debouncedComicName || undefined,
  };

  const { data: comicsList, isLoading, error } = useGetComicsList(filters);

  const clearAllFilters = () => {
    setComicNameFilter("");
  };

  const hasActiveFilters = comicNameFilter;

  const handleSelect = (comic: ComicPreview) => {
    const selectedComic: ImportedComic = {
      description: comic.description || "",
      image: comic.image,
      name: comic.name,
      comicId: comic.id,
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
            <h1 className="text-4xl font-bold">HatComics Library</h1>
          </div>
          <p className="text-zinc-200 text-lg max-w-2xl mb-6">
            Browse through all the comics that have been added to add to your
            roadmap.
          </p>

          {/* Filter Controls */}
          <div className="flex flex-col gap-4 max-w-4xl">
            {/* Filter Toggle Button */}
            <div className="flex items-center gap-4 flex-wrap">
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

            {/* comic name Filter */}
            <div>
              <label className="block text-zinc-300 text-sm font-medium mb-2">
                Comic Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={comicNameFilter}
                  onChange={(e) => setComicNameFilter(e.target.value)}
                  placeholder="e.g., Watchmen"
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                />
              </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-5 gap-6">
              {comicsList.map((comic: ComicPreview) => (
                <ComicCard
                  comic={comic}
                  key={comic.id}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LocalComicsList;
