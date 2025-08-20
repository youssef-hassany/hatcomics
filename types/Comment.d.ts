import { User } from "./User";

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  attachment?: string | null;
  replyTo: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  likes?: Like[];
  isLikedByCurrentUser?: boolean;
  replies: Comment[];
}

export interface Like {
  id: string;
  userId: string;
  postId?: string;
  commentId?: string;
  createdAt: Date;
  user?: User;
}

export interface CreateCommentData {
  content: string;
  attachment?: File;
}
