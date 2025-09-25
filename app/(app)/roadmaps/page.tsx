"use client";

import React, { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import NoPostsMsg from "@/components/posts/NoPostsMsg";
import { RoadmapPreviewSkeleton } from "@/components/roadmap/RoadmapPreviewSkeleton";
import { RoadmapPreviewCard } from "@/components/roadmap/RoadmapPreview";
import { useGetRoadmapsList } from "@/hooks/roadmaps/useGetRoadmapsList";
import { Map, Plus } from "lucide-react";

const PostsPage: React.FC = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetRoadmapsList();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Flatten all posts from all pages
  const allRoadmaps = data?.pages.flatMap((page) => page.data) || [];

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
    <div className="min-h-screen bg-zinc-900 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Map className="w-8 h-8 text-orange-600" />
              <h1 className="text-4xl font-bold">Roadmaps</h1>
            </div>
            <p className="text-zinc-200 text-lg max-w-2xl mb-6">
              Take a Look at Our Users Comic Roadmaps
            </p>
          </div>

          {/* Create Post Button */}
          <div className="mb-8">
            <Link
              href={`roadmaps/create`}
              className="w-fit text-orange-600 flex items-center gap-3 border-2 border-orange-600 px-3 py-1 rounded-2xl font-medium group"
            >
              <span className="p-0 rounded-full border-2 border-orange-600 group-hover:bg-orange-600 group-hover:text-zinc-900 transition-colors">
                <Plus />
              </span>
              Create New Roadmap
            </Link>
          </div>
        </div>

        {/* Initial loading skeleton */}
        {isLoading && (
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((post) => (
              <RoadmapPreviewSkeleton key={post} />
            ))}
          </div>
        )}

        {/* Posts List */}
        {!isLoading && (
          <div className="space-y-6">
            {allRoadmaps.map((roadmap) => (
              <RoadmapPreviewCard key={roadmap.id} roadmap={roadmap} />
            ))}
          </div>
        )}

        {/* Load more trigger */}
        {hasNextPage && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {isFetchingNextPage ? (
              <div className="space-y-6 w-full">
                {[1, 2, 3].map((skeleton) => (
                  <RoadmapPreviewSkeleton key={skeleton} />
                ))}
              </div>
            ) : (
              <div className="text-zinc-400 text-sm">
                Scroll to load more...
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && allRoadmaps.length === 0 && <NoPostsMsg />}
      </div>
    </div>
  );
};

export default PostsPage;
