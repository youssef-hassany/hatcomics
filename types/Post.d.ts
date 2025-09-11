import { User } from "./User";

export interface PostPreview {
  id: string;
  title: string;
  user: User;
  likes: Likes[];
  isLikedByCurrentUser: boolean;
  isBookmarked: boolean;
  _count: {
    bookmarks: number;
    likes: number;
    comments: number;
  };
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  isDraft: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  isLikedByCurrentUser: boolean;
  _count?: {
    comments: number;
    likes: number;
    bookmarks: number;
  };
  likes?: any[];
}

export type PostWithUser = {
  id: string;
  userId: string;
  title: string;
  content: string;
  isDraft: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  isLikedByCurrentUser: boolean;
};

export interface PostWithRelations extends Post {
  user: {
    id: string;
    // Add other user fields as needed
  };
  comments: Comment[];
  likes: Like[];
}

export interface CreatePostData {
  userId: string;
  title: string;
  content: string;
  isDraft?: boolean; // Optional since it has a default value
}

export interface UpdatePostData {
  id: string;
  title?: string;
  content?: string;
  isDraft?: boolean;
}

export interface DraftPreview {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export interface ThoughtPreview {
  id: string;
  content: string;
  user: User;
  likes: Likes[];
  isLikedByCurrentUser: boolean;
  isBookmarked: boolean;
  _count: {
    bookmarks: number;
    likes: number;
    comments: number;
  };
  hasSpoiler: boolean;
  attachments: string[];
  createdAt: string;
}
