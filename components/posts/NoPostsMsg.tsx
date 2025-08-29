import Link from "next/link";
import React from "react";

const NoPostsMsg = () => {
  return (
    <div className="text-center py-12">
      <div className="bg-zinc-800 rounded-lg p-8 border border-zinc-700">
        <div className="text-zinc-400 text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
        <p className="text-zinc-400 mb-6">
          Be the first to share something with the community!
        </p>
        <Link
          href="/posts/create"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Create First Post
        </Link>
      </div>
    </div>
  );
};

export default NoPostsMsg;
