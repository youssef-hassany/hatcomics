"use client";

import { Comment } from "@/types/Comment";
import AddCommentForm from "./AddCommentForm";
import RepliesList from "./RepliesList";
import { ContentType } from "@/types/Common";

interface RepliesSectionProps {
  referenceId: string;
  type: ContentType;
  commentId: string;
  replies: Comment[];
  showReplyForm?: boolean;
  parentComment?: Comment; // Add parent comment data
}

const RepliesSection = ({
  referenceId,
  type,
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
            referenceId={referenceId}
            replies={replies}
            parentComment={parentComment}
            type={type}
          />
        </div>
      )}

      {/* Add Comment Form - Only show when showReplyForm is true */}
      {showReplyForm && (
        <div className="ml-8">
          <AddCommentForm
            referenceId={referenceId}
            type={type}
            commentId={commentId}
            addReply
          />
        </div>
      )}
    </div>
  );
};

export default RepliesSection;
