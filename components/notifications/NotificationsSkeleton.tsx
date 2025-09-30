export default function NotificationsSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-9 w-48 bg-zinc-800 rounded-lg mb-2 animate-pulse" />
          <div className="h-5 w-72 bg-zinc-800 rounded-lg animate-pulse" />
        </div>

        {/* Controls Skeleton */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-10 w-24 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-10 w-32 bg-zinc-800 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-40 bg-zinc-800 rounded-lg animate-pulse" />
        </div>

        {/* Notifications List Skeleton */}
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-4 rounded-lg border bg-zinc-900/50 border-zinc-800"
            >
              <div className="flex gap-4">
                {/* Icon Skeleton */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />

                {/* Content Skeleton */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-5 w-3/4 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-4 w-1/4 bg-zinc-800 rounded animate-pulse" />
                </div>

                {/* Actions Skeleton */}
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-zinc-800 rounded-lg animate-pulse" />
                  <div className="w-8 h-8 bg-zinc-800 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
