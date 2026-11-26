import { RawBadge } from "./badge-types";

interface ReviewUser {
  id: string;
  username: string;
  fullname: string;
  photo?: string | null;
  points: number;
  role?: string;
  badges?: RawBadge[];
}

interface Comic {
  id: string;
  name: string;
  numberOfIssues: number;
  image?: string | null;
  description?: string | null;
  isGraphicNovel: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Review {
  id: string;
  user: ReviewUser;
  comic: Comic;
  rating: number;
  description?: string | null;
  spoiler: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  isLikedByCurrentUser: boolean;
  _count?: {
    likes: number;
    comments: number;
    bookmarks?: number;
  };
}
