// app/types/index.ts

export type Article = {
  id: string;
  title: string;
  content: string;
  media_url?: string;
  media_type?: "image" | "video";
};

export type Review = {
  id: number;
  name: string;
  date: string;
  text: string;
  avatar?: string;
  screenshot?: string;
};

export type ReviewsProps = {
  reviews: Review[];
};

export interface DeleteResponse {
  success: boolean;
  error?: string;
}
