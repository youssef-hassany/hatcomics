"use client";

import React from "react";
import {
  BookOpen,
  TrendingUp,
  Users,
  Trophy,
  Medal,
  Award,
  Coffee,
  Sparkles,
  Clock,
  ChevronRight,
} from "lucide-react";
import ComicCard from "@/components/comics/ComicCard";
import PostCard from "@/components/posts/PostCard";
import Avatar from "@/components/ui/avatar";
import { useGetTopComics } from "@/hooks/comics/useGetTopComics";
import { useGetTopPosts } from "@/hooks/posts/useGetTopPosts";
import { useGetTopUsers } from "@/hooks/user/useGetTopUsers";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import Link from "next/link";
import { useGetRecentBookClubPosts } from "@/hooks/book-club/useGetRecentBookClubPosts";
import ThoughtPreviewSkeleton from "@/components/book-club/ThoughtPreviewSkeleton";
import ThoughtPreview from "@/components/book-club/ThoughtPreview";
import { useGetComicsRecommendations } from "@/hooks/comics/useGetComicsRecommendations";
import PostCardSkeleton from "@/components/posts/PostCardSkeleton";
import { useGetRecentPosts } from "@/hooks/posts/useGetRecentPosts";

const HomePage = () => {
  const { data: topComics, isLoading: comicsLoading } = useGetTopComics();
  const { data: topPosts, isLoading: postsLoading } = useGetTopPosts();
  const { data: recentPosts, isLoading: recentPostsLoading } =
    useGetRecentPosts();
  const { data: topUsers, isLoading: usersLoading } = useGetTopUsers();
  const { data: currentUser } = useGetLoggedInUser();
  const { data: recentBookClubPosts, isLoading: bookClubLoading } =
    useGetRecentBookClubPosts();
  const { data: recommendations } = useGetComicsRecommendations();

  // Get top 3 users and find current user rank
  const top3Users = topUsers?.slice(0, 3) || [];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 3:
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return (
          <span className="w-4 h-4 flex items-center justify-center text-zinc-400 font-bold text-xs">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Welcome Header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">
          Welcome back, {currentUser?.fullname || "Comic Fan"}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
          Discover comics, posts, and community members
        </p>
      </div>

      {/* Community Leaders - Horizontal Scroll */}
      <section className="relative group">
        <div className="px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" />
            <h2 className="text-base sm:text-lg font-semibold text-zinc-100">
              Community Leaders
            </h2>
          </div>
        </div>

        {/* Current User Rank Card - if outside top 3 */}
        {currentUser?.rank && currentUser.rank > 3 && (
          <div className="px-4 sm:px-6 lg:px-8 mb-3">
            <div className="bg-linear-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar
                    url={currentUser.photo || "/placeholder-avatar.png"}
                    username={currentUser.username}
                    className="w-8 h-8"
                  />
                  <div>
                    <p className="text-white font-medium text-sm">Your Rank</p>
                    <p className="text-orange-400 text-xs">
                      @{currentUser.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {getRankIcon(currentUser.rank)}
                  <span className="text-white font-bold text-sm">
                    #{currentUser.rank}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <div className="flex gap-3 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 scrollbar-hide hover:scrollbar-modern">
            {usersLoading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-64 sm:w-72 bg-zinc-800/50 rounded-lg p-3 animate-pulse"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-zinc-700 rounded-full" />
                      <div className="flex-1">
                        <div className="h-3 bg-zinc-700 rounded mb-2 w-3/4" />
                        <div className="h-2 bg-zinc-700 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {top3Users.map((user, index) => (
                  <div
                    key={user.id}
                    className="shrink-0 w-64 sm:w-72 bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50 hover:border-zinc-600 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar
                          url={user.photo || "/placeholder-avatar.png"}
                          username={user.username}
                          className="w-10 h-10"
                        />
                        <div>
                          <p className="text-white font-medium text-sm">
                            {user.fullname}
                          </p>
                          <p className="text-zinc-400 text-xs">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {getRankIcon(index + 1)}
                        <span className="text-zinc-300 font-medium text-sm">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Netflix-style Horizontal Sections */}
      <div className="space-y-6 sm:space-y-8 pb-12">
        {/* Top Rated Comics - Compact Netflix Style */}
        <section className="relative">
          <div className="px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-orange-500" />
              <h2 className="text-base sm:text-lg font-semibold text-zinc-100">
                Top Rated Comics
              </h2>
            </div>
            <Link
              href="/comics"
              className="text-xs text-zinc-400 hover:text-zinc-300 flex items-center gap-1 transition-colors"
            >
              View All
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="relative">
            <div className="grid grid-flow-col auto-cols-[7rem] sm:auto-cols-[8rem] md:auto-cols-[9rem] gap-2 sm:gap-3 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 scrollbar-hide hover:scrollbar-modern">
              {comicsLoading ? (
                <>
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-zinc-800/50 rounded-lg animate-pulse min-h-70 sm:min-h-80 md:min-h-85"
                    />
                  ))}
                </>
              ) : (
                <>
                  {topComics?.map((comic) => (
                    <ComicCard key={comic.id} comic={comic} />
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Recommended Comics - Compact Netflix Style */}
        {recommendations?.recommendations &&
          recommendations?.recommendations.length > 0 && (
            <section className="relative">
              <div className="px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <h2 className="text-base sm:text-lg font-semibold text-zinc-100">
                    Recommended for You
                  </h2>
                </div>
                <Link
                  href="/comics"
                  className="text-xs text-zinc-400 hover:text-zinc-300 flex items-center gap-1 transition-colors"
                >
                  View All
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="relative">
                <div className="grid grid-flow-col auto-cols-[7rem] sm:auto-cols-[8rem] md:auto-cols-[9rem] gap-2 sm:gap-3 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 scrollbar-hide hover:scrollbar-modern">
                  {recommendations.recommendations.map((comic) => (
                    <ComicCard key={comic.id} comic={comic} />
                  ))}
                </div>
              </div>
            </section>
          )}

        {/* Book Club Activity - Horizontal Scroll */}
        <section className="relative">
          <div className="px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-emerald-500" />
              <h2 className="text-base sm:text-lg font-semibold text-zinc-100">
                Book Club Activity
              </h2>
            </div>
            <Link
              href="/book-clubs"
              className="text-xs text-zinc-400 hover:text-zinc-300 flex items-center gap-1 transition-colors"
            >
              View All
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="relative">
            <div className="flex gap-3 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 scrollbar-hide hover:scrollbar-modern">
              {bookClubLoading ? (
                <>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="shrink-0 w-80 sm:w-96">
                      <ThoughtPreviewSkeleton />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {recentBookClubPosts?.map((thought) => (
                    <div key={thought.id} className="shrink-0 w-80 sm:w-96">
                      <ThoughtPreview
                        comic={thought.comic}
                        thoughtContent={thought.content}
                        thoughtId={thought.id}
                        createdAt={thought.createdAt}
                        user={thought.user}
                        hasSpoiler={thought.hasSpoiler}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Latest Posts - Horizontal Scroll */}
        <section className="relative">
          <div className="px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <h2 className="text-base sm:text-lg font-semibold text-zinc-100">
                Latest Posts
              </h2>
            </div>
            <Link
              href="/posts"
              className="text-xs text-zinc-400 hover:text-zinc-300 flex items-center gap-1 transition-colors"
            >
              View All
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="relative">
            <div className="flex gap-3 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 scrollbar-hide hover:scrollbar-modern">
              {recentPostsLoading ? (
                <>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="shrink-0 w-80 sm:w-96">
                      <PostCardSkeleton />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {recentPosts?.map((post) => (
                    <div key={post.id} className="shrink-0 w-80 sm:w-96">
                      <PostCard post={post} />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Trending Posts - Horizontal Scroll */}
        <section className="relative">
          <div className="px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <h2 className="text-base sm:text-lg font-semibold text-zinc-100">
                Trending Posts
              </h2>
            </div>
            <Link
              href="/posts"
              className="text-xs text-zinc-400 hover:text-zinc-300 flex items-center gap-1 transition-colors"
            >
              View All
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="relative">
            <div className="flex gap-3 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 scrollbar-hide hover:scrollbar-modern">
              {postsLoading ? (
                <>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="shrink-0 w-80 sm:w-96">
                      <PostCardSkeleton />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {topPosts?.slice(0, 5).map((post) => (
                    <div key={post.id} className="shrink-0 w-80 sm:w-96">
                      <PostCard post={post} />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
