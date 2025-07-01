interface AddedBy {
  id: string;
  username: string;
  email: string;
}

export interface ComicPreview {
  id: string;
  name: string;
  description?: string;
  publisher: string;
  authors: string;
  characters: string;
  numberOfIssues: number;
  image: string;
  isBeginnerFriendly: boolean;
  readingLinks: string[];
  addedBy: AddedBy;
  totalReviews: number;
  averageRating: number | null;
  createdAt: Date;
  updatedAt: Date;
}
