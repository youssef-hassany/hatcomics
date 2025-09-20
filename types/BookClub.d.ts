export interface ThoughtPreviewType {
  comic: {
    image: string;
    id: string;
    name: string;
  };
  thoughtId: string;
  thoughtContent: string;
  user: {
    username: string;
    photo: string;
    fullname: string;
  };
  createdAt: string;
}

export interface ThoughtPreviewResponse {
  comic: {
    image: string;
    id: string;
    name: string;
  };
  id: string;
  content: string;
  user: {
    username: string;
    photo: string;
    fullname: string;
  };
  createdAt: string;
}
