"use client";

import { useState } from "react";
import { useGetLoggedInUser } from "@/hooks/user/useGetLoggedInUser";
import { Comment as CommentType } from "@/types/Comment";
import { ChevronDown } from "lucide-react";
import Comment from "./Comment";

interface RepliesListProps {
  referenceId: string;
  type: "post" | "review";
  replies: CommentType[];
  parentComment?: CommentType; // Add parent comment for context
}

const RepliesList = ({
  referenceId,
  type,
  replies,
  parentComment,
}: RepliesListProps) => {
  const { data: loggedInUser } = useGetLoggedInUser();

  const [visibleCount, setVisibleCount] = useState(5);

  const handleShowMore = () => {
    setVisibleCount((prev: number) => Math.min(prev + 5, replies?.length || 0));
  };

  const visibleReplies = replies?.slice(0, visibleCount) || null;
  const remainingCount = replies?.length - visibleCount || 0;

  return (
    <div className="space-y-2">
      {visibleReplies?.map((reply: CommentType) => (
        <Comment
          key={reply.id}
          comment={reply}
          isOwner={loggedInUser?.id === reply.userId}
          referenceId={referenceId}
          isReply
          parentComment={parentComment}
          type={type}
        />
      ))}

      {remainingCount > 0 && (
        <button
          onClick={handleShowMore}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-300 text-sm font-medium py-3 px-4 rounded-lg hover:bg-zinc-800/50 transition-colors w-full justify-center mt-4 ml-8"
        >
          <ChevronDown className="w-4 h-4" />
          Show more replies ({remainingCount})
        </button>
      )}
    </div>
  );
};

export default RepliesList;
