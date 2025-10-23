export interface ArtTool {
  id: number;
  artName: string;
  image: string;
  price: number;
  description?: string;
  brand?: string;
  limitedTimeDeal?: number;
  feedbacks?: {
    rating: number;
    comment: string;
    author: string;
  }[];
  isFavorite?: boolean; // thêm để tránh lỗi khi truyền qua props
}
