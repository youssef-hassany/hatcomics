import { ListType } from "@prisma/client";
import { ComicPreview } from "./Comic";

type ListContentType = "comic" | "character";

export interface ListPreviewType {
  id: string;
  title: string;
  image: string;
  creator: {
    fullname: string;
    username: string;
    photo: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
  entries: ListEntry[];
  type: ListType;
}

export interface ListEntry {
  id: string;
  listId: string;
  order: number;
  title: string;
  image?: string;
}

export interface ListEntryMutation {
  listId: string;
  title: string;
  image?: string;
}
