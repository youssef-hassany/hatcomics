export interface ComicIssue {
  aliases: string | null;
  api_detail_url: string;
  cover_date: string;
  date_added: string;
  date_last_updated: string;
  deck: string | null;
  description: string;
  has_staff_review: boolean;
  id: number;
  image: {
    icon_url: string;
    medium_url: string;
    screen_url: string;
    screen_large_url: string;
    small_url: string;
    super_url: string;
    thumb_url: string;
    tiny_url: string;
    original_url: string;
    image_tags: string;
  };
  associated_images: any[]; // You can replace `any` with a specific type if you know the structure
  issue_number: string;
  name: string;
  site_detail_url: string;
  store_date: string;
  volume: {
    api_detail_url: string;
    id: number;
    name: string;
    site_detail_url: string;
  };
  resource_type: string;
}
