export interface ComicPreview {
  id: string;
  name: string;
  description?: string;
  publisher: string;
  authors: string[];
  characters: string[];
  numberOfIssues: number;
  image: string;
  isBeginnerFriendly: boolean;
  readingLinks: string[];
  totalReviews: number;
  averageRating: number | null;
  createdAt: Date;
  updatedAt: Date;
  ongoing: boolean;
  isReviewed: boolean;
}
