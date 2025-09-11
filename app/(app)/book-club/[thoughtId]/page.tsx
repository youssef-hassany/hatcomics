"use client";

import ThoughtPageSkeleton from "@/components/book-club/ThoughtPageSkeleton";
import { CommentsSection } from "@/components/comments";
import AttachmentsDisplay from "@/components/common/AttachmentsDisplay";
import PostActions from "@/components/posts/PostActions";
import PostLikeHandler from "@/components/posts/PostLikeHandler";
import Avatar from "@/components/ui/avatar";
import { useGetThought } from "@/hooks/book-club/useGetThought";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import { getTimeAgo } from "@/lib/date";
import { MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";

export default function ThoughtPage() {
  const { thoughtId } = useParams();

  const { data: thought, isPending } = useGetThought(thoughtId as string);
  const { data: loggedInUser } = useGetLoggedInUser();

  const isOwner = loggedInUser?.id === thought?.user.id;

  if (isPending) return <ThoughtPageSkeleton />;

  return (
    <div>
      <div className="py-8 bg-zinc-900"></div>

      {/* the post itself */}
      <article className="relative bg-zinc-900 border-b border-zinc-800 px-4 py-3">
        <div className="flex space-x-3">
          {/* Avatar Column */}
          <div className="flex-shrink-0">
            <Avatar
              url={thought?.user?.photo || "/placeholder-avatar.png"}
              username={thought?.user?.username as string}
            />
          </div>

          {/* Main Content Column */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-bold text-sm hover:underline">
                  {thought?.user?.fullname}
                </h3>
                <span className="text-zinc-500 text-sm">
                  @{thought?.user?.username}
                </span>
                <span className="text-zinc-500 text-sm">·</span>
                <span className="text-zinc-500 text-sm hover:underline">
                  {getTimeAgo(thought?.createdAt as string)}
                </span>
              </div>
            </div>

            {/* Content */}
            <>
              <div className="text-white text-sm leading-relaxed mb-2 prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none prose-zinc rich-text-editor whitespace-pre-wrap">
                <p>{thought?.content}</p>
              </div>
              {/* Attachments */}
              <AttachmentsDisplay attachments={thought?.attachments || []} />
            </>

            {/* Engagement Actions */}
            <div className="flex items-center gap-6 max-w-md mt-3">
              {/* Likes */}
              {/* @ts-expect-error: this error here won't affect anything because the type requires title which is not used in the component */}
              <PostLikeHandler post={thought} />

              {/* Comments */}
              <div className="flex items-center space-x-1 text-zinc-500">
                <button className="p-2 rounded-full">
                  <MessageCircle size={16} />
                </button>
                <span className="text-sm">{thought?._count?.comments}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-1 right-3">
          <PostActions
            isOwner={isOwner}
            onEdit={() => {}}
            postId={thought?.id as string}
            showEdit={false}
          />
        </div>
      </article>

      {/* Comments Section */}
      <CommentsSection postId={thought?.id || ""} />
    </div>
  );
}
