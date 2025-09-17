interface ReviewUser {
  id: string;
  username: string;
  fullname: string;
  photo?: string;
}

interface Comic {
  id: string;
  name: string;
  numberOfIssues: number;
  image?: string;
  isGraphicNovel: boolean;
}

export interface Review {
  id: string;
  user: ReviewUser;
  comic: Comic;
  rating: number;
  description?: string;
  spoiler: boolean;
  createdAt: string;
  updatedAt: string;
}
