"use client";

import NoPostsMsg from "@/components/posts/NoPostsMsg";
import { RoadmapPreviewSkeleton } from "@/components/roadmap/RoadmapPreviewSkeleton";
import { RoadmapPreviewCard } from "@/components/roadmap/RoadmapPreview";
import { Map, FileText, Globe } from "lucide-react";
import { useGetRoadmapDrafts } from "@/hooks/roadmaps/useGetRoadmapDrafts";
import { useMemo } from "react";

const PostsPage: React.FC = () => {
  const { data: roadmaps, isLoading } = useGetRoadmapDrafts();

  // Classify roadmaps into posted and drafts
  const { postedRoadmaps, draftRoadmaps } = useMemo(() => {
    if (!roadmaps) return { postedRoadmaps: [], draftRoadmaps: [] };

    const posted = roadmaps.filter((roadmap) => roadmap.isPublic);
    const drafts = roadmaps.filter((roadmap) => !roadmap.isPublic);

    return { postedRoadmaps: posted, draftRoadmaps: drafts };
  }, [roadmaps]);

  return (
    <div className="min-h-screen bg-zinc-900 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Map className="w-8 h-8 text-orange-600" />
              <h1 className="text-4xl font-bold">My Roadmaps</h1>
            </div>
            <p className="text-zinc-200 text-lg max-w-2xl mb-6">
              Manage your created roadmaps and drafts
            </p>
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

        {/* Content when loaded */}
        {!isLoading && (
          <>
            {/* Posted Roadmaps Section */}
            <div className="mb-12">
              {/* Draft Roadmaps Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-orange-500" />
                  <h2 className="text-2xl font-bold text-white">
                    Draft Roadmaps
                  </h2>
                  <span className="bg-orange-500/20 text-orange-400 text-sm px-2 py-1 rounded-full">
                    {draftRoadmaps.length}
                  </span>
                </div>

                {draftRoadmaps.length > 0 ? (
                  <div className="space-y-6">
                    {draftRoadmaps.map((roadmap) => (
                      <RoadmapPreviewCard
                        key={roadmap.id}
                        roadmap={roadmap}
                        isDraft={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-zinc-800 rounded-lg p-6 text-center">
                    <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <p className="text-zinc-400">No draft roadmaps</p>
                    <p className="text-zinc-500 text-sm mt-1">
                      Your unpublished roadmaps will appear here
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-green-500" />
                <h2 className="text-2xl font-bold text-white">
                  Posted Roadmaps
                </h2>
                <span className="bg-green-500/20 text-green-400 text-sm px-2 py-1 rounded-full">
                  {postedRoadmaps.length}
                </span>
              </div>

              {postedRoadmaps.length > 0 ? (
                <div className="space-y-6">
                  {postedRoadmaps.map((roadmap) => (
                    <RoadmapPreviewCard
                      key={roadmap.id}
                      roadmap={roadmap}
                      isDraft={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-zinc-800 rounded-lg p-6 text-center">
                  <Globe className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-400">No posted roadmaps yet</p>
                  <p className="text-zinc-500 text-sm mt-1">
                    Your published roadmaps will appear here
                  </p>
                </div>
              )}
            </div>

            {/* Empty State - when no roadmaps at all */}
            {roadmaps?.length === 0 && <NoPostsMsg />}
          </>
        )}
      </div>
    </div>
  );
};

export default PostsPage;
