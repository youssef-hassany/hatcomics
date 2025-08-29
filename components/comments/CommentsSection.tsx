"use client";

import AddCommentForm from "./AddCommentForm";
import CommentsList from "./CommentsList";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = ({ postId }: CommentsSectionProps) => {
  return (
    <div className="space-y-6 bg-zinc-900 rounded-xl p-4">
      {/* Add Comment Form */}
      <div>
        <AddCommentForm postId={postId} />
      </div>

      {/* Comments List */}
      <div>
        <h3 className="text-xl font-semibold text-zinc-100 mb-4">Comments</h3>
        <CommentsList postId={postId} />
      </div>
    </div>
  );
};

export default CommentsSection;
