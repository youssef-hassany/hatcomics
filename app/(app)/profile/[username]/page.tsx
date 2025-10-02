"use client";

import React, { useEffect, useState } from "react";
import { User, Edit3, Award, Shield } from "lucide-react";
import { useGetUserByUsername } from "@/hooks/user/useGetUserByUsername";
import { useParams } from "next/navigation";
import ProfilePageSkeleton from "@/components/profile/ProfilePageSkeleton";
import FollowHandler from "@/components/profile/FollowHandler";
import { useFollowModalStore } from "@/store/followListsStore";
import FollowersListModal from "@/components/profile/FollowersListModal";
import FollowingListModal from "@/components/profile/FollowingListModal";
import ProfileContent from "@/components/profile/ProfileContent";
import { Button } from "@/components/ui/button";
import EditProfileModal from "@/components/profile/EditProfileModal";
import UserBannedMsg from "@/components/common/UserBannedMsg";
import { UnBanUserModal } from "@/components/user/UnBanUserModal";

const ProfilePage = () => {
  const { username } = useParams();

  const { openFollowersModal, openFollowingModal } = useFollowModalStore();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserByUsername(username as string);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isFollowed, setIsFollowed] = useState(user?.isFollowed);

  useEffect(() => {
    setIsFollowed(user?.isFollowed);
  }, [user]);

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">
            Failed to load profile
          </div>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={() => refetch()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    const colors = {
      owner: "bg-purple-500",
      admin: "bg-red-500",
      content_creator: "bg-blue-500",
      translator: "bg-green-500",
      seller: "bg-yellow-500",
      user: "bg-gray-500",
    };
    return colors[role as keyof typeof colors] || "bg-gray-500";
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "content_creator":
        return <Edit3 className="w-4 h-4" />;
      case "translator":
        return <Award className="w-4 h-4" />;
      case "seller":
        return <Award className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  if (user.isBanned) {
    return (
      <>
        <UserBannedMsg isBanned={user.isBanned} userId={user.id} />
        <UnBanUserModal />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <div className="bg-zinc-800 border-b border-zinc-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {user.fullname}&apos;s Profile
            </h1>
            {user.isOwnProfile && (
              <div className="flex gap-3">
                <Button
                  className="flex items-center gap-2"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden md:inline">Edit Profile</span>
                </Button>
                {/* <button className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </button> */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Full Width Profile Card */}
        <div className="bg-zinc-800 rounded-xl p-8 border border-zinc-700 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={
                  user.photo ||
                  `https://ui-avatars.com/api/?name=${user.fullname}&background=f97316&color=fff&size=120`
                }
                alt={user.fullname}
                className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
              />
              <div className="absolute -bottom-2 -right-2 bg-orange-500 rounded-full p-2">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">{user.fullname}</h2>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <p className="text-zinc-400 text-lg">@{user.username}</p>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-white ${getRoleColor(
                    user.role
                  )}`}
                >
                  {getRoleIcon(user.role)}
                  {user.role.replace("_", " ").toUpperCase()}
                </div>
              </div>

              <p className="text-zinc-400 text-lg mb-4">
                &ldquo;{user.bio}&ldquo;
              </p>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-4">
                <div className="bg-zinc-700 rounded-lg p-4 text-center">
                  <div className="text-sm text-zinc-400">Points</div>
                  <div className="text-xl font-bold text-orange-500">
                    {user.points.toLocaleString()}
                  </div>
                </div>

                <div
                  className="bg-zinc-700 rounded-lg p-4 text-center cursor-pointer"
                  onClick={() => openFollowersModal(user.username)}
                >
                  <div className="text-sm text-zinc-400">Followers</div>
                  <div className="text-xl font-bold text-white">
                    {user.followersCount}
                  </div>
                </div>

                <div
                  className="bg-zinc-700 rounded-lg p-4 text-center cursor-pointer"
                  onClick={() => openFollowingModal(user.username)}
                >
                  <div className="text-sm text-zinc-400">Following</div>
                  <div className="text-xl font-bold text-white">
                    {user.followingCount}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!user.isOwnProfile && (
              <div className="flex flex-col gap-3">
                <FollowHandler
                  isFollowed={!!isFollowed}
                  setIsFollowed={setIsFollowed}
                  userId={user.id}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <ProfileContent username={username as string} userProfileData={user} />
      </div>

      <FollowersListModal />
      <FollowingListModal />
      <EditProfileModal
        user={user}
        isEditProfileOpen={isEditProfileOpen}
        setIsEditProfileOpen={setIsEditProfileOpen}
      />
    </div>
  );
};

export default ProfilePage;
