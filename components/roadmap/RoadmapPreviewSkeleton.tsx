export function RoadmapPreviewSkeleton() {
  return (
    <div className="block bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="w-full h-48 bg-zinc-800" />

      {/* Content Skeleton */}
      <div className="p-5">
        {/* Title Skeleton */}
        <div className="mb-2">
          <div className="h-6 bg-zinc-800 rounded-md mb-1" />
          <div className="h-6 bg-zinc-800 rounded-md w-3/4" />
        </div>

        {/* Description Skeleton */}
        <div className="mb-4">
          <div className="h-4 bg-zinc-800 rounded-md mb-1" />
          <div className="h-4 bg-zinc-800 rounded-md mb-1" />
          <div className="h-4 bg-zinc-800 rounded-md w-2/3" />
        </div>

        {/* Stats Skeleton */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-zinc-800 rounded-sm" />
            <div className="w-4 h-3 bg-zinc-800 rounded-sm" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-zinc-800 rounded-sm" />
            <div className="w-4 h-3 bg-zinc-800 rounded-sm" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-zinc-800 rounded-sm" />
            <div className="w-4 h-3 bg-zinc-800 rounded-sm" />
          </div>
        </div>

        {/* Creator Info Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar Skeleton */}
            <div className="w-8 h-8 rounded-full bg-zinc-800" />

            {/* Creator Details Skeleton */}
            <div>
              <div className="h-4 bg-zinc-800 rounded-md w-20 mb-1" />
              <div className="h-3 bg-zinc-800 rounded-md w-16" />
            </div>
          </div>

          {/* Date Skeleton */}
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-zinc-800 rounded-sm" />
            <div className="w-12 h-3 bg-zinc-800 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Multiple skeletons component for loading grids
export function RoadmapPreviewSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <RoadmapPreviewSkeleton key={index} />
      ))}
    </>
  );
}
