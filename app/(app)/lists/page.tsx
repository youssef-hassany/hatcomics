"use client";

import ListPreview from "@/components/lists/ListPreview";
import ListPreviewSkeleton from "@/components/lists/ListPreviewSkeleton";
import NoPostsMsg from "@/components/posts/NoPostsMsg";
import { Input } from "@/components/ui/Input";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useGetAllLists } from "@/hooks/lists/useGetAllLists";
import { List, Plus } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

const ListsPage = () => {
  const [filter, setFilter] = useState("");
  const filterDebounce = useDebounce(filter);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetAllLists(filterDebounce);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Flatten all posts from all pages
  const allLists = data?.pages.flatMap((page) => page.data) || [];

  // Intersection Observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  // Set up intersection observer
  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <List className="w-8 h-8 text-orange-600" />
            <h1 className="text-4xl font-bold">Latest Posts</h1>
          </div>
          <p className="text-zinc-200 text-lg max-w-2xl mb-6">
            Discover the latest articles and discussions from our community
          </p>
        </div>
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="lists/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-full font-medium hover:bg-orange-700 transition-all hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Create New
          </Link>
        </div>
      </div>

      <div className="p-6">
        <Input
          className="w-full rounded-2xl"
          placeholder="Search for a specific list..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Initial loading skeleton */}
      {isLoading && (
        <div className="space-y-6 p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((post) => (
            <ListPreviewSkeleton key={post} />
          ))}
        </div>
      )}

      {/* Posts List */}
      {!isLoading && (
        <div className="space-y-6 p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {allLists.map((list) => (
            <ListPreview
              image={list.image}
              title={list.title}
              user={list.creator}
              key={list.id}
              url={`/lists/${list.id}`}
            />
          ))}
        </div>
      )}

      {/* Load more trigger */}
      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="space-y-6 p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {isFetchingNextPage ? (
            <div className="space-y-6 w-full">
              {[1, 2, 3, 4].map((skeleton) => (
                <ListPreviewSkeleton key={skeleton} />
              ))}
            </div>
          ) : (
            <div className="text-zinc-400 text-sm">Scroll to load more...</div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && allLists.length === 0 && <NoPostsMsg />}
    </div>
  );
};

export default ListsPage;
