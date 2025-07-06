import { User } from "./User";

export interface PostPreview {
  id: string;
  title: string;
  user: User;
  comments: Comment[];
  likes: Likes[];
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
