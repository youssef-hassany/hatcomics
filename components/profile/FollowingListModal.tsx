import React from "react";
import { Modal } from "../ui/modal";
import { useFollowModalStore } from "@/store/followListsStore";
import { useGetFollowing } from "@/hooks/follow/useGetFollowing";
import { X, User } from "lucide-react";
import Link from "next/link";

const FollowingListModal = () => {
  const { isFollowingModalOpen, closeFollowingModal, username } =
    useFollowModalStore();
  const { data: following, isLoading, error } = useGetFollowing(username);

  return (
    <Modal isOpen={isFollowingModalOpen} onClose={closeFollowingModal}>
      <div className="bg-zinc-900 rounded-lg w-full max-w-md mx-auto max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-zinc-100">
              {username}&apos;s Following
            </h2>
          </div>
          <button
            onClick={closeFollowingModal}
            className="p-1 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          )}

          {error && (
            <div className="p-4 text-center">
              <p className="text-red-400">Failed to load following</p>
            </div>
          )}

          {following && following.length === 0 && (
            <div className="p-8 text-center">
              <User className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">No following yet</p>
            </div>
          )}

          {following && following.length > 0 && (
            <div className="p-2">
              {following.map((follower) => (
                <Link
                  onClick={() => closeFollowingModal()}
                  href={`/profile/${follower.username}`}
                  key={follower.id}
                  className="flex items-center justify-between p-3 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
                      {follower.photo ? (
                        <img
                          src={follower.photo}
                          alt={follower.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-zinc-400" />
                      )}
                    </div>

                    {/* User info */}
                    <div className="flex-1">
                      <h3 className="font-medium text-zinc-100">
                        {follower.fullname || follower.username}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        @{follower.username}
                      </p>
                      {follower.points && (
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                          {follower.points}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Follow/Unfollow button */}
                  {/* <div className="flex items-center space-x-2">
                    {follower.isFollowing ? (
                      <button
                        onClick={() => handleUnfollowUser(follower.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-md transition-colors text-sm"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Following</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFollowUser(follower.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors text-sm"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                      </button>
                    )}
                  </div> */}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer with count */}
        {following && following.length > 0 && (
          <div className="p-4 border-t border-zinc-800">
            <p className="text-sm text-zinc-400 text-center">
              {following.length}{" "}
              {following.length === 1 ? "following" : "followings"}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FollowingListModal;
