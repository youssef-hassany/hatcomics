import { RoadmapPreviewSkeleton } from "@/components/roadmap/RoadmapPreviewSkeleton";
import { Map, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-zinc-900 py-8">
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

        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((roadmap) => (
            <RoadmapPreviewSkeleton key={roadmap} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
