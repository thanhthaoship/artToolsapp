export type ArtTool = {
  id: string;
  artName: string;
  price: number;
  description?: string;
  glassSurface?: boolean;
  image?: string;
  brand?: string;
  limitedTimeDeal?: number;
  feedbacks?: {
    rating: number;
    comment: string;
    author: string;
    date: string;
  }[];
};
