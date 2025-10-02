export type Role =
  | "owner"
  | "admin"
  | "content_creator"
  | "translator"
  | "seller"
  | "user";

export interface User {
  id: string;
  fullname: string;
  username: string;
  photo: string;
  points: number;
  role: Role;
  email: string;
  rank?: number;
  isBanned: boolean;
}

export interface UserProfile {
  id: string;
  fullname: string;
  username: string;
  photo: string;
  points: number;
  role: Role;
  email: string;
  isOwnProfile: boolean;
  isFollowed: boolean;
  followersCount: number;
  followingCount: number;
  bio: string;
  isBanned: boolean;
}
