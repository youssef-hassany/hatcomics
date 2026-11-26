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
import { resolveActiveBadge } from "@/lib/active-badge-resolver";
import BadgeDisplay from "@/components/ui/badge-display";
import RankProgressBar from "@/components/ui/RankProgressBar";

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

  if (isLoading) return <ProfilePageSkeleton />;

  if (error || !user) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-zinc-500" />
          </div>
          <p className="text-zinc-300 font-semibold mb-1">Profile not found</p>
          <p className="text-zinc-500 text-sm mb-5">
            We couldn&apos;t load this profile.
          </p>
          <button
            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            onClick={() => refetch()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getRoleStyle = (role: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      owner: { bg: "bg-purple-500/15", text: "text-purple-400" },
      admin: { bg: "bg-red-500/15", text: "text-red-400" },
      content_creator: { bg: "bg-blue-500/15", text: "text-blue-400" },
      translator: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
      seller: { bg: "bg-yellow-500/15", text: "text-yellow-400" },
      user: { bg: "bg-zinc-600/40", text: "text-zinc-400" },
    };
    return styles[role] ?? styles.user;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
      case "admin":
        return <Shield className="w-3 h-3" />;
      case "content_creator":
        return <Edit3 className="w-3 h-3" />;
      default:
        return <Award className="w-3 h-3" />;
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

  const roleStyle = getRoleStyle(user.role);

  // Resolve the active badge (special or rank-based)
  const activeBadge = resolveActiveBadge(user.points, user.badges ?? []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Cover / Hero strip */}
      <div className="h-32 sm:h-44 bg-linear-to-br from-orange-600/30 via-zinc-800 to-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff10 1px, transparent 1px), linear-gradient(to bottom, #ffffff10 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Avatar row — overlaps the cover */}
        <div className="relative -mt-14 sm:-mt-16 flex items-end justify-between mb-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={
                user.photo ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=f97316&color=fff&size=128`
              }
              alt={user.fullname}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-zinc-900 shadow-xl"
            />
            {/* Role badge */}
            <span
              className={`absolute -bottom-1.5 -right-1.5 flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border border-zinc-800 ${roleStyle.bg} ${roleStyle.text}`}
            >
              {getRoleIcon(user.role)}
            </span>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-2 mb-1">
            {user.isOwnProfile ? (
              <Button
                className="flex items-center gap-1.5 bg-zinc-700 hover:bg-zinc-600 text-white border border-zinc-600 rounded-xl text-sm"
                onClick={() => setIsEditProfileOpen(true)}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit Profile</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            ) : (
              <FollowHandler
                isFollowed={!!isFollowed}
                setIsFollowed={setIsFollowed}
                userId={user.id}
              />
            )}
          </div>
        </div>

        {/* Name + meta */}
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {user.fullname}
            </h1>

            {/* ── Rank / special badge icon next to name ── */}
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 shadow-inner">
              <BadgeDisplay badge={activeBadge} size="md" />
            </span>

            {/* Role pill */}
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${roleStyle.bg} ${roleStyle.text}`}
            >
              {getRoleIcon(user.role)}
              {user.role.replace(/_/g, " ").toUpperCase()}
            </span>
          </div>

          <p className="text-zinc-500 text-sm mb-3">@{user.username}</p>

          {user.bio && (
            <p className="text-zinc-300 text-sm leading-relaxed max-w-lg mb-4">
              {user.bio}
            </p>
          )}

          {/* Stats row */}
          <div className="flex flex-wrap gap-3">
            <StatPill
              label="Points"
              value={user.points.toLocaleString()}
              accent
            />
            <StatPill
              label="Followers"
              value={user.followersCount}
              onClick={() => openFollowersModal(user.username)}
            />
            <StatPill
              label="Following"
              value={user.followingCount}
              onClick={() => openFollowingModal(user.username)}
            />
          </div>
        </div>

        {/* ── Rank Progress Bar card ── */}
        <div className="bg-zinc-800/80 border border-zinc-700/60 rounded-2xl p-5 mb-6 backdrop-blur-sm">
          <RankProgressBar points={user.points} />
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-700/50 mb-6" />

        {/* Content tabs */}
        <div className="pb-12">
          <ProfileContent
            username={username as string}
            userProfileData={user}
          />
        </div>
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

/* ── Stat pill helper ── */
interface StatPillProps {
  label: string;
  value: string | number;
  accent?: boolean;
  onClick?: () => void;
}

const StatPill = ({ label, value, accent, onClick }: StatPillProps) => (
  <button
    onClick={onClick}
    disabled={!onClick}
    className={`
      flex flex-col items-center px-5 py-2.5 rounded-xl transition-all
      ${onClick ? "cursor-pointer hover:bg-zinc-700/70 active:scale-95" : "cursor-default"}
      bg-zinc-800 border border-zinc-700/60
    `}
  >
    <span
      className={`text-lg font-bold ${accent ? "text-orange-400" : "text-white"}`}
    >
      {value}
    </span>
    <span className="text-xs text-zinc-500 mt-0.5">{label}</span>
  </button>
);

export default ProfilePage;
