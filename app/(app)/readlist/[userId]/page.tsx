"use client";

import { Book, RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import ComicCard from "@/components/comics/ComicCard";
import ComicCardSkeleton from "@/components/comics/ComicCardSekelton";
import { useGetReadlist } from "@/hooks/readlist/useGetReadList";

const ReadlistPage = () => {
  const params = useParams();
  const userId = params.userId as string;

  const {
    data: comicsList,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useGetReadlist(userId);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Book className="w-8 h-8 text-orange-400" />
              <h1 className="text-4xl font-bold">ReadList</h1>
            </div>
            <p className="text-zinc-200 text-lg max-w-2xl mb-6">
              Browse through all the comics that have been added to your
              readlist.
            </p>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ComicCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Book className="w-8 h-8 text-orange-400" />
              <h1 className="text-4xl font-bold">ReadList</h1>
            </div>
            <p className="text-zinc-200 text-lg max-w-2xl mb-6">
              Browse through all the comics that have been added to your
              readlist.
            </p>
          </div>
        </div>

        {/* Error Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            <p className="mb-3">Error loading comics</p>
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
              />
              {isRefetching ? "Retrying..." : "Try Again"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-8 h-8 text-orange-400" />
            <h1 className="text-4xl font-bold">ReadList</h1>
          </div>
          <p className="text-zinc-200 text-lg max-w-2xl mb-6">
            Browse through all the comics that have been added to your readlist.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-zinc-300">
            Found{" "}
            <span className="font-semibold text-orange-400">
              {comicsList?.length || 0}
            </span>{" "}
            comics
          </p>
        </div>

        {comicsList?.length === 0 ? (
          <div className="text-center py-20">
            <Book className="w-16 h-16 text-zinc-500 mx-auto mb-4" />
            <p className="text-zinc-300 text-lg">No comics found</p>
            <p className="text-zinc-400 text-sm mt-2">
              Start by adding some comics to the collection
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {comicsList?.map((comic) => (
              <ComicCard comic={comic.comic} key={comic.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadlistPage;
