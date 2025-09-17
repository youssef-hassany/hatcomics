interface ReadingLinkData {
  id: string;
  comicId: string;
  url: string;
  translatorName: string;
  language: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

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
  isIndie: boolean;
  isGraphicNovel: boolean;
  isReviewed: boolean;
  isInReadlist: boolean;
  readingLinksData: ReadingLinkData[];
}
