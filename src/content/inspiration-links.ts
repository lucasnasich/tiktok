export type InspirationMediaSlide = {
  kind: "image" | "video";
  url: string;
  poster?: string;
  /** URL del post o elemento original (Cosmos, IG, etc.). */
  sourceUrl?: string;
};

export type InspirationLinkItem = {
  id: string;
  platform: string;
  sourceLabel?: string;
  url: string;
  title: string;
  postText?: string;
  author?: string;
  previewImage?: string;
  media?: InspirationMediaSlide[];
  note?: string;
  /** IDs de `formats.ts` — plantilla creativa del post. */
  formatIds?: string[];
};

export type InspirationCommentItem = {
  id: string;
  platform: string;
  text: string;
  postUrl: string;
};
