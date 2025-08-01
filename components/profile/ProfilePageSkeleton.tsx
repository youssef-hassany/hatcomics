import React from "react";

const ProfilePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header Skeleton */}
      <div className="bg-zinc-800 border-b border-zinc-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Title Skeleton */}
            <div className="h-8 w-64 bg-zinc-700 rounded-lg animate-pulse"></div>

            {/* Action Buttons Skeleton */}
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-zinc-700 rounded-lg animate-pulse"></div>
              <div className="h-10 w-24 bg-zinc-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content Skeleton */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Full Width Profile Card Skeleton */}
        <div className="bg-zinc-800 rounded-xl p-8 border border-zinc-700 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Picture Skeleton */}
            <div className="relative">
              <div className="w-32 h-32 bg-zinc-700 rounded-full animate-pulse border-4 border-zinc-600"></div>
              <div className="absolute -bottom-2 -right-2 bg-zinc-700 rounded-full p-2 animate-pulse">
                <div className="w-5 h-5 bg-zinc-600 rounded"></div>
              </div>
            </div>

            {/* User Info Skeleton */}
            <div className="flex-1 text-center md:text-left">
              {/* Name Skeleton */}
              <div className="h-9 w-48 bg-zinc-700 rounded-lg animate-pulse mb-2 mx-auto md:mx-0"></div>

              {/* Username and Role Skeleton */}
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="h-6 w-32 bg-zinc-700 rounded-lg animate-pulse"></div>
                <div className="h-6 w-24 bg-zinc-700 rounded-full animate-pulse"></div>
              </div>

              {/* Stats Skeleton */}
              <div className="flex justify-center md:justify-start gap-4">
                <div className="bg-zinc-700 rounded-lg p-4 text-center animate-pulse">
                  <div className="h-4 w-12 bg-zinc-600 rounded mb-2 mx-auto"></div>
                  <div className="h-6 w-16 bg-zinc-600 rounded mx-auto"></div>
                </div>
                <div className="bg-zinc-700 rounded-lg p-4 text-center animate-pulse">
                  <div className="h-4 w-16 bg-zinc-600 rounded mb-2 mx-auto"></div>
                  <div className="h-6 w-12 bg-zinc-600 rounded mx-auto"></div>
                </div>
                <div className="bg-zinc-700 rounded-lg p-4 text-center animate-pulse">
                  <div className="h-4 w-16 bg-zinc-600 rounded mb-2 mx-auto"></div>
                  <div className="h-6 w-12 bg-zinc-600 rounded mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Action Button Skeleton */}
            <div className="flex flex-col gap-3">
              <div className="h-10 w-24 bg-zinc-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Buttons Skeleton */}
        <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
          <div className="flex justify-between gap-4">
            <div className="h-12 w-24 bg-zinc-700 rounded-lg animate-pulse"></div>
            <div className="h-12 w-20 bg-zinc-700 rounded-lg animate-pulse"></div>
            <div className="h-12 w-28 bg-zinc-700 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;
