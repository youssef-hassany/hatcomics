import React from "react";

const NoReviewsMsg = () => {
  return (
    <div className="text-center py-12">
      <div className="bg-zinc-800 rounded-lg p-8 border border-zinc-700">
        <div className="text-zinc-400 text-6xl mb-4">📖</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No reviews yet
        </h3>
        <p className="text-zinc-400 mb-6">
          Be the first to share your thoughts on a comic!
        </p>
      </div>
    </div>
  );
};

export default NoReviewsMsg;
