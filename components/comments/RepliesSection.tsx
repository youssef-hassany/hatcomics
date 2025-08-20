"use client";

import { Comment } from "@/types/Comment";
import AddCommentForm from "./AddCommentForm";
import RepliesList from "./RepliesList";

interface RepliesSectionProps {
  postId: string;
  commentId: string;
  replies: Comment[];
  showReplyForm?: boolean;
  parentComment?: Comment; // Add parent comment data
}

const RepliesSection = ({
  postId,
  commentId,
  replies,
  showReplyForm = false,
  parentComment,
}: RepliesSectionProps) => {
  return (
    <div className="mt-4 space-y-4">
      {/* Replies List */}
      {replies && replies.length > 0 && (
        <div>
          <RepliesList
            postId={postId}
            replies={replies}
            parentComment={parentComment}
          />
        </div>
      )}

      {/* Add Comment Form - Only show when showReplyForm is true */}
      {showReplyForm && (
        <div className="ml-8">
          <AddCommentForm postId={postId} commentId={commentId} addReply />
        </div>
      )}
    </div>
  );
};

export default RepliesSection;
