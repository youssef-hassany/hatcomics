"use client";

import { useGetPostsByUsername } from "@/hooks/posts/useGetPostsByUsername";
import { useGetReviewsByUsername } from "@/hooks/reviews/useGetReviewsByUsername";
import React, { useState } from "react";
import PostCard from "../posts/PostCard";
import ComicReview from "../reviews/ComicReview";
import { Bookmark, Library, Newspaper, Star } from "lucide-react";
import ComicReviewSkeleton from "../reviews/ComicReviewSkeleton";
import PostCardSkeleton from "../posts/PostCardSkeleton";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import BookmarksList from "./BookmarksList";
import UserReadList from "./UserReadList";
import { UserProfile } from "@/types/User";
import { useGetUserByUsername } from "@/hooks/user/useGetUserByUsername";

interface Props {
  username: string;
  userProfileData: UserProfile;
}

type Tab = "reviews" | "posts" | "bookmarks" | "readlist";

const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: "reviews", icon: <Star className="w-4 h-4" />, label: "Reviews" },
  { id: "posts", icon: <Newspaper className="w-4 h-4" />, label: "Posts" },
  {
    id: "bookmarks",
    icon: <Bookmark className="w-4 h-4" />,
    label: "Bookmarks",
  },
  { id: "readlist", icon: <Library className="w-4 h-4" />, label: "Readlist" },
];

const ProfileContent = ({ username, userProfileData }: Props) => {
  const { data: user } = useGetLoggedInUser();
  const { data: userInProfile } = useGetUserByUsername(username);

  const { data: posts, isPending: isPostsLoading } =
    useGetPostsByUsername(username);
  const { data: reviews, isPending: isReviewsLoading } =
    useGetReviewsByUsername(username);

  const [content, setContent] = useState<Tab>("reviews");

  const visibleTabs = tabs.filter((tab) => {
    if (tab.id === "bookmarks") return user?.username === username;
    if (tab.id === "readlist") return !!userProfileData;
    return true;
  });

  const emptyMessage = (type: string) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-zinc-700/50 flex items-center justify-center mb-4">
        {type === "reviews" ? (
          <Star className="w-7 h-7 text-zinc-500" />
        ) : (
          <Newspaper className="w-7 h-7 text-zinc-500" />
        )}
      </div>
      <p className="text-zinc-400 font-medium">No {type} yet</p>
      <p className="text-zinc-600 text-sm mt-1">
        {username}&apos;s {type} will appear here
      </p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-zinc-700/60 overflow-hidden bg-zinc-800/80 backdrop-blur-sm">
      {/* Tab Bar */}
      <div className="flex border-b border-zinc-700/60 overflow-x-auto scrollbar-none">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setContent(tab.id)}
            className={`
              relative flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap
              transition-colors duration-200 flex-1 justify-center
              ${
                content === tab.id
                  ? "text-orange-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {content === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {content === "posts" &&
          (isPostsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((el) => (
                <PostCardSkeleton key={el} />
              ))}
            </div>
          ) : !posts?.length ? (
            emptyMessage("posts")
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ))}

        {content === "reviews" &&
          (isReviewsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((el) => (
                <ComicReviewSkeleton key={el} />
              ))}
            </div>
          ) : !reviews?.length ? (
            emptyMessage("reviews")
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <ComicReview key={review.id} review={review} />
              ))}
            </div>
          ))}

        {content === "bookmarks" && user?.username === username && (
          <BookmarksList />
        )}

        {content === "readlist" && userInProfile && (
          <UserReadList userId={userInProfile.id} />
        )}
      </div>
    </div>
  );
};

export default ProfileContent;
