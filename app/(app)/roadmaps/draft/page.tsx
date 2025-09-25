"use client";

import NoPostsMsg from "@/components/posts/NoPostsMsg";
import { RoadmapPreviewSkeleton } from "@/components/roadmap/RoadmapPreviewSkeleton";
import { RoadmapPreviewCard } from "@/components/roadmap/RoadmapPreview";
import { Map } from "lucide-react";
import { useGetRoadmapDrafts } from "@/hooks/roadmaps/useGetRoadmapDrafts";

const PostsPage: React.FC = () => {
  const { data: roadmapDrafts, isLoading } = useGetRoadmapDrafts();

  return (
    <div className="min-h-screen bg-zinc-900 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Map className="w-8 h-8 text-orange-600" />
              <h1 className="text-4xl font-bold">Roadmaps Drafts</h1>
            </div>
            <p className="text-zinc-200 text-lg max-w-2xl mb-6">
              Manage your created roadmaps freely before posting them
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

        {/* Posts List */}
        {!isLoading && (
          <div className="space-y-6">
            {roadmapDrafts?.map((roadmap) => (
              <RoadmapPreviewCard key={roadmap.id} roadmap={roadmap} isDraft />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && roadmapDrafts?.length === 0 && <NoPostsMsg />}
      </div>
    </div>
  );
};

export default PostsPage;
