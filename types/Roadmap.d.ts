export interface RoadmapType {
  id: string;
  title: string;
  description: string;
  image: string | null;
  createdAt: string;
  creator: {
    id: string;
    fullname: string;
    username: string;
    photo: string | null;
  };
  _count: {
    entries: number;
    comments: number;
    likes: number;
  };
  entries: RoadmapEntry[];
  isPublic: boolean;
  isLikedByCurrentUser: boolean;
}

export interface RoadmapEntry {
  id: string;
  roadmapId: string;
  order: number;
  title: string;
  description?: string;

  // Comic fields - now directly on the entry
  comicId?: string; // For local comics
  externalId?: string; // Comic Vine ID
  externalSource?: string; // "comicvine"
  comicName: string;
  publisher?: string;
  image?: string;
  issueNumber?: string;
  comicDescription?: string;

  // Relation to local comic (if comicId is set)
  comic?: {
    id: string;
    name: string;
    image?: string;
    description?: string;
    publisher?: string;
    issueNumber?: string;
    // ... other comic fields
  };
}

export interface RoadmapPreviewType {
  id: string;
  title: string;
  description: string;
  image: string | null;
  createdAt: string;
  creator: {
    id: string;
    fullname: string;
    username: string;
    photo: string | null;
  };
  _count: {
    entries: number;
    comments: number;
    likes: number;
  };
}

// Simplified since each entry now has only one comic
export interface RoadmapComic {
  id: string;
  source: "local" | "comicvine";
  // Comic Vine specific fields (only needed if source is 'comicvine')
  name?: string;
  publisher?: string;
  image?: string;
  issueNumber?: string;
  description?: string;
}

export interface AddEntryRequest {
  title: string;
  description?: string;
  order: number;
  comic: RoadmapComic; // Now exactly one comic (tuple type)
}

export interface ReorderRequest {
  entryOrders: Array<{
    entryId: string;
    newOrder: number;
  }>;
}

export interface ImportedComic {
  comicId?: string;
  name: string;
  image: string;
  description: string;
  externalId?: number; // Comic Vine ID
  externalSource?: string; // "comicvine"
  publisher?: string;
  issueNumber?: number;
}

export interface ComicToReOrder {
  id: string;
  title: string;
  image: string;
  order: number;
}
