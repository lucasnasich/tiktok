export type InspirationMediaSlide = {
  kind: "image" | "video";
  url: string;
  poster?: string;
};

export type InspirationLinkItem = {
  id: string;
  platform: string;
  url: string;
  title: string;
  previewImage?: string;
  media?: InspirationMediaSlide[];
  note?: string;
};

export type InspirationCommentItem = {
  id: string;
  platform: string;
  text: string;
  postUrl: string;
};
