"use client";

import AddCommentForm from "./AddCommentForm";
import CommentsList from "./CommentsList";

interface CommentsSectionProps {
  referenceId: string;
  type: "post" | "review" | "roadmap";
}

const CommentsSection = ({ referenceId, type }: CommentsSectionProps) => {
  return (
    <div className="space-y-6 bg-zinc-900 rounded-xl p-4">
      {/* Add Comment Form */}
      <div>
        <AddCommentForm referenceId={referenceId} type={type} />
      </div>

      {/* Comments List */}
      <div>
        <h3 className="text-xl font-semibold text-zinc-100 mb-4">Comments</h3>
        <CommentsList referenceId={referenceId} type={type} />
      </div>
    </div>
  );
};

export default CommentsSection;
