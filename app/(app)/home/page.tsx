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

const HomePage = () => {
  const { data: topComics, isLoading: comicsLoading } = useGetTopComics();
  const { data: topPosts, isLoading: postsLoading } = useGetTopPosts();
  const { data: topUsers, isLoading: usersLoading } = useGetTopUsers();
  const { data: currentUser } = useGetLoggedInUser();
  const { data: recentBookClubPosts, isLoading: bookClubLoading } =
    useGetRecentBookClubPosts();

  // Get top 3 users and find current user rank
  const top3Users = topUsers?.slice(0, 3) || [];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-zinc-400 font-bold text-sm">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8 pt-6 md:pt-0">
          <h1 className="text-3xl font-bold mb-2 text-zinc-100">
            Welcome back, {currentUser?.fullname || "Comic Fan"}!
          </h1>
          <p className="text-zinc-400">
            Discover the best comics, posts, and community members
          </p>
        </div>

        {/* Top Rated Comics Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-100">
                Top Rated Comics
              </h2>
              <p className="text-zinc-400 text-sm">
                Highest rated comics by the community
              </p>
            </div>
          </div>

          {comicsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-zinc-800 rounded-xl h-96 animate-pulse border border-zinc-700"
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-modern">
              {topComics?.map((comic) => (
                <div key={comic.id} className="flex-shrink-0 w-56">
                  <ComicCard comic={comic} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Book Club Activity Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-100">
                Book Club Activity
              </h2>
              <p className="text-zinc-400 text-sm">
                Latest discussions in comic book clubs
              </p>
            </div>
          </div>

          {bookClubLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((i) => (
                <ThoughtPreviewSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookClubPosts?.map((thought) => (
                <ThoughtPreview
                  comic={thought.comic}
                  thoughtContent={thought.content}
                  thoughtId={thought.id}
                  createdAt={thought.createdAt}
                  user={thought.user}
                  key={thought.id}
                />
              ))}
            </div>
          )}

          {/* Show More Link */}
          {recentBookClubPosts && recentBookClubPosts.length > 3 && (
            <div className="mt-4 text-center">
              <Link
                href="/book-clubs"
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors duration-200"
              >
                View all book club activity →
              </Link>
            </div>
          )}
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Top Posts Section */}
          <section className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-100">
                  Trending Posts
                </h2>
                <p className="text-zinc-400 text-sm">
                  Most engaging discussions in the community
                </p>
              </div>
            </div>

            {postsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-zinc-800 rounded-lg h-32 animate-pulse border border-zinc-700"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topPosts?.slice(0, 3).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </section>

          {/* Top Users & Current User Rank Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-100">
                  Community Leaders
                </h2>
                <p className="text-zinc-400 text-sm">
                  Top contributors this month
                </p>
              </div>
            </div>

            {/* Current User Rank Card */}
            {currentUser?.rank && currentUser.rank > 3 && (
              <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      url={currentUser.photo || "/placeholder-avatar.png"}
                      username={currentUser.username}
                    />
                    <div>
                      <p className="text-white font-medium">Your Rank</p>
                      <p className="text-orange-300 text-sm">
                        {currentUser.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getRankIcon(currentUser?.rank)}
                    <span className="text-white font-bold">
                      #{currentUser?.rank}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Top 3 Users */}
            {usersLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-zinc-800 rounded-xl p-4 animate-pulse border border-zinc-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-zinc-700 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-zinc-700 rounded mb-2" />
                        <div className="h-3 bg-zinc-700 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {top3Users.map((user, index) => (
                  <div
                    key={user.id}
                    className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 hover:border-zinc-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar
                          url={user.photo || "/placeholder-avatar.png"}
                          username={user.username}
                        />
                        <div>
                          <p className="text-white font-medium">
                            {user.fullname}
                          </p>
                          <p className="text-zinc-400 text-sm">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getRankIcon(index + 1)}
                        <span className="text-zinc-300 font-medium">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
